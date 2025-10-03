import type {Prisma} from '@prisma/client'

export type User = Prisma.UserGetPayload<{
	include: {preferences: true; learningProfiles: true; activeLearningProfile: true}
}>
