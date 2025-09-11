'use server'
import {getCurrentUser} from '@/lib/userActions'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'
import {revalidatePath} from 'next/cache'

export async function updateFlashcard(flashcardId: number, q: number) {
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
			await tx.flashcardReviewLog
				.create({
					data: {
						flashcardId: flashcard.id,
						learningProfileId: activeLearningProfileId,
						reviewedAt: DateTime.now().toUTC().startOf('day').toJSDate(),
						eFactor: flashcard.eFactor,
					},
				})
				.catch(() => {
					revalidatePath('/study')
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
	} catch (err) {
		console.error('Error updating flashcard:', err)
		throw new Error('Failed to update flashcard')
	}

	revalidatePath('/study')
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
