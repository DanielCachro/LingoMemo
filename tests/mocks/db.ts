import {Prisma} from '@/lib/generated/prisma/client'
import {prisma} from '@/prisma/client'
import {randomUUID} from 'crypto' 

export type TestDatabaseContext = {
	user: Prisma.UserGetPayload<{
		select: {
			id: true
			name: true
			email: true
			timeZone: true
			utcOffsetMinutes: true
			activeLearningProfileId: true
		}
	}>
	profile: Prisma.LearningProfileGetPayload<{
		select: {
			id: true
			profileName: true
			sourceLang: true
			targetLang: true
			streakCount: true
			longestStreak: true
			userId: true
		}
	}>
}

export function setupTestDatabase(): TestDatabaseContext {
	const context = {} as TestDatabaseContext

	// ensure the database connection is closed after all tests are done
	afterAll(async () => {
		await prisma.$disconnect()
	})

	beforeEach(async () => {
		jest.clearAllMocks()

		const userId = randomUUID()
		const uniqueEmail = `test-${userId}@example.com`

		const user = await prisma.user.create({
			data: {
				id: userId,
				name: 'Test User',
				email: uniqueEmail,
				timeZone: 'Europe/Warsaw',
				utcOffsetMinutes: 120,
			},
		})

		const profile = await prisma.learningProfile.create({
			data: {
				userId: user.id,
				profileName: 'Test Profile',
			},
		})

		const updatedUser = await prisma.user.update({
			where: {id: user.id},
			data: {activeLearningProfileId: profile.id},
		})

		context.user = updatedUser
		context.profile = profile
	})

	afterEach(async () => {
		if (context.user?.id) {
			try {
				// break the circular dependency before deletion
				await prisma.user.update({
					where: {id: context.user.id},
					data: {activeLearningProfileId: null},
				})

				await prisma.user.delete({
					where: {id: context.user.id},
				})
			} catch (error) {
				// safely ignore errors during cleanup (e.g. if the test already deleted the user)
				console.error('Cleanup error:', error)
			}
		}
	})
	return context
}
