import {updateFlashcard} from '@/lib/actions/flashcards/manage'
import {getFlashcardById} from '@/lib/queries/flashcard'
import {FlashcardFormValues} from '@/types/flashcards'
import CreateEditModal from '../../_components/CreateEditModal'
import FlashcardNotFound from './FlashcardNotFound'

export default async function FlashcardsEditModal({params}: {params: Promise<{id: number}>}) {
	const {id} = await params
	const flashcardId = Number(id)

	const updateAction = updateFlashcard.bind(null, flashcardId)

	const flashcard = await getFlashcardById(flashcardId)
	if (!flashcard) {
		return <FlashcardNotFound />
	}

	const initialValues: FlashcardFormValues = {
		question: flashcard.question,
		answer: flashcard.answer.text,
		note: flashcard.note ?? undefined,
		phonetic: flashcard.answer.phonetic ?? undefined,
		synonyms: flashcard.synonyms,
		examples: flashcard.examples,
	}

	return (
		<CreateEditModal
			title='Edit Flashcard'
			subtitle='Make changes to your flashcard below.'
			buttonContent='Edit Flashcard'
			pendingButtonText='Saving...'
			successMessage='Flashcard updated successfully!'
			errorMessage='Failed to update flashcard. Please try again.'
			action={updateAction}
			initialValues={initialValues ?? undefined}
			disableAnimations={{disableEntryAnimation: true}}
		/>
	)
}
