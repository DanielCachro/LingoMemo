import {Prisma} from '@/lib/generated/prisma/client'
import {prisma} from '@/prisma/client'

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

	// Ensure the database connection is closed after all tests are done
	afterAll(async () => {
		await prisma.$disconnect()
	})

	beforeEach(async () => {
		jest.clearAllMocks()

		// Clean up tables before each test for total isolation
		await truncateAllTables()

		const user = await prisma.user.create({
			data: {
				id: 'test-user-id',
				name: 'Test User',
				email: 'test@example.com',
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

	return context
}

async function truncateAllTables() {
	const tablenames = await prisma.$queryRaw<Array<{tablename: string}>>`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename != '_prisma_migrations'
    `

	const tables = tablenames.map(({tablename}) => `"${tablename}"`).join(', ')

	if (tables.length > 0) {
		await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
	}
}
