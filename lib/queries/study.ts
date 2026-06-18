import 'server-only'

import {Prisma} from '@/lib/generated/prisma/client'
import {getUserDayRangeUTC} from '@/lib/utils/time'
import {prisma} from '@/prisma/client'
import {getCurrentUser} from './user'

export async function getStudyData() {
	const user = await getCurrentUser()
	const activeLearningProfileId = user?.activeLearningProfileId

	if (!activeLearningProfileId) throw new Error('No active learning profile for user')
	const {startOfTodayUTC, endOfTodayUTC} = getUserDayRangeUTC({
		timezone: user.timeZone,
		offsetMinutes: user.utcOffsetMinutes,
	})

	const [flashcard, doneToday, toReview] = await Promise.all([
		prisma.flashcard.findFirst({
			where: {
				learningProfileId: activeLearningProfileId,
				nextReview: {
					not: null,
					lte: endOfTodayUTC.toJSDate(),
				},
			},
			include: {answer: true},
		}),
		prisma.flashcardReviewLog.count({
			where: {
				learningProfileId: activeLearningProfileId,
				reviewedAt: {
					gte: startOfTodayUTC.toJSDate(),
					lte: endOfTodayUTC.toJSDate(),
				},
			},
		}),
		prisma.flashcard.count({
			where: {
				learningProfileId: activeLearningProfileId,
				nextReview: {
					not: null,
					lte: endOfTodayUTC.toJSDate(),
				},
			},
		}),
	])

	const toReviewToday = toReview + doneToday

	return {flashcard, doneToday, toReviewToday}
}

export async function getNextFlashcards(limit = 5, excludeIds: number[] = []) {
	if (limit < 1 || limit > 20) throw new Error('Limit must be between 1 and 20')

	const user = await getCurrentUser()
	const activeLearningProfileId = user?.activeLearningProfileId
	if (!activeLearningProfileId) return []

	const {endOfTodayUTC} = getUserDayRangeUTC({
		timezone: user.timeZone,
		offsetMinutes: user.utcOffsetMinutes,
	})

	const where: Prisma.FlashcardWhereInput = {
		learningProfileId: activeLearningProfileId,
		nextReview: {
			not: null,
			lte: endOfTodayUTC.toJSDate(),
		},
	}

	if (Array.isArray(excludeIds) && excludeIds.length > 0) {
		where.id = {notIn: excludeIds}
	}

	const cards = await prisma.flashcard.findMany({
		where,
		include: {answer: true},
		orderBy: [{nextReview: 'asc'}, {id: 'asc'}],
		take: limit,
	})

	return cards
}
