import 'server-only'

import {prisma} from '@/prisma/client'
import {getCurrentUser} from './user'

export async function getFlashcardById(flashcardId: number) {
	try {
		const user = await getCurrentUser()
		if (!user || !user.activeLearningProfileId) throw new Error('User or profile not found')

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
