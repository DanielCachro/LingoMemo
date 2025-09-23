import {getCurrentUser} from '@/lib/actions/user'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'
import {NextResponse} from 'next/server'

export async function POST() {
	const user = await getCurrentUser()
	if (!user) return NextResponse.json({message: 'User not authenticated.'}, {status: 401})

	const activeLearningProfile = user.activeLearningProfile
	const activeLearningProfileId = user.activeLearningProfileId

	if (!activeLearningProfile || !activeLearningProfileId)
		return NextResponse.json({message: 'No active learning profile for user.'}, {status: 500})

	const startOfTodayUTC = DateTime.now().setZone('UTC').startOf('day')
	const endOfTodayUTC = DateTime.now().setZone('UTC').endOf('day')

	const lastUpdated = activeLearningProfile.streakLastUpdated
		? DateTime.fromJSDate(activeLearningProfile.streakLastUpdated).setZone('UTC').startOf('day')
		: null

	if (lastUpdated && lastUpdated.hasSame(startOfTodayUTC, 'day')) {
		console.log('Streak has already been updated today.')
		return NextResponse.json({message: 'Streak has already been updated today.'}, {status: 200})
	}

	const doneToday = await prisma.flashcardReviewLog
		.count({
			where: {
				learningProfileId: activeLearningProfileId,
				reviewedAt: {
					gte: startOfTodayUTC.toJSDate(),
					lt: endOfTodayUTC.toJSDate(),
				},
			},
		})
		.catch(error => {
			console.error("Error counting today's reviews:", error)
			return NextResponse.json({message: "Error counting today's reviews."}, {status: 500})
		})

	if (doneToday === 0) {
		console.log('No reviews done today. Streak not updated.')
		return NextResponse.json({message: 'No reviews done today. Streak not updated.'}, {status: 200})
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

		return NextResponse.json({message: 'Streak updated successfully!', data: updatedProfile}, {status: 200})
	} catch (error) {
		console.error('Error updating streak:', error)
		return NextResponse.json({error: (error as Error).message || 'Unknown error'}, {status: 500})
	}
}
