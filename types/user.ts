import type {Prisma} from '@/lib/generated/prisma/browser'

export type User = Prisma.UserGetPayload<{
	include: {preferences: true; learningProfiles: true; activeLearningProfile: true}
}>
