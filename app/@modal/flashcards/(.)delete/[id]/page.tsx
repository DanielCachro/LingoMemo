'use client'
import ConfirmActionModal from '@/app/@modal/_components/ConfirmActionModal'
import {deleteFlashcard} from '@/lib/actions/flashcards/manage'
import {useQueryClient} from '@tanstack/react-query'
import {use} from 'react'
import {toast} from 'react-toastify'

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
			const result = await deleteFlashcard(flashcardId)
			if (!result.success) {
				toast.error(result.error || 'Failed to delete flashcard. Please try again.')
				return
			}
			queryClient.refetchQueries({queryKey: ['flashcards']})
			toast.success('Flashcard deleted successfully.')
		} catch (error) {
			toast.error('Failed to delete flashcard. Please try again.')
			console.error('Failed to delete flashcard:', error)
		}
	}

	return (
		<ConfirmActionModal
			heading='You are about to delete flashcard'
			confirmButtonText='Yes, delete'
			confirmButtonTextPending='Deleting...'
			onConfirm={handleDelete}>
			<div className='space-y-12'>
				<p className='font-bold'>{answer}</p>
				<p>{question}</p>
			</div>
		</ConfirmActionModal>
	)
}
