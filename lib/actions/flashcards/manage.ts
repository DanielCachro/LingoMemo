'use server'
import {getCurrentUser} from '@/lib/queries/user'
import {prisma} from '@/prisma/client'
import {FlashcardActionState} from '@/types/flashcards'
import {parseAndValidateFlashcard} from './manageUtils'

export async function createFlashcard(_: FlashcardActionState, formData: FormData): Promise<FlashcardActionState> {
	try {
		const user = await getCurrentUser()
		if (!user) throw new Error('User not authenticated')

		const activeLearningProfile = user.activeLearningProfile
		const activeLearningProfileId = user.activeLearningProfileId

		if (!activeLearningProfile || !activeLearningProfileId) throw new Error('No active learning profile found.')

		const validation = parseAndValidateFlashcard(formData)
		if (!validation.success) {
			return validation.errorState
		}

		await prisma.flashcard.create({
			data: {
				question: validation.data.question,
				note: validation.data.note || null,
				synonyms: validation.data.synonyms?.filter(Boolean),
				examples: validation.data.examples?.filter(Boolean),
				answer: {
					create: {
						text: validation.data.answer,
						phonetic: validation.data.phonetic || null,
						isPersonal: true,
					},
				},
				learningProfile: {
					connect: {
						id: activeLearningProfileId,
					},
				},
			},
		})

		return {
			status: 'success',
			message: 'Flashcard created successfully.',
			errors: {
				question: undefined,
				answer: undefined,
				note: undefined,
				phonetic: undefined,
				synonyms: undefined,
				examples: undefined,
			},
		}
	} catch (error) {
		console.error('Error creating flashcard:', error)
		return {
			status: 'error',
			message: 'An unexpected error occurred while creating the flashcard.',
			errors: {},
		}
	}
}

export async function updateFlashcard(
	flashcardId: number,
	_: FlashcardActionState,
	formData: FormData,
): Promise<FlashcardActionState> {
	try {
		const user = await getCurrentUser()
		if (!user) throw new Error('User not authenticated')

		const activeLearningProfile = user.activeLearningProfile
		const activeLearningProfileId = user.activeLearningProfileId

		if (!activeLearningProfile || !activeLearningProfileId) throw new Error('No active learning profile found.')

		const validation = parseAndValidateFlashcard(formData)
		if (!validation.success) return validation.errorState

		const currentFlashcard = await prisma.flashcard.findUnique({
			where: {
				id: flashcardId,
				learningProfileId: activeLearningProfileId,
			},
			include: {
				answer: true,
			},
		})

		if (!currentFlashcard) {
			return {status: 'error', message: 'Flashcard not found.', errors: {}}
		}

		const commonData = {
			question: validation.data.question,
			note: validation.data.note || null,
			synonyms: validation.data.synonyms?.filter(Boolean),
			examples: validation.data.examples?.filter(Boolean),
		}

		const newPhonetic = validation.data.phonetic || null
		const hasAnswerChanged =
			validation.data.answer !== currentFlashcard.answer.text || newPhonetic !== currentFlashcard.answer.phonetic

		// If the answer hasn't changed or the current answer is already personal, update the existing answer. Otherwise, create a new PERSONAL answer.
		if (currentFlashcard.answer.isPersonal || !hasAnswerChanged) {
			await prisma.flashcard.update({
				where: {
					id: flashcardId,
				},
				data: {
					...commonData,
					...(hasAnswerChanged
						? {
								answer: {
									update: {
										text: validation.data.answer,
										phonetic: newPhonetic,
									},
								},
							}
						: {}),
				},
			})
		} else {
			await prisma.flashcard.update({
				where: {
					id: flashcardId,
				},
				data: {
					...commonData,
					answer: {
						create: {
							text: validation.data.answer,
							phonetic: newPhonetic,
							isPersonal: true,
						},
					},
				},
			})
		}

		return {status: 'success', message: 'Flashcard updated successfully.', errors: {}, data: validation.data}
	} catch (error) {
		console.error('Error updating flashcard:', error)
		return {status: 'error', message: 'Failed to update flashcard.', errors: {}}
	}
}

export async function deleteFlashcard(flashcardId: number): Promise<{success: boolean; error?: string}> {
	try {
		const user = await getCurrentUser()
		if (!user) throw new Error('User not authenticated')

		const activeLearningProfile = user.activeLearningProfile
		const activeLearningProfileId = user.activeLearningProfileId

		if (!activeLearningProfile || !activeLearningProfileId) throw new Error('No active learning profile found.')

		await prisma.flashcard.delete({
			where: {
				id: flashcardId,
				learningProfileId: activeLearningProfileId,
			},
		})
		return {success: true}
	} catch (error) {
		console.error('Error deleting flashcard:', error)
		return {success: false, error: 'Failed to delete flashcard.'}
	}
}

export async function bulkDeleteFlashcards(flashcardIds: number[]): Promise<{success: boolean; error?: string}> {
	try {
		const user = await getCurrentUser()
		if (!user) throw new Error('User not authenticated')

		const activeLearningProfile = user.activeLearningProfile
		const activeLearningProfileId = user.activeLearningProfileId

		if (!activeLearningProfile || !activeLearningProfileId) throw new Error('No active learning profile found.')

		await prisma.flashcard.deleteMany({
			where: {
				id: {
					in: flashcardIds,
				},
				learningProfileId: activeLearningProfileId,
			},
		})
		return {success: true}
	} catch (error) {
		console.error('Error deleting flashcards in bulk:', error)
		return {success: false, error: 'Failed to delete flashcards.'}
	}
}
