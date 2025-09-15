'use server'
import {getCurrentUser} from '@/lib/actions/user'
import {prisma} from '@/prisma/client'
import {FlashcardResponseQuality} from '@/types/study'
import {Prisma} from '@prisma/client'
import {DateTime} from 'luxon'

export async function updateFlashcard(flashcardId: number, q: FlashcardResponseQuality) {
	if (q !== 0 && q !== 3 && q !== 5) throw new Error('Invalid quality value')

	const user = await getCurrentUser()
	const activeLearningProfileId = user?.activeLearningProfileId

	if (activeLearningProfileId == null) {
		throw new Error('No active learning profile for user')
	}

	const flashcard = await prisma.flashcard.findUnique({
		where: {
			id: flashcardId,
			learningProfileId: activeLearningProfileId,
		},
	})

	if (!flashcard) throw new Error('Flashcard not found or access denied')

	let newInterval = 0

	if (q < 3) {
		newInterval = 1
	} else if (flashcard.interval < 6) {
		newInterval = 6
	} else {
		newInterval = Math.round(flashcard.interval * flashcard.eFactor)
	}

	let newEFactor = flashcard.eFactor
	if (!(q < 3)) {
		newEFactor = Math.max(1.3, flashcard.eFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))

		if (newEFactor > 2.5) newEFactor = 2.5
	}

	try {
		await prisma.$transaction(async tx => {
			await tx.flashcardReviewLog.create({
				data: {
					flashcardId: flashcard.id,
					learningProfileId: activeLearningProfileId,
					reviewedAt: DateTime.now().toUTC().startOf('day').toJSDate(),
					eFactor: flashcard.eFactor,
				},
			})

			await tx.flashcard.update({
				where: {id: flashcard.id, learningProfileId: activeLearningProfileId},
				data: {
					interval: newInterval,
					nextReview: DateTime.now().toUTC().plus({days: newInterval}).toJSDate(),
					eFactor: newEFactor,
				},
			})
		})
		return {updated: true, alreadyReviewed: false}
	} catch (err) {
		if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
			return {updated: false, alreadyReviewed: true}
		}
		console.error('Error updating flashcard:', err)
		throw new Error('Failed to update flashcard')
	}
}

export async function getStudyData() {
	const endOfTodayUTC = DateTime.now().toUTC().endOf('day').toJSDate()
	const startOfTodayUTC = DateTime.now().toUTC().startOf('day').toJSDate()
	const user = await getCurrentUser()
	const activeLearningProfileId = user?.activeLearningProfileId

	if (!activeLearningProfileId) throw new Error('No active learning profile for user')

	const [flashcard, doneToday, toReview] = await Promise.all([
		prisma.flashcard.findFirst({
			where: {
				learningProfileId: activeLearningProfileId,
				nextReview: {
					not: null,
					lte: endOfTodayUTC,
				},
			},
			include: {answer: true},
		}),
		prisma.flashcardReviewLog.count({
			where: {
				learningProfileId: activeLearningProfileId,
				reviewedAt: {
					gte: startOfTodayUTC,
					lt: endOfTodayUTC,
				},
			},
		}),
		prisma.flashcard.count({
			where: {
				learningProfileId: activeLearningProfileId,
				nextReview: {
					not: null,
					lte: endOfTodayUTC,
				},
			},
		}),
	])

	const toReviewToday = toReview + doneToday

	return {flashcard, doneToday, toReviewToday}
}

export async function getNextFlashcards(limit = 5, excludeIds: number[] = []) {
	if (limit < 1 || limit > 20) throw new Error('Limit must be between 1 and 20')

	const endOfTodayUTC = DateTime.now().toUTC().endOf('day').toJSDate()
	const user = await getCurrentUser()
	const activeLearningProfileId = user?.activeLearningProfileId
	if (!activeLearningProfileId) return []

	const where: Prisma.FlashcardWhereInput = {
		learningProfileId: activeLearningProfileId,
		nextReview: {
			not: null,
			lte: endOfTodayUTC,
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
