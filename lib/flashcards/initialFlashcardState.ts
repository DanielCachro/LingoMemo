import {FlashcardActionState} from '@/types/flashcards'

const initialFlashcardState: FlashcardActionState = {
	status: 'idle',
	message: '',
	errors: {
		question: undefined,
		answer: undefined,
		note: undefined,
		phonetic: undefined,
		synonyms: undefined,
		examples: undefined,
	},
}

export default initialFlashcardState
