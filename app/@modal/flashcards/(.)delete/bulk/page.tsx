'use client'
import DeleteItemModal from '@/app/@modal/_components/DeleteItemModal'
import {useModalData} from '@/app/ModalDataProvider'
import {bulkDeleteFlashcards} from '@/lib/actions/flashcards/manage'
import {useQueryClient} from '@tanstack/react-query'

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
			// TODO: Show toast notification
			console.error('Failed to delete flashcard:', error)
		}
	}

	return (
		<DeleteItemModal heading='You are about to delete' onConfirm={handleConfirmDelete}>
			<p className='text-background-700 dark:text-background-300'>
				<span className='font-bold text-primary-500 dark:text-primary-600'>{flashcardsToDelete.length}</span> selected
				flashcards
			</p>
		</DeleteItemModal>
	)
}
