'use server'

import calculateStreakStatus from '@/lib/utils/profile/calculateStreakStatus'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'

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
