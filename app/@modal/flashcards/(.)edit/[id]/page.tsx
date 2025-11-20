import {updateFlashcard} from '@/lib/actions/flashcards/manage'
import {FlashcardFormValues} from '@/lib/actions/flashcards/types'
import {getCurrentUser} from '@/lib/actions/user'
import {prisma} from '@/prisma/client'
import CreateEditModal from '../../_components/CreateEditModal'

export default async function FlashcardsEditModal({params}: {params: Promise<{id: number}>}) {
	const {id} = await params
	const flashcardId = Number(id)

	const user = await getCurrentUser()
	if (!user || !user.activeLearningProfileId) {
		// TODO: instead show error toast notification
		throw new Error('User not found or no active learning profile.')
	}
	const updateAction = updateFlashcard.bind(null, flashcardId)

	const initialValues = await prisma.flashcard
		.findUnique({
			where: {id: flashcardId, learningProfileId: user.activeLearningProfileId},
			select: {
				answer: {select: {text: true, phonetic: true}},
				question: true,
				note: true,
				synonyms: true,
				examples: true,
			},
		})
		.then(flashcard => {
			if (!flashcard) {
				throw new Error('Flashcard not found, please try again.')
			}
			return {
				question: flashcard.question,
				answer: flashcard.answer.text,
				note: flashcard.note,
				phonetic: flashcard.answer.phonetic,
				synonyms: flashcard.synonyms,
				examples: flashcard.examples,
			} as FlashcardFormValues
		})

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
