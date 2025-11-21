'use server'
import {prisma} from '@/prisma/client'
import {z} from 'zod'
import {getCurrentUser} from '../user'
import {flashcardFormSchema} from './schema'
import {FlashcardActionState, FlashcardFormErrors, FlashcardFormValues} from './types'

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
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated')

	const activeLearningProfile = user.activeLearningProfile
	const activeLearningProfileId = user.activeLearningProfileId

	if (!activeLearningProfile || !activeLearningProfileId) throw new Error('No active learning profile found.')

	const validation = parseAndValidateFlashcard(formData)
	if (!validation.success) {
		return validation.errorState
	}

	try {
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
	const user = await getCurrentUser()
	if (!user || !user.activeLearningProfileId) throw new Error('User or profile not found')

	const validation = parseAndValidateFlashcard(formData)
	if (!validation.success) return validation.errorState

	try {
		await prisma.flashcard.update({
			where: {
				id: flashcardId,
				learningProfileId: user.activeLearningProfileId,
			},
			data: {
				question: validation.data.question,
				note: validation.data.note || null,
				synonyms: validation.data.synonyms?.filter(Boolean),
				examples: validation.data.examples?.filter(Boolean),
				answer: {
					update: {
						text: validation.data.answer,
						phonetic: validation.data.phonetic || null,
					},
				},
			},
		})

		return {status: 'success', message: 'Flashcard updated successfully.', errors: {}}
	} catch (error) {
		console.error('Error updating flashcard:', error)
		return {status: 'error', message: 'Failed to update flashcard.', errors: {}}
	}
}

export async function getFlashcardById(flashcardId: number) {
	const user = await getCurrentUser()
	if (!user || !user.activeLearningProfileId) throw new Error('User or profile not found')
	try {
		const flashcard = await prisma.flashcard.findFirst({
			where: {
				id: flashcardId,
				learningProfileId: user.activeLearningProfileId,
			},
			include: {
				answer: true,
			},
		})
		return flashcard
	} catch (error) {
		console.error('Error fetching flashcard:', error)
		return null
	}
}
