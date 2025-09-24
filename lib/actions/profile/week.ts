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
		const day = date.day
		const dayLabel = date.toLocaleString({weekday: 'short'})
		const datetime = date.toISODate() ?? undefined

		const completedThatDay =
			(await prisma.flashcardReviewLog.findFirst({
				select: {reviewedAt: true},
				where: {
					learningProfileId: activeLearningProfileId,
					reviewedAt: {
						gte: date.startOf('day').toJSDate(),
						lte: date.endOf('day').toJSDate(),
					},
				},
			})) !== null

		days.push({day, dayLabel, datetime, completed: completedThatDay})
	}

	return days
}

export async function getLast7DaysCompletionCount() {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated.')

	const activeLearningProfileId = user.activeLearningProfileId
	if (!activeLearningProfileId) throw new Error('No active learning profile for user.')

	const days = []
	const today = DateTime.now().setZone('UTC').setLocale('en-US')

	for (let i = 0; i < 7; i++) {
		const date = today.minus({days: i})

		const day = date.day
		const month = date.toLocaleString({month: 'short'})
		const datetime = date.toISODate() ?? undefined

		const cardsCompleted = await prisma.flashcardReviewLog.count({
			where: {
				learningProfileId: activeLearningProfileId,
				reviewedAt: {
					gte: date.startOf('day').toJSDate(),
					lte: date.endOf('day').toJSDate(),
				},
			},
		})

		days.unshift({day, month, datetime, cardsCompleted})
	}

	return days
}
