'use client'
import DeleteItemModal from '@/app/@modal/_components/DeleteItemModal'
import {deleteFlashcard} from '@/lib/actions/flashcards/manage'
import {useQueryClient} from '@tanstack/react-query'
import {use} from 'react'

export default function FlashcardsDeleteModal({
	params,
	searchParams,
}: {
	params: Promise<{id: number}>
	searchParams: Promise<{question?: string; answer?: string}>
}) {
	const queryClient = useQueryClient()
	const {id} = use(params)
	const {question, answer} = use(searchParams)

	const flashcardId = Number(id)

	async function handleDelete() {
		try {
			await deleteFlashcard(flashcardId)
			queryClient.refetchQueries({queryKey: ['flashcards']})
		} catch (error) {
			// TODO: Show toast notification
			console.error('Failed to delete flashcard:', error)
		}
	}

	return (
		<DeleteItemModal heading='You are about to delete flashcard' onConfirm={handleDelete}>
			<div className='space-y-12'>
				<p className='font-bold'>{answer}</p>
				<p>{question}</p>
			</div>
		</DeleteItemModal>
	)
}
