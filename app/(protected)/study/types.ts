import type {Prisma} from '@prisma/client'

export type Flashcard = Prisma.FlashcardGetPayload<{
	include: {answer: true}
}>
