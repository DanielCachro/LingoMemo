'use server'
import {getActiveLearingProfile} from '@/lib/actions/user'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'

function getStartOfWeek() {
	const today = DateTime.now().setZone('UTC').setLocale('en-US')
	const dayOfWeek = today.weekday
	const diffToMonday = dayOfWeek === 1 ? 0 : 1 - dayOfWeek
	return today.plus({days: diffToMonday}).startOf('day')
}

export async function getWeekdaysCompletion() {
	const {activeLearningProfileId} = await getActiveLearingProfile()

	const days = []
	const monday = getStartOfWeek()
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
	const {activeLearningProfileId} = await getActiveLearingProfile()

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

export async function getWeekFlashcardCount() {
	const {activeLearningProfileId} = await getActiveLearingProfile()

	const monday = getStartOfWeek()
	const sunday = monday.plus({days: 6})

	const flashcardCount = await prisma.flashcardReviewLog.count({
		where: {
			learningProfileId: activeLearningProfileId,
			reviewedAt: {
				gte: monday.startOf('day').toJSDate(),
				lte: sunday.endOf('day').toJSDate(),
			},
		},
	})

	return flashcardCount
}
