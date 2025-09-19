import {getCurrentUser} from '@/lib/actions/user'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'
import {revalidateTag} from 'next/cache'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser()
		if (!user) throw new Error('User not authenticated.')

		const activeLearningProfile = user.activeLearningProfile
		const activeLearningProfileId = user.activeLearningProfileId

		if (!activeLearningProfile || !activeLearningProfileId) throw new Error('No active learning profile for user')

		const startOfTodayUTC = DateTime.now().setZone('UTC').startOf('day')
		const endOfTodayUTC = DateTime.now().setZone('UTC').endOf('day')

		const lastUpdated = activeLearningProfile.streakLastUpdated
			? DateTime.fromJSDate(activeLearningProfile.streakLastUpdated).setZone('UTC').startOf('day')
			: null

		if (lastUpdated && lastUpdated.hasSame(startOfTodayUTC, 'day')) {
			console.log('Streak has already been updated today.')
			return NextResponse.json({message: 'Streak has already been updated today.', data: activeLearningProfile})
		}

		const doneToday = await prisma.flashcardReviewLog.count({
			where: {
				learningProfileId: activeLearningProfileId,
				reviewedAt: {
					gte: startOfTodayUTC.toJSDate(),
					lt: endOfTodayUTC.toJSDate(),
				},
			},
		})

		if (doneToday === 0) {
			console.log('No reviews done today. Streak not updated.')
			return NextResponse.json({message: 'No reviews done today. Streak not updated.', data: activeLearningProfile})
		}

		const yesterday = startOfTodayUTC.minus({days: 1})

		let newStreakCount = activeLearningProfile.streakCount
		let newLongestStreak = activeLearningProfile.longestStreak

		if (lastUpdated && lastUpdated.hasSame(yesterday, 'day')) {
			newStreakCount++
		} else {
			newStreakCount = 1
		}

		if (newStreakCount > newLongestStreak) {
			newLongestStreak = newStreakCount
		}

		try {
			const updatedProfile = await prisma.learningProfile.update({
				where: {
					id: activeLearningProfileId,
				},
				data: {
					streakCount: newStreakCount,
					longestStreak: newLongestStreak,
					streakLastUpdated: DateTime.now().setZone('UTC').toJSDate(),
				},
			})

			revalidateTag('totalStreak')

			return NextResponse.json({message: 'Streak updated successfully!', data: updatedProfile})
		} catch (error) {
			console.error('Error updating streak:', error)
			return NextResponse.json({error: 'A server error occurred.'}, {status: 500})
		}
	} catch (error: unknown) {
		console.error('Error updating streak:', error)
		return NextResponse.json({error: (error as Error).message || 'Unknown error'}, {status: 500})
	}
}
