import {z} from 'zod'

export const lengths = {
	question: {min: 1, max: 200},
	answer: {min: 1, max: 300},
	note: {max: 500},
	phonetic: {max: 100},
	synonym: {max: 100},
	example: {max: 300},
}

export const flashcardFormSchema = z.object({
	question: z
		.string({message: 'Question must be a string'})
		.min(lengths.question.min, {message: 'Question is required'})
		.max(lengths.question.max, {message: 'Question must be no longer than 200 characters'}),
	answer: z
		.string({message: 'Answer must be a string'})
		.min(lengths.answer.min, {message: 'Answer is required'})
		.max(lengths.answer.max, {message: 'Answer must be no longer than 300 characters'}),
	note: z
		.string({message: 'Note must be a string'})
		.max(lengths.note.max, {message: 'Note must be no longer than 500 characters'})
		.optional(),
	phonetic: z
		.string({message: 'Phonetic must be a string'})
		.max(lengths.phonetic.max, {message: 'Phonetic must be no longer than 100 characters'})
		.optional(),
	synonyms: z
		.array(
			z
				.string({message: 'Synonym must be a string'})
				.max(lengths.synonym.max, {message: 'Synonym must be no longer than 100 characters'}),
		)
		.optional(),
	examples: z
		.array(
			z
				.string({message: 'Example must be a string'})
				.max(lengths.example.max, {message: 'Example must be no longer than 300 characters'}),
		)
		.optional(),
})
