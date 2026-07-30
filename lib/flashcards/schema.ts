import {z} from 'zod'

export const flashcardFieldsLimits = {
	question: {min: 1, max: 200},
	answer: {min: 1, max: 300},
	note: {max: 500},
	phonetic: {max: 100},
	synonym: {max: 100},
	example: {max: 300},
}

function parseJsonArray(val: unknown, ctx: z.RefinementCtx, errorMessage: string): unknown {
	if (val === null || val === undefined || val === '') {
		return []
	}

	if (typeof val === 'string') {
		try {
			const parsed = JSON.parse(val)
			if (!Array.isArray(parsed)) {
				ctx.addIssue({
					code: 'custom',
					message: errorMessage,
				})
				return z.NEVER
			}
			return parsed
		} catch {
			ctx.addIssue({
				code: 'custom',
				message: errorMessage,
			})
			return z.NEVER
		}
	}

	return val
}

export const flashcardFormSchema = z.object({
	question: z.preprocess(
		val => (val === undefined ? '' : val),
		z
			.string({message: 'Question must be a string'})
			.min(flashcardFieldsLimits.question.min, {message: 'Question is required'})
			.max(flashcardFieldsLimits.question.max, {
				message: `Question must be no longer than ${flashcardFieldsLimits.question.max} characters`,
			}),
	),
	answer: z.preprocess(
		val => (val === undefined ? '' : val),
		z
			.string({message: 'Answer must be a string'})
			.min(flashcardFieldsLimits.answer.min, {message: 'Answer is required'})
			.max(flashcardFieldsLimits.answer.max, {
				message: `Answer must be no longer than ${flashcardFieldsLimits.answer.max} characters`,
			}),
	),
	note: z
		.string({message: 'Note must be a string'})
		.max(flashcardFieldsLimits.note.max, {
			message: `Note must be no longer than ${flashcardFieldsLimits.note.max} characters`,
		})
		.optional(),
	phonetic: z
		.string({message: 'Phonetic must be a string'})
		.max(flashcardFieldsLimits.phonetic.max, {
			message: `Phonetic must be no longer than ${flashcardFieldsLimits.phonetic.max} characters`,
		})
		.optional(),
	synonyms: z
		.preprocess(
			(val, ctx) => parseJsonArray(val, ctx, 'Synonyms must be a valid JSON array'),
			z.array(
				z.string({message: 'Synonym must be a string'}).max(flashcardFieldsLimits.synonym.max, {
					message: `Synonym must be no longer than ${flashcardFieldsLimits.synonym.max} characters`,
				}),
			),
		)
		.default([]),
	examples: z
		.preprocess(
			(val, ctx) => parseJsonArray(val, ctx, 'Examples must be a valid JSON array'),
			z.array(
				z.string({message: 'Example must be a string'}).max(flashcardFieldsLimits.example.max, {
					message: `Example must be no longer than ${flashcardFieldsLimits.example.max} characters`,
				}),
			),
		)
		.default([]),
})
