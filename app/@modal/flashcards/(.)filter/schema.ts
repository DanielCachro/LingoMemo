import {z} from 'zod'

export const schema = z.object({
	hasNote: z.boolean({message: 'Has Note must be a boolean'}).optional(),
	createdAtFrom: z.iso.date({message: 'Created at from must be a valid ISO date'}).optional(),
	createdAtTo: z.iso.date({message: 'Created at to must be a valid ISO date'}).optional(),
	nextReviewDateFrom: z.iso.date({message: 'Next review date from must be a valid ISO date'}).optional(),
	nextReviewDateTo: z.iso.date({message: 'Next review date to must be a valid ISO date'}).optional(),
	efactorFrom: z
		.number({message: 'eFactor from must be a number'})
		.min(1.3, {message: 'eFactor from must be at least 1.3'})
		.max(2.5, {message: 'eFactor from must be at most 2.5'})
		.optional(),
	efactorTo: z
		.number({message: 'eFactor to must be a number'})
		.min(1.3, {message: 'eFactor to must be at least 1.3'})
		.max(2.5, {message: 'eFactor to must be at most 2.5'})
		.optional(),
})

export type FlashcardsFilter = z.infer<typeof schema>
