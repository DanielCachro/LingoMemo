import {flashcardFormSchema} from '@/lib/utils/flashcards/schema'
import {z} from 'zod'

export type FlashcardFormValues = z.infer<typeof flashcardFormSchema>

export type FlashcardFormErrors = {
	[K in keyof FlashcardFormValues]?: NonNullable<FlashcardFormValues[K]> extends Array<unknown>
		? {index: number; message?: string}[]
		: string
}

export type FlashcardActionState = {
	status: 'idle' | 'success' | 'error'
	message?: string
	errors: FlashcardFormErrors
}
