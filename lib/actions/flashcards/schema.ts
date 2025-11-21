import {z} from 'zod'

export const flashcardFormSchema = z.object({
	question: z
		.string({message: 'Question must be a string'})
		.min(1, {message: 'Question is required'})
		.max(200, {message: 'Question must be no longer than 200 characters'}),
	answer: z
		.string({message: 'Answer must be a string'})
		.min(1, {message: 'Answer is required'})
		.max(300, {message: 'Answer must be no longer than 300 characters'}),
	note: z
		.string({message: 'Note must be a string'})
		.max(500, {message: 'Note must be no longer than 500 characters'})
		.optional(),
	phonetic: z
		.string({message: 'Phonetic must be a string'})
		.max(100, {message: 'Phonetic must be no longer than 100 characters'})
		.optional(),
	synonyms: z
		.array(
			z
				.string({message: 'Synonym must be a string'})
				.max(100, {message: 'Synonym must be no longer than 100 characters'}),
		)
		.optional(),
	examples: z
		.array(
			z
				.string({message: 'Example must be a string'})
				.max(300, {message: 'Example must be no longer than 300 characters'}),
		)
		.optional(),
})
