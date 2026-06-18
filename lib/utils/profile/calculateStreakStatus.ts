import {getCurrentUser} from '@/lib/queries/user'
import {getUserDayRangeUTC, getUserTimeZoneString} from '@/lib/utils/time'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'
import 'server-only'

export default async function calculateStreakStatus() {
	const user = await getCurrentUser()
	if (!user) return null

	const activeLearningProfile = user.activeLearningProfile
	const activeLearningProfileId = user.activeLearningProfileId

	if (!activeLearningProfile || !activeLearningProfileId) return null

	const streakCount = activeLearningProfile.streakCount
	const longestStreak = activeLearningProfile.longestStreak

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

	let calculatedStreakCount = streakCount
	let shouldReset = false
	let shouldIncrement = false

	// Check if broken
	if (studyLastCompletedDate && startOfTodayUTC.diff(studyLastCompletedDate, 'days').days >= 2 && streakCount !== 0) {
		calculatedStreakCount = 0
		shouldReset = true
	}

	// Update streak if no flashcard reviews planned for today
	// New profiles don't have studyCompletionLog entry, so we dont need to worry that we will increment streak for them at first login
	if (
		toReviewToday === 0 &&
		studyLastCompletedDate &&
		startOfTodayUTC.diff(studyLastCompletedDate, 'days').days !== 0
	) {
		calculatedStreakCount = calculatedStreakCount + 1
		shouldIncrement = true
	}

	return {
		activeLearningProfileId,
		streakCount, // DB value
		longestStreak, // DB value
		calculatedStreakCount, // New value
		shouldReset,
		shouldIncrement,
	}
}
