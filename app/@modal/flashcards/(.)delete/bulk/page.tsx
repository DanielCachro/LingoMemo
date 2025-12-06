'use client'
import DeleteItemModal from '@/app/@modal/_components/ConfirmActionModal'
import {useModalData} from '@/app/ModalDataProvider'
import {bulkDeleteFlashcards} from '@/lib/actions/flashcards/manage'
import {useQueryClient} from '@tanstack/react-query'
import {toast} from 'react-toastify'

export default function FlashcardsBulkDeletePage() {
	const queryClient = useQueryClient()
	const {getData, setData} = useModalData()
	const flashcardsToDelete = getData<number[]>('flashcardsToBulkDelete') || []

	async function handleConfirmDelete() {
		try {
			await bulkDeleteFlashcards(flashcardsToDelete)
			setData('flashcardsToBulkDelete', [])
			queryClient.refetchQueries({queryKey: ['flashcards']})
		} catch (error) {
			toast.error('Failed to delete flashcards. Please try again.')
			console.error('Failed to delete flashcards:', error)
		}
	}

	return (
		<DeleteItemModal
			heading='You are about to delete'
			confirmButtonText='Yes, delete'
			confirmButtonTextPending='Deleting...'
			onConfirm={handleConfirmDelete}>
			<p className='text-background-700 dark:text-background-300'>
				<span className='font-bold text-primary-500 dark:text-primary-600'>{flashcardsToDelete.length}</span> selected
				flashcards
			</p>
		</DeleteItemModal>
	)
}
