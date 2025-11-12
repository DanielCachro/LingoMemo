import z from 'zod'

export const schema = z.object({
	hasNote: z.boolean().optional(),
	createdAtFrom: z.iso.date().optional(),
	createdAtTo: z.iso.date().optional(),
	nextReviewDateFrom: z.iso.date().optional(),
	nextReviewDateTo: z.iso.date().optional(),
	efactorFrom: z.number().min(1.3).max(2.5).optional(),
	efactorTo: z.number().min(1.3).max(2.5).optional(),
})

export type FlashcardsFilter = z.infer<typeof schema>
