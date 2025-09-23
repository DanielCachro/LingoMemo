'use client'
import {useStreak} from '@/hooks/useStreak'
import type {Flashcard, FlashcardResponseQuality} from '@/types/study'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useEffect, useState} from 'react'
import AnswerDisplay from './AnswerDisplay'
import Buttons from './Buttons'
import FlashcardComponent from './Flashcard'
import FlashcardsStatus from './FlashcardsStatus'
import Input from './Input'
import ProgressBar from './ProgressBar'

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
	const queryClient = useQueryClient()
	const {invalidate: invalidateStreak} = useStreak()
	const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard | null>(initialFlashcard)
	const [doneToday, setDoneToday] = useState(initialDone ?? 0)

	const [userAnswer, setUserAnswer] = useState<UserAnswer>({
		answer: '',
		isAnswered: false,
		isCorrect: false,
		hintCount: 0,
	})

	// fetch queue of next flashcards
	const {
		data: queue = [],
		isEnabled: queueEnabled,
		isError: isQueueError,
	} = useQuery({
		queryKey: ['nextFlashcards'],
		queryFn: async () => {
			let desiredQueueSize = 10
			const toReview = toReviewToday - doneToday
			if (toReview < desiredQueueSize) desiredQueueSize = toReview

			const existing: Flashcard[] = queryClient.getQueryData(['nextFlashcards']) ?? []
			const missing = Math.max(0, desiredQueueSize - existing.length)
			if (missing === 0) return existing

			const exclude = existing.map(flashcard => flashcard.id).join(',')
			const res = await fetch(`/api/study/prefetch?limit=${missing}${exclude ? `&excludeIds=${exclude}` : ''}`)
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

			let streakRes = null
			if (doneToday === toReviewToday) {
				streakRes = await fetch('/api/profile/streak/update', {method: 'POST'})
				if (!streakRes.ok) {
					// TODO: show toast
					alert('Error: Failed to update streak. Please try again.')
				}
				invalidateStreak()
			}

			return {
				flashcard: await flashcardRes.json(),
				streak: streakRes ? await streakRes.json() : null,
			}
		},
		onMutate: async () => {
			await queryClient.cancelQueries({queryKey: ['nextFlashcards']})
			const prevQueue = queryClient.getQueryData<Flashcard[]>(['nextFlashcards']) ?? []
			const prevCurrentFlashcard = currentFlashcard
			const prevUserAnswer = userAnswer

			// remove first occurrence from queue if present
			const newQueue = prevQueue.slice()
			if (newQueue.length > 0) newQueue.shift()

			// optimistic: increment doneToday and set currentFlashcard to next or null
			setDoneToday(done => done + 1)
			setCurrentFlashcard(newQueue.length ? newQueue[0] : null)
			setUserAnswer({answer: '', isAnswered: false, isCorrect: false, hintCount: 0})

			// update cache immediately
			queryClient.setQueryData(['nextFlashcards'], newQueue)

			return {prevQueue, prevCurrentFlashcard, prevUserAnswer}
		},
		onError: (error, data, context) => {
			console.error('Mutation failed', error)

			// rollback optimistic cache
			if (context?.prevQueue) queryClient.setQueryData(['nextFlashcards'], context.prevQueue)
			if (context?.prevCurrentFlashcard) setCurrentFlashcard(context.prevCurrentFlashcard)
			if (context?.prevUserAnswer) setUserAnswer(context.prevUserAnswer)
			setDoneToday(done => Math.max(0, done - 1))

			// TODO: show toast
			alert('Error: Failed to save flashcard review. Please try again.')
		},
		onSettled: async () => {
			// refresh the queue from the server
			await queryClient.invalidateQueries({queryKey: ['nextFlashcards']})
		},
	})

	function handleRateAnswer(quality: FlashcardResponseQuality) {
		if (!currentFlashcard) return
		mutate({flashcardId: currentFlashcard.id, q: quality})
	}

	function handleUserAnswerChange(event: React.ChangeEvent<HTMLInputElement>) {
		setUserAnswer(prevAnswer => {
			return {...prevAnswer, answer: event.target.value}
		})
	}

	function handleCheckAnswer() {
		const correctAnswer = currentFlashcard?.answer.text.trim()
		if (!correctAnswer) return

		if (userAnswer.answer === correctAnswer) {
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
			<div className='flex h-full flex-col items-center overflow-y-auto page-padding-x page-padding-y'>
				<div className='w-full max-w-full space-y-48 sm:w-512'>
					<ProgressBar value={doneToday} max={toReviewToday} />
					{currentFlashcard && (
						<>
							<FlashcardComponent flashcard={currentFlashcard} />
							{!userAnswer.isAnswered ? (
								<Input value={userAnswer.answer} onChange={handleUserAnswerChange} />
							) : (
								<AnswerDisplay
									answer={currentFlashcard.answer}
									examples={currentFlashcard.examples}
									userAnswer={userAnswer}
								/>
							)}
						</>
					)}
					{!currentFlashcard && isQueueError ? (
						<FlashcardsStatus status='error' />
					) : !currentFlashcard && queueEnabled ? (
						<p className='animate-pulse'>Loading more flashcards...</p>
					) : !queueEnabled ? (
						<FlashcardsStatus status='done' />
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
