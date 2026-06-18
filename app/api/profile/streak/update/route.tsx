import {getCurrentUser} from '@/lib/queries/user'
import {getUserDayRangeUTC} from '@/lib/utils/time'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'
import {NextResponse} from 'next/server'

export async function POST() {
	const user = await getCurrentUser()
	if (!user) return NextResponse.json({error: 'User not authenticated.'}, {status: 401})

	const activeLearningProfile = user.activeLearningProfile
	const activeLearningProfileId = user.activeLearningProfileId

	if (!activeLearningProfile || !activeLearningProfileId)
		return NextResponse.json({error: 'No active learning profile found.'}, {status: 400})

	const {startOfTodayUTC, endOfTodayUTC} = getUserDayRangeUTC({
		timezone: user.timeZone,
		offsetMinutes: user.utcOffsetMinutes,
	})

	const studyCompletedToday = (await prisma.studyCompletionLog.findFirst({
		select: {completedAt: true},
		where: {
			learningProfileId: activeLearningProfileId,
			completedAt: {
				gte: startOfTodayUTC.toJSDate(),
				lte: endOfTodayUTC.toJSDate(),
			},
		},
	}))
		? true
		: false

	if (studyCompletedToday) {
		console.log('Streak has already been updated today.')
		return NextResponse.json({message: 'Streak has already been updated today.'}, {status: 200})
	}

	const doneToday = await prisma.flashcardReviewLog
		.count({
			where: {
				learningProfileId: activeLearningProfileId,
				reviewedAt: {
					gte: startOfTodayUTC.toJSDate(),
					lte: endOfTodayUTC.toJSDate(),
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

	const startOfYesterdayUTC = startOfTodayUTC.minus({days: 1})
	const studyCompletedYesterday = (await prisma.studyCompletionLog.findFirst({
		where: {
			learningProfileId: activeLearningProfileId,
			completedAt: {
				gte: startOfYesterdayUTC.toJSDate(),
				lte: startOfTodayUTC.toJSDate(),
			},
		},
	}))
		? true
		: false

	let newStreakCount = activeLearningProfile.streakCount
	if (studyCompletedYesterday) {
		newStreakCount++
	} else {
		newStreakCount = 1
	}

	const newLongestStreak = Math.max(activeLearningProfile.longestStreak, newStreakCount)

	try {
		const [updatedProfile] = await prisma.$transaction([
			prisma.learningProfile.update({
				where: {id: activeLearningProfileId},
				data: {
					streakCount: newStreakCount,
					longestStreak: newLongestStreak,
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

		return NextResponse.json({message: 'Streak updated successfully!', data: updatedProfile}, {status: 200})
	} catch (error) {
		console.error('Error updating streak:', error)
		return NextResponse.json({error: (error as Error).message || 'Unknown error'}, {status: 500})
	}
}
