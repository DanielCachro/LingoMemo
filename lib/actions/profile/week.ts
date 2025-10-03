'use server'
import {getCurrentUser} from '@/lib/actions/user'
import {getUserTimeZoneString} from '@/lib/client/timeRanges'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'

function getStartOfWeek(timezone: string) {
	const today = DateTime.now().setZone(timezone).setLocale('en-US')
	const dayOfWeek = today.weekday
	const diffToMonday = dayOfWeek === 1 ? 0 : 1 - dayOfWeek
	return today.plus({days: diffToMonday}).startOf('day')
}

export async function getWeekdaysCompletion() {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated')
	const activeLearningProfileId = user.activeLearningProfileId
	if (!activeLearningProfileId) throw new Error('No active learning profile found')

	const userTimeZone = getUserTimeZoneString({timezone: user.timeZone, offsetMinutes: user.utcOffsetMinutes})

	const days = []
	const monday = getStartOfWeek(userTimeZone)
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
						gte: date.startOf('day').toUTC().toJSDate(),
						lte: date.endOf('day').toUTC().toJSDate(),
					},
				},
			})) !== null

		days.push({day, dayLabel, datetime, completed: completedThatDay})
	}

	return days
}

export async function getLast7DaysCompletionCount() {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated')
	const activeLearningProfileId = user.activeLearningProfileId
	if (!activeLearningProfileId) throw new Error('No active learning profile found')

	const userTimeZone = getUserTimeZoneString({timezone: user.timeZone, offsetMinutes: user.utcOffsetMinutes})

	const days = []
	const today = DateTime.now().setZone(userTimeZone).setLocale('en-US')

	for (let i = 0; i < 7; i++) {
		const date = today.minus({days: i})

		const day = date.day
		const month = date.toLocaleString({month: 'short'})
		const datetime = date.toISODate() ?? undefined

		const cardsCompleted = await prisma.flashcardReviewLog.count({
			where: {
				learningProfileId: activeLearningProfileId,
				reviewedAt: {
					gte: date.startOf('day').toUTC().toJSDate(),
					lte: date.endOf('day').toUTC().toJSDate(),
				},
			},
		})

		days.unshift({day, month, datetime, cardsCompleted})
	}

	return days
}

export async function getWeekFlashcardCount() {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated')
	const activeLearningProfileId = user.activeLearningProfileId
	if (!activeLearningProfileId) throw new Error('No active learning profile found')

	const userTimeZone = getUserTimeZoneString({timezone: user.timeZone, offsetMinutes: user.utcOffsetMinutes})

	const monday = getStartOfWeek(userTimeZone)
	const sunday = monday.plus({days: 6})

	const flashcardCount = await prisma.flashcardReviewLog.count({
		where: {
			learningProfileId: activeLearningProfileId,
			reviewedAt: {
				gte: monday.startOf('day').toUTC().toJSDate(),
				lte: sunday.endOf('day').toUTC().toJSDate(),
			},
		},
	})

	return flashcardCount
}
