'use server'
import {prisma} from '@/prisma/client'
import {revalidatePath} from 'next/cache'
import {z} from 'zod'
import {getCurrentUser} from '../user'
import {flashcardFormSchema} from './schema'
import {FlashcardActionState, FlashcardFormErrors} from './types'

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

export async function createFlashcard(_: FlashcardActionState, formData: FormData): Promise<FlashcardActionState> {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated')

	const activeLearningProfile = user.activeLearningProfile
	const activeLearningProfileId = user.activeLearningProfileId

	if (!activeLearningProfile || !activeLearningProfileId) throw new Error('No active learning profile found.')

	const data = {
		question: formData.get('question'),
		answer: formData.get('answer'),
		note: formData.get('note'),
		phonetic: formData.get('phonetic'),
		synonyms: JSON.parse((formData.get('synonyms') as string) || '[]'),
		examples: JSON.parse((formData.get('examples') as string) || '[]'),
	}

	const parsedData = flashcardFormSchema.safeParse(data)
	if (!parsedData.success) {
		const errors = formatFlashcardErrors(parsedData.error)

		return {
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
		}
	}

	try {
		await prisma.flashcard.create({
			data: {
				question: parsedData.data.question,
				note: parsedData.data.note || null,
				synonyms: parsedData.data.synonyms?.filter(Boolean),
				examples: parsedData.data.examples?.filter(Boolean),
				answer: {
					create: {
						text: parsedData.data.answer,
						phonetic: parsedData.data.phonetic || null,
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

		revalidatePath('/flashcards')
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
		console.error('Database Error:', error)
		return {
			status: 'error',
			message: 'An unexpected error occurred while creating the flashcard.',
			errors: {},
		}
	}
}
