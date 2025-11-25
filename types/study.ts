import type {Prisma} from '@/lib/generated/prisma/browser'

export type Flashcard = Prisma.FlashcardGetPayload<{
	include: {answer: true}
}>

export type FlashcardResponseQuality = 0 | 3 | 5
// 0 = complete blackout
// 3 = correct response after hesitation
// 5 = perfect response
