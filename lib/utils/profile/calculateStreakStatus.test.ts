/**
 * @jest-environment node
 */

import {getCurrentUser} from '@/lib/queries/user'
import {getUserDayRangeUTC, getUserTimeZoneString} from '@/lib/utils/time'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'
import calculateStreakStatus from './calculateStreakStatus'

// Mock external dependencies
jest.mock('@/lib/queries/user', () => ({
	getCurrentUser: jest.fn(),
}))

jest.mock('@/lib/utils/time', () => ({
	getUserDayRangeUTC: jest.fn(),
	getUserTimeZoneString: jest.fn(),
}))

describe('calculateStreakStatus', () => {
	const mockStartOfTodayUTC = DateTime.fromISO('2026-01-15T00:00:00.000Z')
	const mockEndOfTodayUTC = DateTime.fromISO('2026-01-15T23:59:59.999Z')

	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {})
	})

	afterAll(() => {
		jest.restoreAllMocks()
	})

	beforeEach(() => {
		jest.clearAllMocks()

		// Mock time utility functions
		;(getUserDayRangeUTC as jest.Mock).mockReturnValue({
			startOfTodayUTC: mockStartOfTodayUTC,
			endOfTodayUTC: mockEndOfTodayUTC,
		})
		;(getUserTimeZoneString as jest.Mock).mockReturnValue('UTC')

		// Default mock for a valid user
		;(getCurrentUser as jest.Mock).mockResolvedValue({
			id: 1,
			timeZone: 'UTC',
			utcOffsetMinutes: 0,
			activeLearningProfileId: 10,
			activeLearningProfile: {
				id: 10,
				streakCount: 5,
				longestStreak: 12,
			},
		})

		// Setup default prisma spies to return "no activity" and "no flashcards"
		jest.spyOn(prisma.studyCompletionLog, 'findFirst').mockResolvedValue(null)
		jest.spyOn(prisma.flashcard, 'count').mockResolvedValue(0)
	})

	it('should return null if the user is not authenticated', async () => {
		;(getCurrentUser as jest.Mock).mockResolvedValue(null)

		const result = await calculateStreakStatus()
		expect(result).toBeNull()
	})

	it('should return null if the user has no active learning profile', async () => {
		;(getCurrentUser as jest.Mock).mockResolvedValue({
			id: 1,
			activeLearningProfileId: null,
			activeLearningProfile: null,
		})

		const result = await calculateStreakStatus()
		expect(result).toBeNull()
	})

	it('should return initial streak data (no reset, no increment) for a brand new profile without logs', async () => {
		// No studyCompletionLog returned by default in beforeEach
		const result = await calculateStreakStatus()

		expect(result).toEqual({
			activeLearningProfileId: 10,
			dbStreakCount: 5,
			dbLongestStreak: 12,
			newStreakCount: 5,
			shouldReset: false,
			shouldIncrement: false,
		})
	})

	it('should maintain streak (no reset, no increment) if study was completed today, regardless of planned reviews', async () => {
		// @ts-expect-error - mocking partial Prisma response, we only need completedAt
		jest.spyOn(prisma.studyCompletionLog, 'findFirst').mockResolvedValue({
			completedAt: DateTime.fromISO('2026-01-15T14:00:00.000Z').toJSDate(), // Today (15 january)
		})

		jest.spyOn(prisma.flashcard, 'count').mockResolvedValue(5) // Flashcards still to review today

		const result = await calculateStreakStatus()

		expect(result).toEqual({
			activeLearningProfileId: 10,
			dbStreakCount: 5,
			dbLongestStreak: 12,
			newStreakCount: 5,
			shouldReset: false,
			shouldIncrement: false,
		})
	})

	it('should maintain streak (no reset, no increment) if study was completed yesterday BUT there are reviews planned for today', async () => {
		// @ts-expect-error - mocking partial Prisma response, we only need completedAt
		jest.spyOn(prisma.studyCompletionLog, 'findFirst').mockResolvedValue({
			completedAt: DateTime.fromISO('2026-01-14T10:00:00.000Z').toJSDate(), // Yesterday (14 january)
		})

		jest.spyOn(prisma.flashcard, 'count').mockResolvedValue(3) // Needs to study today to increment

		const result = await calculateStreakStatus()

		expect(result).toEqual({
			activeLearningProfileId: 10,
			dbStreakCount: 5,
			dbLongestStreak: 12,
			newStreakCount: 5,
			shouldReset: false,
			shouldIncrement: false, // Will increment only when user finishes today's flashcards
		})
	})

	it('should increment streak if study was completed yesterday AND there are no flashcards to review today', async () => {
		// @ts-expect-error - mocking partial Prisma response, we only need completedAt
		jest.spyOn(prisma.studyCompletionLog, 'findFirst').mockResolvedValue({
			completedAt: DateTime.fromISO('2026-01-14T10:00:00.000Z').toJSDate(), // Yesterday (14 january)
		})

		jest.spyOn(prisma.flashcard, 'count').mockResolvedValue(0) // No flashcards today

		const result = await calculateStreakStatus()

		expect(result).toEqual({
			activeLearningProfileId: 10,
			dbStreakCount: 5,
			dbLongestStreak: 12,
			newStreakCount: 6, // 5 + 1
			shouldReset: false,
			shouldIncrement: true, // Will increment because no flashcards left today and last study was yesterday
		})
	})

	it('should reset streak if study was completed 2 or more days ago', async () => {
		// @ts-expect-error - mocking partial Prisma response, we only need completedAt
		jest.spyOn(prisma.studyCompletionLog, 'findFirst').mockResolvedValue({
			completedAt: DateTime.fromISO('2026-01-13T10:00:00.000Z').toJSDate(), // 2 days ago (13 january)
		})

		jest.spyOn(prisma.flashcard, 'count').mockResolvedValue(10) // Has flashcards

		const result = await calculateStreakStatus()

		expect(result).toEqual({
			activeLearningProfileId: 10,
			dbStreakCount: 5,
			dbLongestStreak: 12,
			newStreakCount: 0, // Reset to 0
			shouldReset: true, // Streak is broken because last study was 2 days ago
			shouldIncrement: false,
		})
	})

	it('should reset AND increment streak if study was completed >= 2 days ago, but there are NO flashcards for do today', async () => {
		// edge-case: You missed 2 days (reset to 0), but today you have 0 reviews planned (increment by 1).
		// @ts-expect-error - mocking partial Prisma response, we only need completedAt
		jest.spyOn(prisma.studyCompletionLog, 'findFirst').mockResolvedValue({
			completedAt: DateTime.fromISO('2026-01-12T10:00:00.000Z').toJSDate(), // 3 days ago (12 january)
		})

		jest.spyOn(prisma.flashcard, 'count').mockResolvedValue(0) // 0 reviews

		const result = await calculateStreakStatus()

		expect(result).toEqual({
			activeLearningProfileId: 10,
			dbStreakCount: 5,
			dbLongestStreak: 12,
			newStreakCount: 1, // 0 (reset) + 1 (increment due to free day)
			shouldReset: true, // Streak is broken because last study was 3 days ago
			shouldIncrement: true, // Increment because no flashcards left today
		})
	})

	it('should NOT flag shouldReset if the streak is already 0 (even if missed >= 2 days)', async () => {
		;(getCurrentUser as jest.Mock).mockResolvedValue({
			id: 1,
			timeZone: 'UTC',
			utcOffsetMinutes: 0,
			activeLearningProfileId: 10,
			activeLearningProfile: {
				id: 10,
				streakCount: 0, // Already at 0
				longestStreak: 12,
			},
		})

		// @ts-expect-error - mocking partial Prisma response, we only need completedAt
		jest.spyOn(prisma.studyCompletionLog, 'findFirst').mockResolvedValue({
			completedAt: DateTime.fromISO('2026-01-01T10:00:00.000Z').toJSDate(), // a long time ago (1 january)
		})

		jest.spyOn(prisma.flashcard, 'count').mockResolvedValue(5)

		const result = await calculateStreakStatus()

		expect(result).toEqual({
			activeLearningProfileId: 10,
			dbStreakCount: 0,
			dbLongestStreak: 12,
			newStreakCount: 0,
			shouldReset: false, // dbStreakCount was already 0, so shouldReset stays false based on code logic
			shouldIncrement: false,
		})
	})
})
