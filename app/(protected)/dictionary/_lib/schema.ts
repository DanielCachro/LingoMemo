import {z} from 'zod'

export const FlashcardSchema = z.object({
	answer: z.string().min(1),
	question: z.string().min(1),
	note: z.string().optional(),
	audio: z.array(z.url()).optional(),
	phonetic: z.string().optional(),
	examples: z.array(z.string()).optional(),
	synonyms: z.array(z.string()).optional(),
	license: z
		.object({
			name: z.string(),
			licenseUrl: z.url(),
			sourceUrl: z.url(),
		})
		.optional(),
})

export type Flashcard = z.infer<typeof FlashcardSchema>
