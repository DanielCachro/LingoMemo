'use client'
import type {Flashcard, FlashcardResponseQuality} from '@/types/study'
import {QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import React, {useEffect, useState} from 'react'
import Buttons from './Buttons'
import FlashcardComponent from './Flashcard'
import FlashcardsStatus from './FlashcardsStatus'
import Input from './Input'
import ProgressBar from './ProgressBar'

const queryClient = new QueryClient()

interface Props {
	initialFlashcard: Flashcard | null
	initialDone: number
	toReviewToday: number
}

export default function StudyClient({initialFlashcard, initialDone, toReviewToday}: Props) {
	return (
		<QueryClientProvider client={queryClient}>
			<InnerStudy initialFlashcard={initialFlashcard} initialDone={initialDone} toReviewToday={toReviewToday} />
		</QueryClientProvider>
	)
}

function InnerStudy({initialFlashcard, initialDone, toReviewToday}: Props) {
	const queryClient = useQueryClient()
	const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard | null>(initialFlashcard)
	const [doneToday, setDoneToday] = useState(initialDone ?? 0)

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
			const res = await fetch('/api/study/update', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({flashcardId, q}),
			})
			if (!res.ok) {
				const text = await res.text()
				throw new Error(text || 'update failed')
			}
			return res.json()
		},
		onMutate: async () => {
			await queryClient.cancelQueries({queryKey: ['nextFlashcards']})
			const previousQueue = queryClient.getQueryData<Flashcard[]>(['nextFlashcards']) ?? []
			const prevCurrentFlashcard = currentFlashcard

			// remove first occurrence from queue if present
			const newQueue = previousQueue.slice()
			if (newQueue.length > 0) newQueue.shift()

			// optimistic: increment doneToday and set currentFlashcard to next or null
			setDoneToday(done => done + 1)
			setCurrentFlashcard(newQueue.length ? newQueue[0] : null)

			// update cache immediately
			queryClient.setQueryData(['nextFlashcards'], newQueue)

			return {previousQueue, prevCurrentFlashcard}
		},
		onError: (error, data, context) => {
			console.error('Mutation failed', error)

			// rollback optimistic cache
			if (context?.previousQueue) queryClient.setQueryData(['nextFlashcards'], context.previousQueue)
			if (context?.prevCurrentFlashcard) setCurrentFlashcard(context.prevCurrentFlashcard)
			setDoneToday(done => Math.max(0, done - 1))

			// TODO: show toast
			alert('Error: Failed to save flashcard review. Please try again.')
		},
		onSettled: async () => {
			// refresh the queue from the server
			await queryClient.invalidateQueries({queryKey: ['nextFlashcards']})
		},
	})

	function handleAnswer(quality: FlashcardResponseQuality) {
		if (!currentFlashcard) return
		mutate({flashcardId: currentFlashcard.id, q: quality})
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
				<div className='max-w-full space-y-48 sm:w-512'>
					<ProgressBar value={doneToday} max={toReviewToday} />
					{currentFlashcard && (
						<>
							<FlashcardComponent flashcard={currentFlashcard} />
							<Input />
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
			{currentFlashcard && <Buttons handleAnswerFn={handleAnswer} />}
		</>
	)
}
