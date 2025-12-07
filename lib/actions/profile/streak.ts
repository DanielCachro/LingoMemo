'use server'
import {getCurrentUser} from '@/lib/actions/user'
import {getUserDayRangeUTC, getUserTimeZoneString} from '@/lib/time'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'

async function calculateStreakStatus() {
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
	else if (
		toReviewToday === 0 &&
		studyLastCompletedDate &&
		startOfTodayUTC.diff(studyLastCompletedDate, 'days').days !== 0
	) {
		calculatedStreakCount = streakCount + 1
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

export async function getStreakData() {
	const status = await calculateStreakStatus()
	if (!status) throw new Error('User not authenticated or no profile')

	return {
		streakCount: status.calculatedStreakCount,
		longestStreak: status.shouldIncrement
			? Math.max(status.longestStreak, status.calculatedStreakCount)
			: status.longestStreak,
	}
}

export async function updateStreak() {
	const status = await calculateStreakStatus()
	if (!status) return {updated: false}

	const {activeLearningProfileId, streakCount, longestStreak, shouldReset, shouldIncrement} = status

	if (shouldReset) {
		try {
			await prisma.learningProfile.update({
				where: {id: activeLearningProfileId},
				data: {streakCount: 0},
			})
			console.log(`Streak is broken. Resetting streak for profile ID: ${activeLearningProfileId}`)
			return {updated: true, newStreak: 0}
		} catch (error) {
			console.error('Error updating streak:', error)
			throw new Error((error as Error).message || 'Unknown error')
		}
	}

	if (shouldIncrement) {
		try {
			await prisma.$transaction([
				prisma.learningProfile.update({
					where: {id: activeLearningProfileId},
					data: {
						streakCount: streakCount + 1,
						longestStreak: Math.max(longestStreak, streakCount + 1),
					},
				}),
				prisma.studyCompletionLog.create({
					data: {
						learningProfileId: activeLearningProfileId,
						// completedAt is set to the start of the day to avoid multiple reviews in one day thanks to a unique constraint
						// this is acceptable as we only care about the date, not the exact time
						completedAt: DateTime.now().toUTC().startOf('day').toJSDate(),
					},
				}),
			])
			console.log(`No reviews planned for today. Incrementing streak for profile ID: ${activeLearningProfileId}`)
			return {updated: true, newStreak: streakCount + 1}
		} catch (error) {
			console.error('Error updating streak:', error)
			throw new Error((error as Error).message || 'Unknown error')
		}
	}

	return {updated: false}
}
