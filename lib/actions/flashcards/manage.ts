'use server'
import {getCurrentUser} from '@/lib/queries/user'
import {prisma} from '@/prisma/client'
import {FlashcardActionState, FlashcardFormErrors, FlashcardFormValues} from '@/types/flashcards'
import {z} from 'zod'
import {flashcardFormSchema} from '../../utils/flashcards/schema'

function formatFlashcardErrors(error: z.ZodError): FlashcardFormErrors {
	const errors: FlashcardFormErrors = {}

	error.issues.forEach(issue => {
		const field = issue.path[0] as keyof FlashcardFormErrors
		const index = issue.path[1]

		if (field === 'synonyms' || field === 'examples') {
			if (!errors[field]) errors[field] = []
			errors[field].push({index: index as number, message: issue.message})
		} else {
			errors[field] = issue.message
		}
	})

	return errors
}

type ValidationResult = {success: true; data: FlashcardFormValues} | {success: false; errorState: FlashcardActionState}

function parseAndValidateFlashcard(formData: FormData): ValidationResult {
	const data = {
		question: formData.get('question'),
		answer: formData.get('answer'),
		note: formData.get('note'),
		phonetic: formData.get('phonetic'),
		synonyms: JSON.parse((formData.get('synonyms') as string) || '[]'),
		examples: JSON.parse((formData.get('examples') as string) || '[]'),
	}

	const parsed = flashcardFormSchema.safeParse(data)

	if (!parsed.success) {
		const errors = formatFlashcardErrors(parsed.error)
		return {
			success: false,
			errorState: {
				status: 'error',
				message: 'Validation failed. Please correct the errors and try again.',
				errors: {
					question: errors.question,
					answer: errors.answer,
					note: errors.note,
					phonetic: errors.phonetic,
					synonyms: errors.synonyms,
					examples: errors.examples,
				},
			} as FlashcardActionState,
		}
	}

	return {success: true, data: parsed.data}
}

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
		if (!user || !user.activeLearningProfileId) throw new Error('User or profile not found')

		const validation = parseAndValidateFlashcard(formData)
		if (!validation.success) return validation.errorState

		const currentFlashcard = await prisma.flashcard.findUnique({
			where: {
				id: flashcardId,
				learningProfileId: user.activeLearningProfileId,
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

		return {status: 'success', message: 'Flashcard updated successfully.', errors: {}}
	} catch (error) {
		console.error('Error updating flashcard:', error)
		return {status: 'error', message: 'Failed to update flashcard.', errors: {}}
	}
}

export async function deleteFlashcard(flashcardId: number): Promise<{success: boolean; error?: string}> {
	try {
		const user = await getCurrentUser()
		if (!user || !user.activeLearningProfileId) return {success: false, error: 'User or profile not found'}

		await prisma.flashcard.delete({
			where: {
				id: flashcardId,
				learningProfileId: user.activeLearningProfileId,
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
		if (!user || !user.activeLearningProfileId) return {success: false, error: 'User or profile not found'}

		await prisma.flashcard.deleteMany({
			where: {
				id: {
					in: flashcardIds,
				},
				learningProfileId: user.activeLearningProfileId,
			},
		})
		return {success: true}
	} catch (error) {
		console.error('Error deleting flashcards in bulk:', error)
		return {success: false, error: 'Failed to delete flashcards.'}
	}
}
