import {createFlashcard} from '@/lib/actions/flashcards/manage'
import CreateEditModal from '../_components/CreateEditModal'

export default function FlashcardsCreateModal() {
	return (
		<CreateEditModal
			title='Edit Flashcard'
			subtitle='Make changes to your flashcard below.'
			buttonContent='Edit Flashcard'
			pendingButtonText='Creating...'
			action={createFlashcard}
		/>
	)
}
