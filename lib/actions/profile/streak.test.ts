/**
 * @jest-environment node
 */

import calculateStreakStatus from '@/lib/utils/profile/calculateStreakStatus'
import {prisma} from '@/prisma/client'
import {setupTestDatabase} from '@/tests/mocks/db'
import {DateTime} from 'luxon'
import {updateStreak} from './streak'

// Mock the status calculator to control the specific test scenarios
jest.mock('@/lib/utils/profile/calculateStreakStatus', () => jest.fn())

describe('Streak Server Actions', () => {
	beforeAll(() => {
		jest.spyOn(console, 'log').mockImplementation(() => {})
		jest.spyOn(console, 'error').mockImplementation(() => {})
	})

	afterAll(() => {
		jest.restoreAllMocks()
	})

	const context = setupTestDatabase()

	beforeEach(async () => {
		jest.clearAllMocks()

		// Explicitly reset the database state for the profile before each test
		// This ensures we always start with known values (0 streak, 0 longest streak)
		await prisma.learningProfile.update({
			where: {id: context.profile.id},
			data: {streakCount: 0, longestStreak: 0},
		})
	})

	describe('updateStreak', () => {
		it('should return `updated: false` if calculateStreakStatus returns null', async () => {
			;(calculateStreakStatus as jest.Mock).mockResolvedValue(null)

			const result = await updateStreak()

			expect(result).toEqual({updated: false})

			// verify the database wasn't modified
			const profileInDb = await prisma.learningProfile.findUnique({
				where: {id: context.profile.id},
			})
			expect(profileInDb?.streakCount).toBe(0) // default from creation
		})

		it('should return `updated: false` if both shouldReset and shouldIncrement are false', async () => {
			;(calculateStreakStatus as jest.Mock).mockResolvedValue({
				activeLearningProfileId: context.profile.id,
				dbLongestStreak: 15,
				newStreakCount: 5,
				shouldReset: false,
				shouldIncrement: false,
			})

			const result = await updateStreak()

			expect(result).toEqual({updated: false})

			// verify no logs were created
			const logsCount = await prisma.studyCompletionLog.count({
				where: {learningProfileId: context.profile.id},
			})
			expect(logsCount).toBe(0)
		})

		it('should ONLY reset the streak in the database when shouldReset is true and shouldIncrement is false', async () => {
			// pre-seed the profile with some streak
			await prisma.learningProfile.update({
				where: {id: context.profile.id},
				data: {streakCount: 5, longestStreak: 15},
			})
			;(calculateStreakStatus as jest.Mock).mockResolvedValue({
				activeLearningProfileId: context.profile.id,
				dbLongestStreak: 15,
				newStreakCount: 0,
				shouldReset: true,
				shouldIncrement: false,
			})

			const result = await updateStreak()

			expect(result.updated).toBe(true)
			expect(result.newStreak).toBe(0)

			// verify DB update
			const profileInDb = await prisma.learningProfile.findUnique({
				where: {id: context.profile.id},
			})
			expect(profileInDb?.streakCount).toBe(0)
			expect(profileInDb?.longestStreak).toBe(15)

			// verify no log was created
			const logsCount = await prisma.studyCompletionLog.count({
				where: {learningProfileId: context.profile.id},
			})
			expect(logsCount).toBe(0)
		})

		it('should ONLY increment the streak in the database when shouldIncrement is true and shouldReset is false', async () => {
			// pre-seed the profile with some streak
			await prisma.learningProfile.update({
				where: {id: context.profile.id},
				data: {streakCount: 15, longestStreak: 15},
			})
			;(calculateStreakStatus as jest.Mock).mockResolvedValue({
				activeLearningProfileId: context.profile.id,
				dbLongestStreak: 15,
				newStreakCount: 16,
				shouldReset: false,
				shouldIncrement: true,
			})

			const result = await updateStreak()

			expect(result.updated).toBe(true)
			expect(result.newStreak).toBe(16)

			// verify DB update
			const profileInDb = await prisma.learningProfile.findUnique({
				where: {id: context.profile.id},
			})
			expect(profileInDb?.streakCount).toBe(16)
			expect(profileInDb?.longestStreak).toBe(16) // should be updated since new max

			// verify log was created correctly
			const logs = await prisma.studyCompletionLog.findMany({
				where: {learningProfileId: context.profile.id},
			})
			expect(logs).toHaveLength(1)
			expect(logs[0].completedAt.getTime()).toBe(DateTime.now().toUTC().startOf('day').toMillis())
		})

		it('should reset AND increment when both flags are true', async () => {
			await prisma.learningProfile.update({
				where: {id: context.profile.id},
				data: {streakCount: 5, longestStreak: 15},
			})
			;(calculateStreakStatus as jest.Mock).mockResolvedValue({
				activeLearningProfileId: context.profile.id,
				dbLongestStreak: 15,
				newStreakCount: 1,
				shouldReset: true,
				shouldIncrement: true,
			})

			const result = await updateStreak()

			expect(result.updated).toBe(true)
			expect(result.newStreak).toBe(1)

			// verify DB update
			const profileInDb = await prisma.learningProfile.findUnique({
				where: {id: context.profile.id},
			})
			expect(profileInDb?.streakCount).toBe(1)
			expect(profileInDb?.longestStreak).toBe(15) // keeps the old max

			// verify log was created
			const logs = await prisma.studyCompletionLog.findMany({
				where: {learningProfileId: context.profile.id},
			})
			expect(logs).toHaveLength(1)
			expect(logs[0].completedAt.getTime()).toBe(DateTime.now().toUTC().startOf('day').toMillis())
		})

		it('should catch database errors, log them, and throw a generic error', async () => {
			;(calculateStreakStatus as jest.Mock).mockResolvedValue({
				activeLearningProfileId: context.profile.id,
				dbLongestStreak: 15,
				newStreakCount: 6,
				shouldReset: false,
				shouldIncrement: true,
			})

			// simulate a Prisma error dynamically
			jest.spyOn(prisma, '$transaction').mockRejectedValueOnce(new Error('Simulated DB error'))

			await expect(updateStreak()).rejects.toThrow('Simulated DB error')

			expect(console.error).toHaveBeenCalledWith(
				'Error updating streak:',
				expect.objectContaining({message: 'Simulated DB error'}),
			)
		})

		it('should fallback to "Unknown error" when the caught error has no message', async () => {
			;(calculateStreakStatus as jest.Mock).mockResolvedValue({
				activeLearningProfileId: context.profile.id,
				dbLongestStreak: 15,
				newStreakCount: 6,
				shouldReset: false,
				shouldIncrement: true,
			})

			// simulate a Prisma error without a message
			jest.spyOn(prisma, '$transaction').mockRejectedValueOnce({})

			await expect(updateStreak()).rejects.toThrow('Unknown error')

			expect(console.error).toHaveBeenCalledWith('Error updating streak:', {})
		})
	})
})
