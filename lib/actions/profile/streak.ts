'use server'
import {getCurrentUser} from '@/lib/actions/user'
import {getUserDayRangeUTC, getUserTimeZoneString} from '@/lib/time'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'
import {cache} from 'react'

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

export const getStreakData = cache(async () => {
	const status = await calculateStreakStatus()
	if (!status) throw new Error('User not authenticated or no profile')

	return {
		streakCount: status.calculatedStreakCount,
		longestStreak: status.shouldIncrement
			? Math.max(status.longestStreak, status.calculatedStreakCount)
			: status.longestStreak,
	}
})

export async function updateStreak() {
	const status = await calculateStreakStatus()
	if (!status) return {updated: false}

	const {activeLearningProfileId, streakCount, longestStreak, shouldReset, shouldIncrement} = status

	if (shouldReset && shouldIncrement) {
		try {
			await prisma.$transaction([
				prisma.learningProfile.update({
					where: {id: activeLearningProfileId},
					data: {
						streakCount: 1,
						longestStreak: Math.max(longestStreak, 1),
					},
				}),
				prisma.studyCompletionLog.create({
					data: {
						learningProfileId: activeLearningProfileId,
						completedAt: DateTime.now().toUTC().startOf('day').toJSDate(),
					},
				}),
			])
			console.log(
				`Streak broken but recovered immediately. Resetting and incrementing for profile ID: ${activeLearningProfileId}`,
			)
			return {
				updated: true,
				newStreak: 1,
				message:
					'You missed a day, so your streak reset. 💔 But since you have no cards today, you get a free point! Start of a new streak! 🚀',
			}
		} catch (error) {
			console.error('Error updating streak:', error)
			throw new Error((error as Error).message || 'Unknown error')
		}
	}

	if (shouldReset) {
		try {
			await prisma.learningProfile.update({
				where: {id: activeLearningProfileId},
				data: {streakCount: 0},
			})
			console.log(`Streak is broken. Resetting streak for profile ID: ${activeLearningProfileId}`)
			return {
				updated: true,
				newStreak: 0,
				message:
					"Oh. You missed a day. Your streak is gone. 💔 But don't just stare at the zero. Show me you can beat your old record. Start now!",
			}
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
			return {
				updated: true,
				newStreak: streakCount + 1,
				message: 'It’s quiet... too quiet. No cards for today! Enjoy the free streak point. 👀',
			}
		} catch (error) {
			console.error('Error updating streak:', error)
			throw new Error((error as Error).message || 'Unknown error')
		}
	}

	return {updated: false}
}
