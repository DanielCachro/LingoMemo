import {getCurrentUser} from '@/lib/queries/user'
import {getUserDayRangeUTC, getUserTimeZoneString} from '@/lib/utils/time'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'
import 'server-only'

export type StreakStatusResult = {
	/** The ID of the active learning profile for the current user. */
	activeLearningProfileId: number
	/** The current streak count recorded in the database for this profile. */
	dbStreakCount: number
	/**  The longest streak recorded in the database for this profile. */
	dbLongestStreak: number
	/** Calculated new streak count based on `dbStreakCount` after checking if it has been broken or incremented. */
	newStreakCount: number
	/** Indicates if the `dbStreakCount` was broken (e.g., missed 2 days) and needs to be reset to 0. */
	shouldReset: boolean
	/** If true, the `dbStreakCount` should be incremented by 1. This is only true if there are no flashcard reviews planned for today and the last study completion was not today. */
	shouldIncrement: boolean
}

/** Calculates the streak status for the current user profile. Does not modify the database; it only returns the calculated status.*/
export default async function calculateStreakStatus(): Promise<StreakStatusResult | null> {
	const user = await getCurrentUser()
	if (!user) return null

	const activeLearningProfile = user.activeLearningProfile
	const activeLearningProfileId = user.activeLearningProfileId

	if (!activeLearningProfile || !activeLearningProfileId) return null

	const dbStreakCount = activeLearningProfile.streakCount
	const dbLongestStreak = activeLearningProfile.longestStreak

	const {startOfTodayUTC, endOfTodayUTC} = getUserDayRangeUTC({
		timezone: user.timeZone,
		offsetMinutes: user.utcOffsetMinutes,
	})

	const userTimeZone = getUserTimeZoneString({
		timezone: user.timeZone,
		offsetMinutes: user.utcOffsetMinutes,
	})

	const [lastStudyCompletion, toReviewToday] = await Promise.all([
		prisma.studyCompletionLog.findFirst({
			select: {completedAt: true},
			where: {learningProfileId: activeLearningProfileId},
			orderBy: {completedAt: 'desc'},
		}),
		prisma.flashcard.count({
			where: {
				learningProfileId: activeLearningProfileId,
				nextReview: {
					not: null,
					lte: endOfTodayUTC.toJSDate(),
				},
			},
		}),
	])

	const studyLastCompletedDate = lastStudyCompletion?.completedAt
		? DateTime.fromJSDate(lastStudyCompletion.completedAt).setZone(userTimeZone).startOf('day').toUTC()
		: null

	let newStreakCount = dbStreakCount
	let shouldReset = false
	let shouldIncrement = false

	// Check if broken
	if (studyLastCompletedDate && startOfTodayUTC.diff(studyLastCompletedDate, 'days').days >= 2 && dbStreakCount !== 0) {
		newStreakCount = 0
		shouldReset = true
	}

	// Update streak if no flashcard reviews planned for today
	// New profiles don't have studyCompletionLog entry, so we dont need to worry that we will increment streak for them at first login
	if (
		toReviewToday === 0 &&
		studyLastCompletedDate &&
		startOfTodayUTC.diff(studyLastCompletedDate, 'days').days !== 0
	) {
		newStreakCount = newStreakCount + 1
		shouldIncrement = true
	}

	return {
		activeLearningProfileId,
		dbStreakCount, // DB value
		dbLongestStreak, // DB value
		newStreakCount, // Calculated new value 
		shouldReset,
		shouldIncrement,
	}
}
