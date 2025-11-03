'use server'
import {getCurrentUser} from '@/lib/actions/user'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'
import {revalidatePath} from 'next/cache'
import {Flashcard, FlashcardSchema} from './schema'

export async function getTargetLang() {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated')

	const activeLearningProfile = user.activeLearningProfile
	if (!activeLearningProfile) throw new Error('No active learning profile found.')

	return activeLearningProfile.targetLang
}

export async function createFlashcard(flashcard: Flashcard) {
	const userData = await getCurrentUser()
	if (!userData) throw new Error('User not authenticated')

	const parsed = FlashcardSchema.safeParse(flashcard)
	if (!parsed.success) {
		console.error(parsed.error)
		throw new Error('Invalid flashcard data')
	}

	const flashcardData = parsed.data

	try {
		await prisma.$transaction(async tx => {
			const existingAnswer = await tx.answer.findFirst({
				where: {text: flashcardData.answer.trim()},
				include: {license: true},
			})

			let answerId: number

			if (existingAnswer && !existingAnswer.isPersonal) {
				// Connect with the existing answer if it is not personal.
				// Do this to relieve the database of unnecessarily repeated answer records when adding them from the dictionary.
				answerId = existingAnswer.id
			} else {
				// Otherwise, create a new answer

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const answerData: any = {
					text: flashcardData.answer.trim(),
					phonetic: flashcardData.phonetic ?? null,
					audio: flashcardData.audio ?? [],
				}

				if (flashcardData.license) {
					answerData.license = {
						create: {
							name: flashcardData.license.name,
							licenseUrl: flashcardData.license.licenseUrl,
							sourceUrl: flashcardData.license.sourceUrl,
						},
					}
				}

				const createdAnswer = await tx.answer.create({data: answerData})
				answerId = createdAnswer.id
			}

			const existingFlashcard = await tx.flashcard.findFirst({
				where: {
					question: flashcardData.question,
					answerId,
					learningProfileId: userData.activeLearningProfileId!,
				},
			})

			if (existingFlashcard) {
				return // Do not create duplicate flashcards
			}

			await tx.flashcard.create({
				data: {
					question: flashcardData.question,
					note: flashcardData.note ?? null,
					examples: flashcardData.examples ?? [],
					synonyms: flashcardData.synonyms ?? [],
					answerId,
					learningProfileId: userData.activeLearningProfileId!,
					createdAt: DateTime.now().toUTC().toJSDate(),
					nextReview: DateTime.now().toUTC().toJSDate(),
				},
			})
		})
	} catch (error) {
		console.log(`Error creating flashcard: ${(error as Error).message}`)
		throw new Error(`Error creating flashcard. Please try again later.`)
	}

	revalidatePath('/dictionary')
}

export async function deleteFlashcard(id: number) {
	const userData = await getCurrentUser()
	if (!userData) throw new Error('User not authenticated')

	try {
		await prisma.flashcard.delete({
			where: {
				id,
				AND: {learningProfileId: userData.activeLearningProfileId!},
			},
		})
	} catch (error) {
		console.log(`Error deleting flashcard: ${(error as Error).message}`)
		throw new Error(`Error deleting flashcard. Please try again later.`)
	}

	revalidatePath('/dictionary')
}

export async function findFlashcardId(question: string, answer: string) {
	const userData = await getCurrentUser()
	const learningProfileId = userData?.activeLearningProfileId

	let flashcard = null
	if (question && answer && learningProfileId) {
		flashcard = await prisma.flashcard.findFirst({
			where: {
				question,
				answer: {
					text: answer,
				},
				learningProfileId,
			},
		})
	}

	return flashcard?.id || null
}
