'use server'
import {getCurrentUser} from '@/lib/actions/user'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'

export async function getWeekdaysCompletion() {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated.')

	const activeLearningProfileId = user.activeLearningProfileId
	if (!activeLearningProfileId) throw new Error('No active learning profile for user.')

	const days = []
	const today = DateTime.now().setZone('UTC')

	const dayOfWeek = today.weekday
	const diffToMonday = dayOfWeek === 1 ? 0 : 1 - dayOfWeek

	const monday = DateTime.now().setZone('UTC').setLocale('en-US').plus({days: diffToMonday})

	for (let i = 0; i < 7; i++) {
		const date = monday.plus({days: i})
		const startOfDate = date.startOf('day').toJSDate()
		const endOfDate = date.endOf('day').toJSDate()
		const day = date.day
		const dayLabel = date.toLocaleString({weekday: 'short'})
		const datetime = date.toISODate() ?? undefined

		const completedThatDay =
			(await prisma.flashcardReviewLog.findFirst({
				select: {reviewedAt: true},
				where: {
					learningProfileId: activeLearningProfileId,
					reviewedAt: {gte: startOfDate, lte: endOfDate},
				},
			})) !== null

		days.push({day, dayLabel, datetime, completed: completedThatDay})
	}

	return days
}
