'use server'
import {getCurrentUser} from '@/lib/actions/user'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'

export async function getStreakData() {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated.')

	const activeLearningProfileId = user.activeLearningProfileId
	const activeLearningProfile = user.activeLearningProfile
	if (!activeLearningProfileId || !activeLearningProfile) throw new Error('No active learning profile for user.')
	let streakCount = activeLearningProfile.streakCount
	const longestStreak = activeLearningProfile.longestStreak

	const startOfTodayUTC = DateTime.now().setZone('UTC').startOf('day')
	const streakLastUpdated = activeLearningProfile.streakLastUpdated
		? DateTime.fromJSDate(activeLearningProfile.streakLastUpdated).setZone('UTC').startOf('day')
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
