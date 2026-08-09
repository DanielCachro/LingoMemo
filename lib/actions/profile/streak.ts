'use server'

import calculateStreakStatus from '@/lib/utils/profile/calculateStreakStatus'
import {prisma} from '@/prisma/client'
import {PrismaPromise} from '@prisma/client/runtime/client'
import {DateTime} from 'luxon'

export async function updateStreak() {
	const status = await calculateStreakStatus()
	if (!status) return {updated: false}

	const {activeLearningProfileId, dbLongestStreak, newStreakCount, shouldReset, shouldIncrement} = status

	// If nothing has changed, exit early to avoid unnecessary database writes
	if (!shouldReset && !shouldIncrement) {
		return {updated: false}
	}

	try {
		const dbOperations: PrismaPromise<unknown>[] = [
			prisma.learningProfile.update({
				where: {id: activeLearningProfileId},
				data: {
					streakCount: newStreakCount,
					longestStreak: Math.max(dbLongestStreak, newStreakCount),
				},
			}),
		]

		// log creation ONLY if we are incrementing the streak
		if (shouldIncrement) {
			dbOperations.push(
				prisma.studyCompletionLog.create({
					data: {
						learningProfileId: activeLearningProfileId,
						completedAt: DateTime.now().toUTC().startOf('day').toJSDate(),
					},
				}),
			)
		}

		// execute all operations in a single transaction
		await prisma.$transaction(dbOperations)

		// determine the appropriate message and log based on the flags
		let message = ''

		if (shouldReset && shouldIncrement) {
			console.log(
				`Streak broken but recovered immediately. Resetting and incrementing for profile ID: ${activeLearningProfileId}`,
			)
			message =
				'You missed a day, so your streak reset. 💔 But since you have no cards today, you get a free point! Start of a new streak! 🚀'
		} else if (shouldReset) {
			console.log(`Streak is broken. Resetting streak for profile ID: ${activeLearningProfileId}`)
			message =
				"Oh. You missed a day. Your streak is gone. 💔 But don't just stare at the zero. Show me you can beat your old record. Start now!"
		} else if (shouldIncrement) {
			console.log(`No reviews planned for today. Incrementing streak for profile ID: ${activeLearningProfileId}`)
			message = 'It’s quiet... too quiet. No cards for today! Enjoy the free streak point. 👀'
		}

		return {
			updated: true,
			newStreak: newStreakCount,
			message,
		}
	} catch (error) {
		console.error('Error updating streak:', error)
		throw new Error((error as Error).message || 'Unknown error')
	}
}
