import {createFlashcard} from '@/lib/actions/flashcards/manage'
import CreateEditModal from '../_components/CreateEditModal'

export default function FlashcardsCreateModal() {
	return (
		<CreateEditModal
			title='Create Flashcard'
			subtitle='Fill in the details to create a flashcard.'
			buttonContent='Create Flashcard'
			pendingButtonText='Creating...'
			successMessage='Flashcard created successfully!'
			errorMessage='Failed to create flashcard. '
			action={createFlashcard}
		/>
	)
}
