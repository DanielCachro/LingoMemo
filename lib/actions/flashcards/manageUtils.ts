import {FlashcardActionState, FlashcardFormErrors, FlashcardFormValues} from '@/types/flashcards'
import {z} from 'zod'
import {flashcardFormSchema} from '../../flashcards/schema'

export function formatFlashcardErrors(error: z.ZodError): FlashcardFormErrors {
	const errors: FlashcardFormErrors = {}

	error.issues.forEach(issue => {
		const field = issue.path[0] as keyof FlashcardFormErrors
		const index = issue.path[1]

		if (field === 'synonyms' || field === 'examples') {
			if (!errors[field]) errors[field] = []
			errors[field].push({index: index as number, message: issue.message})
		} else {
			errors[field] = issue.message
		}
	})

	return errors
}

type ValidationResult = {success: true; data: FlashcardFormValues} | {success: false; errorState: FlashcardActionState}

export function parseAndValidateFlashcard(formData: FormData): ValidationResult {
	const data = {
		question: formData.get('question') || undefined,
		answer: formData.get('answer') || undefined,
		note: formData.get('note') || undefined,
		phonetic: formData.get('phonetic') || undefined,
		synonyms: formData.get('synonyms') ?? undefined,
		examples: formData.get('examples') ?? undefined,
	}

	const parsed = flashcardFormSchema.safeParse(data)

	if (!parsed.success) {
		const errors = formatFlashcardErrors(parsed.error)
		return {
			success: false,
			errorState: {
				status: 'error',
				message: 'Validation failed. Please correct the errors and try again.',
				errors: {
					question: errors.question,
					answer: errors.answer,
					note: errors.note,
					phonetic: errors.phonetic,
					synonyms: errors.synonyms,
					examples: errors.examples,
				},
			} as FlashcardActionState,
		}
	}

	return {success: true, data: parsed.data}
}
