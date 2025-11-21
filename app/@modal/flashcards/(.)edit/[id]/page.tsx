import {getFlashcardById, updateFlashcard} from '@/lib/actions/flashcards/manage'
import {FlashcardFormValues} from '@/lib/actions/flashcards/types'
import CreateEditModal from '../../_components/CreateEditModal'

export default async function FlashcardsEditModal({params}: {params: Promise<{id: number}>}) {
	const {id} = await params
	const flashcardId = Number(id)
	
	const updateAction = updateFlashcard.bind(null, flashcardId)
	
	const flashcard = await getFlashcardById(flashcardId)
	if (!flashcard) {
		// TODO: instead show error toast notification
		throw new Error('Flashcard not found, please try again.')
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
			action={updateAction}
			initialValues={initialValues ?? undefined}
			disableAnimations={{disableEntryAnimation: true}}
		/>
	)
}
