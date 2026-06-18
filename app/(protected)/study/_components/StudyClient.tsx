'use client'
import FlashcardsStatus from '@/components/Status'
import {cn} from '@/lib/utils/cn'
import type {Flashcard, FlashcardResponseQuality} from '@/types/study'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useRouter} from 'next/navigation'
import {useEffect, useRef, useState} from 'react'
import {toast} from 'react-toastify'
import AnswerDisplay from './AnswerDisplay'
import Buttons from './Buttons'
import FlashcardComponent, {Skeleton as FlashcardComponentSkeleton} from './Flashcard'
import ProgressBar, {Skeleton as ProgressBarSkeleton} from './ProgressBar'
import Textarea, {Skeleton as TextareaSkeleton} from './Textarea'

interface Props {
	initialFlashcard: Flashcard | null
	initialDone: number
	toReviewToday: number
}

export type UserAnswer = {
	answer: string
	isAnswered: boolean
	isCorrect: boolean
	hintCount: number
}

export default function StudyClient({initialFlashcard, initialDone, toReviewToday}: Props) {
	const router = useRouter()
	const [isDesktop, setIsDesktop] = useState(false)
	const textfieldRef = useRef<HTMLTextAreaElement | null>(null)
	const queryClient = useQueryClient()
	const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard | null>(initialFlashcard)
	const [doneToday, setDoneToday] = useState(initialDone ?? 0)
	const inFlight = useRef<Set<number>>(new Set())
	const successSoundRef = useRef<HTMLAudioElement | null>(null)
	const [userAnswer, setUserAnswer] = useState<UserAnswer>({
		answer: '',
		isAnswered: false,
		isCorrect: false,
		hintCount: 0,
	})

	useEffect(() => {
		if (typeof window !== 'undefined') {
			successSoundRef.current = new Audio('/sounds/success.mp3')
		}
	}, [])

	// fetch queue of next flashcards
	const {
		data: queue = [],
		isEnabled: queueEnabled,
		isError: isQueueError,
	} = useQuery({
		queryKey: ['nextFlashcards'],
		queryFn: async ({signal}) => {
			let desiredQueueSize = 10
			const toReview = toReviewToday - doneToday
			if (toReview < desiredQueueSize) desiredQueueSize = toReview

			const existing: Flashcard[] = queryClient.getQueryData(['nextFlashcards']) ?? []
			const missing = Math.max(0, desiredQueueSize - existing.length)
			if (missing === 0) return existing

			const excludeSet = new Set(existing.map(flashcard => flashcard.id))
			if (currentFlashcard) excludeSet.add(currentFlashcard.id)
			// not include flashcards that are currently being reviewed (inFlight)
			inFlight.current.forEach(id => excludeSet.add(id))
			const exclude = Array.from(excludeSet).join(',')

			const res = await fetch(`/api/study/prefetch?limit=${missing}${exclude ? `&excludeIds=${exclude}` : ''}`, {
				signal,
			})
			if (!res.ok) throw new Error('Failed to prefetch')
			const fetched: Flashcard[] = await res.json()

			// for safety, but excludeIds should ensure that fetched does not contain id from existing
			const existingIds = new Set(existing.map(flashcard => flashcard.id))
			const newFlashcards = fetched.filter(flashcard => !existingIds.has(flashcard.id))

			const merged = [...existing, ...newFlashcards]
			return merged
		},

		refetchOnWindowFocus: false,
		staleTime: 1000 * 60,
		enabled: doneToday < toReviewToday,
	})

	// mutation to update flashcard after answer
	const {mutate} = useMutation({
		mutationFn: async ({flashcardId, q}: {flashcardId: number; q: number}) => {
			const flashcardRes = await fetch('/api/study/update', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({flashcardId, q}),
			})

			if (!flashcardRes.ok) {
				const text = await flashcardRes.text()
				throw new Error(text || 'update failed')
			}

			const flashcard = await flashcardRes.json()
			return {
				flashcard,
			}
		},
		onMutate: async (variables: {flashcardId: number; q: number}) => {
			await queryClient.cancelQueries({queryKey: ['nextFlashcards']})
			const prevQueue = queryClient.getQueryData<Flashcard[]>(['nextFlashcards']) ?? []
			const prevCurrentFlashcard = currentFlashcard
			const prevUserAnswer = userAnswer

			const newQueue = prevQueue.filter(flashcard => flashcard.id !== variables.flashcardId)
			if (variables.q < 3) {
				if (prevCurrentFlashcard) newQueue.push(prevCurrentFlashcard)
			}

			if (variables.q >= 3) setDoneToday(done => done + 1)
			if (prevCurrentFlashcard?.id === variables.flashcardId) {
				setCurrentFlashcard(newQueue.length ? newQueue[0] : null)
			}
			setUserAnswer({answer: '', isAnswered: false, isCorrect: false, hintCount: 0})

			// update cache immediately
			queryClient.setQueryData(['nextFlashcards'], newQueue)

			return {prevQueue, prevCurrentFlashcard, prevUserAnswer}
		},
		onSuccess: async () => {
			if (doneToday === toReviewToday) {
				successSoundRef.current?.play().catch(error => {
					console.error('Failed to play success sound:', error)
				})
				const streakRes = await fetch('/api/profile/streak/update', {method: 'POST'})
				if (!streakRes.ok) {
					toast.error('Error: Failed to update streak. Please try again.')
				}
				queryClient.invalidateQueries({queryKey: ['profile']})
				router.refresh()
			}
		},
		onError: (error, data, context) => {
			console.error('Mutation failed', error)

			// rollback optimistic cache
			if (context?.prevQueue) queryClient.setQueryData(['nextFlashcards'], context.prevQueue)
			if (context?.prevCurrentFlashcard) setCurrentFlashcard(context.prevCurrentFlashcard)
			if (context?.prevUserAnswer) setUserAnswer(context.prevUserAnswer)
			setDoneToday(done => Math.max(0, done - 1))

			toast.error('Error: Failed to save flashcard review. Please try again.')
		},
		onSettled: async (_, __, variables) => {
			inFlight.current.delete(variables.flashcardId)
			// refresh the queue from the server
			await queryClient.invalidateQueries({queryKey: ['weekFlashcardCount']})
			await queryClient.invalidateQueries({queryKey: ['nextFlashcards']})
		},
	})

	function handleRateAnswer(quality: FlashcardResponseQuality) {
		if (!currentFlashcard) return
		// prevent double submission of the same flashcard - e.g. by pressing 1,2,3 at the same time
		// inFlight contains ids of flashcards that have been sent to the server but not yet confirmed
		// so if the id is in inFlight, we do not send it again and we are excluding it from the next flashcards fetch
		// id will be removed from inFlight in onSettled of the mutation
		if (inFlight.current.has(currentFlashcard.id)) return
		inFlight.current.add(currentFlashcard.id)
		mutate({flashcardId: currentFlashcard.id, q: quality})
	}

	function handleUserAnswerChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
		setUserAnswer(prevAnswer => {
			return {...prevAnswer, answer: event.target.value}
		})
	}

	function handleCheckAnswer() {
		const correctAnswer = currentFlashcard?.answer.text.trim()
		if (!correctAnswer) return

		if (userAnswer.answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
			setUserAnswer(prevAnswer => {
				const newAnswer = {...prevAnswer, isAnswered: true, isCorrect: true}
				return newAnswer
			})
		} else {
			setUserAnswer(prevAnswer => {
				const newAnswer = {...prevAnswer, isAnswered: true, isCorrect: false}
				return newAnswer
			})
		}
	}

	function handleGiveHint() {
		const correctAnswer = currentFlashcard?.answer.text.trim()
		if (!correctAnswer) return

		const n = Math.min(userAnswer.answer.length, correctAnswer.length)
		let i = 0
		for (i; i < n; i++) {
			if (userAnswer.answer.charAt(i) !== correctAnswer.charAt(i)) break
		}
		const newUserAnswer = correctAnswer.slice(0, i + 1)

		setUserAnswer(prevAnswer => ({
			...prevAnswer,
			answer: newUserAnswer,
			hintCount: prevAnswer.hintCount + 1,
		}))

		if (newUserAnswer === correctAnswer)
			setUserAnswer(prevAnswer => ({
				...prevAnswer,
				isAnswered: true,
				isCorrect: false,
			}))
	}

	// detect if device has fine pointer (mouse) or not (touch)
	// if it has fine pointer, focus the textfield automatically and assume it's desktop to set autoFocus on the textarea
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const hasFinePointer = window.matchMedia('(pointer: fine)').matches

			if (hasFinePointer) {
				textfieldRef.current?.focus()
			}

			setIsDesktop(hasFinePointer)
		}
	}, [])

	// if currentFlashcard is null, try to take from queue
	useEffect(() => {
		if (!currentFlashcard && queue && queue.length > 0) {
			setCurrentFlashcard(queue[0])
			// remove first position from cache because we occupy it
			queryClient.setQueryData(['nextFlashcards'], (oldData: Flashcard[] | undefined) =>
				oldData ? oldData.slice(1) : [],
			)
		}
	}, [queue, currentFlashcard, queryClient])

	return (
		<>
			<div className='flex h-dvh flex-col items-center overflow-y-auto page-padding-x page-padding-y'>
				<div
					className={cn('w-full max-w-full space-y-48 sm:w-512', {
						'mt-64': toReviewToday === 0,
					})}>
					{toReviewToday !== 0 && <ProgressBar value={doneToday} max={toReviewToday} />}
					{currentFlashcard && (
						<>
							<FlashcardComponent flashcard={currentFlashcard} />
							{!userAnswer.isAnswered ? (
								<Textarea
									ref={textfieldRef}
									value={userAnswer.answer}
									onChange={handleUserAnswerChange}
									autoFocus={isDesktop}
								/>
							) : (
								<AnswerDisplay
									answer={currentFlashcard.answer}
									examples={currentFlashcard.examples}
									synonyms={currentFlashcard.synonyms}
									userAnswer={userAnswer}
								/>
							)}
						</>
					)}
					{!currentFlashcard && isQueueError ? (
						<FlashcardsStatus status='error' />
					) : !currentFlashcard && queueEnabled ? (
						<>
							<FlashcardComponentSkeleton />
							<TextareaSkeleton />
						</>
					) : toReviewToday === 0 ? (
						<FlashcardsStatus status='empty'>
							No flashcards scheduled for today! You can add a new one now or come back another day to keep learning.
						</FlashcardsStatus>
					) : !queueEnabled ? (
						<>
							<FlashcardsStatus status='done' />
						</>
					) : null}
				</div>
			</div>
			{doneToday !== toReviewToday &&
				(currentFlashcard && !userAnswer.isAnswered ? (
					<Buttons mode='checkAnswer' handleCheckAnswer={handleCheckAnswer} handleGiveHint={handleGiveHint} />
				) : (
					<Buttons mode='rateAnswer' handleRateAnswer={handleRateAnswer} userAnswer={userAnswer} />
				))}
		</>
	)
}

export function Skeleton() {
	return (
		<div className='flex h-full flex-col items-center overflow-y-auto page-padding-x page-padding-y'>
			<div className='w-full max-w-full space-y-48 sm:w-512'>
				<ProgressBarSkeleton />
				<FlashcardComponentSkeleton />
				<TextareaSkeleton />
			</div>
		</div>
	)
}
