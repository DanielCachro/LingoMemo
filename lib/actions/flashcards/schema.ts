import {z} from 'zod'

export const flashcardFormSchema = z.object({
	question: z
		.string()
		.min(1, {message: 'Question is required'})
		.max(200, {message: 'Question must be no longer than 200 characters'}),
	answer: z
		.string()
		.min(1, {message: 'Answer is required'})
		.max(300, {message: 'Answer must be no longer than 300 characters'}),
	note: z.string().max(500, {message: 'Note must be no longer than 500 characters'}).optional(),
	phonetic: z.string().max(100, {message: 'Phonetic must be no longer than 100 characters'}).optional(),
	synonyms: z.array(z.string().max(100, {message: 'Synonym must be no longer than 100 characters'})).optional(),
	examples: z.array(z.string().max(300, {message: 'Example must be no longer than 300 characters'})).optional(),
})
