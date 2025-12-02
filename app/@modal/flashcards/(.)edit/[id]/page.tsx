import {getFlashcardById, updateFlashcard} from '@/lib/actions/flashcards/manage'
import {FlashcardFormValues} from '@/lib/actions/flashcards/types'
import {use} from 'react'
import CreateEditModal from '../../_components/CreateEditModal'
import FlashcardNotFound from './FlashcardNotFound'

export default function FlashcardsEditModal({params}: {params: Promise<{id: number}>}) {
	const {id} = use(params)
	const flashcardId = Number(id)

	const updateAction = updateFlashcard.bind(null, flashcardId)

	const flashcard = use(getFlashcardById(flashcardId))
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
