'use server'
import {getCurrentUser} from '@/lib/actions/user'
import {getUserDayRangeUTC, getUserTimeZoneString} from '@/lib/client/timeRanges'
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

	const {startOfTodayUTC} = getUserDayRangeUTC({
		timezone: user.timeZone,
		offsetMinutes: user.utcOffsetMinutes,
	})

	const userTimeZone = getUserTimeZoneString({
		timezone: user.timeZone,
		offsetMinutes: user.utcOffsetMinutes,
	})

	const streakLastUpdated = activeLearningProfile.streakLastUpdated
		? DateTime.fromJSDate(activeLearningProfile.streakLastUpdated).setZone(userTimeZone).startOf('day').toUTC()
		: null

	// Reset streak if broken
	if (streakLastUpdated && startOfTodayUTC.diff(streakLastUpdated, 'days').days >= 2 && streakCount !== 0) {
		try {
			await prisma.learningProfile.update({
				where: {
					id: activeLearningProfileId,
				},
				data: {
					streakCount: 0,
				},
			})
			// Optimistic update streakCount
			streakCount = 0
			console.log(`Streak is broken. Resetting streak for profile ID: ${activeLearningProfileId}`)
		} catch (error) {
			// If update fails, keep the existing streakCount
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
