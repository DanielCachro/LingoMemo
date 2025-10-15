'use server'
import {getCurrentUser} from '@/lib/actions/user'
import {getUserDayRangeUTC, getUserTimeZoneString} from '@/lib/time'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'

export async function getStreakData() {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated')

	const activeLearningProfile = user.activeLearningProfile
	const activeLearningProfileId = user.activeLearningProfileId

	if (!activeLearningProfile || !activeLearningProfileId) throw new Error('No active learning profile found.')
	let streakCount = activeLearningProfile.streakCount
	const longestStreak = activeLearningProfile.longestStreak

	const {startOfTodayUTC, endOfTodayUTC} = getUserDayRangeUTC({
		timezone: user.timeZone,
		offsetMinutes: user.utcOffsetMinutes,
	})

	const userTimeZone = getUserTimeZoneString({
		timezone: user.timeZone,
		offsetMinutes: user.utcOffsetMinutes,
	})

	const lastStudyCompletion = await prisma.studyCompletionLog.findFirst({
		select: {completedAt: true},
		where: {learningProfileId: activeLearningProfileId},
		orderBy: {completedAt: 'desc'},
	})

	const studyLastCompletedDate = lastStudyCompletion?.completedAt
		? DateTime.fromJSDate(lastStudyCompletion.completedAt).setZone(userTimeZone).startOf('day').toUTC()
		: null

	// Reset streak if broken
	if (studyLastCompletedDate && startOfTodayUTC.diff(studyLastCompletedDate, 'days').days >= 2 && streakCount !== 0) {
		try {
			await prisma.learningProfile.update({
				where: {
					id: activeLearningProfileId,
				},
				data: {
					streakCount: 0,
				},
			})
			streakCount = 0
			console.log(`Streak is broken. Resetting streak for profile ID: ${activeLearningProfileId}`)
		} catch (error) {
			streakCount = activeLearningProfile.streakCount
			console.error('Error updating streak:', error)
			throw new Error((error as Error).message || 'Unknown error')
		}
	}

	const toReviewToday = await prisma.flashcard.count({
		where: {
			learningProfileId: activeLearningProfileId,
			nextReview: {
				not: null,
				lte: endOfTodayUTC.toJSDate(),
			},
		},
	})

	// Update streak if no flashcard reviews planned for today
	// New user don't have studyCompletionLog entry, so we dont need to worry that we will increment streak for them at first login
	if (
		toReviewToday === 0 &&
		studyLastCompletedDate &&
		startOfTodayUTC.diff(studyLastCompletedDate, 'days').days !== 0
	) {
		try {
			await prisma.$transaction([
				prisma.learningProfile.update({
					where: {
						id: activeLearningProfileId,
					},
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

			streakCount = streakCount + 1
			console.log(`No reviews planned for today. Incrementing streak for profile ID: ${activeLearningProfileId}`)
		} catch (error) {
			streakCount = activeLearningProfile.streakCount
			console.error('Error updating streak:', error)
			throw new Error((error as Error).message || 'Unknown error')
		}
	}

	return {
		streakCount,
		longestStreak,
	}
}
