/**
 * @jest-environment node
 */

import {prisma} from '@/prisma/client'
import {setupTestDatabase} from '@/tests/mocks/db'
import {FlashcardActionState} from '@/types/flashcards'
import {createFlashcard, deleteFlashcard, updateFlashcard} from './manage'

import {getCurrentUser} from '@/lib/queries/user'
import {parseAndValidateFlashcard} from './manageUtils'

// Mock external dependencies
jest.mock('@/lib/queries/user', () => ({
	getCurrentUser: jest.fn(),
}))

jest.mock('./manageUtils', () => ({
	parseAndValidateFlashcard: jest.fn(),
}))

describe('Flashcard Server Actions', () => {
	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {})
	})

	afterAll(() => {
		jest.restoreAllMocks()
	})

	const context = setupTestDatabase()

	// dummy initial state required by react's useActionState
	const initialState: FlashcardActionState = {
		status: 'idle',
		message: '',
		errors: {},
	}

	beforeEach(() => {
		// set up default happy-path mocks before each test
		;(getCurrentUser as jest.Mock).mockResolvedValue({
			...context.user,
			activeLearningProfile: context.profile,
			activeLearningProfileId: context.profile.id,
		})
		;(parseAndValidateFlashcard as jest.Mock).mockReturnValue({
			success: true,
			data: {
				question: 'Brave',
				answer: 'Ready to face danger or pain; showing courage.',
				note: 'An important note',
				synonyms: ['courageous', 'fearless', 'bold'],
				examples: ['The brave firefighter rescued the cat from the burning tree.'],
				phonetic: '/breɪv/',
			},
		})
	})

	describe('createFlashcard', () => {
		it('should successfully create a flashcard and its related answer in the database', async () => {
			const formData = new FormData()

			const result = await createFlashcard(initialState, formData)

			expect(result.status).toBe('success')
			expect(result.message).toBe('Flashcard created successfully.')
			expect(console.error).not.toHaveBeenCalled()

			const flashcardInDb = await prisma.flashcard.findFirst({
				include: {answer: true},
			})

			expect(flashcardInDb).not.toBeNull()
			expect(flashcardInDb?.question).toBe('Brave')
			expect(flashcardInDb?.note).toBe('An important note')
			expect(flashcardInDb?.synonyms).toEqual(['courageous', 'fearless', 'bold'])
			expect(flashcardInDb?.examples).toEqual(['The brave firefighter rescued the cat from the burning tree.'])
			expect(flashcardInDb?.learningProfileId).toBe(context.profile.id)

			expect(flashcardInDb?.answer).not.toBeNull()
			expect(flashcardInDb?.answer?.text).toBe('Ready to face danger or pain; showing courage.')
			expect(flashcardInDb?.answer?.phonetic).toBe('/breɪv/')
			expect(flashcardInDb?.answer?.isPersonal).toBe(true)
		})

		it('should return an error state if the user is not authenticated', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue(null)

			const formData = new FormData()
			const result = await createFlashcard(initialState, formData)

			expect(result.status).toBe('error')
			expect(result.message).toBe('An unexpected error occurred while creating the flashcard.')
			expect(console.error).toHaveBeenCalledWith(
				'Error creating flashcard:',
				expect.objectContaining({message: 'User not authenticated'}),
			)

			const count = await prisma.flashcard.count()
			expect(count).toBe(0)
		})

		it('should return an error state if the user has no active learning profile', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				activeLearningProfile: null,
				activeLearningProfileId: null,
			})

			const formData = new FormData()
			const result = await createFlashcard(initialState, formData)

			expect(result.status).toBe('error')
			expect(result.message).toBe('An unexpected error occurred while creating the flashcard.')
			expect(console.error).toHaveBeenCalledWith(
				'Error creating flashcard:',
				expect.objectContaining({message: 'No active learning profile found.'}),
			)

			const count = await prisma.flashcard.count()
			expect(count).toBe(0)
		})

		it('should return validation error state if form data is invalid', async () => {
			const validationErrorState = {
				status: 'error',
				message: 'Validation failed.',
				errors: {
					question: ['Question is required.'],
				},
			}

			;(parseAndValidateFlashcard as jest.Mock).mockReturnValue({
				success: false,
				errorState: validationErrorState,
			})

			const formData = new FormData()
			const result = await createFlashcard(initialState, formData)

			expect(result).toEqual(validationErrorState)

			const count = await prisma.flashcard.count()
			expect(count).toBe(0)
		})

		it('should catch and handle unexpected database errors gracefully', async () => {
			// Force a Prisma error by passing an invalid learningProfileId
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				activeLearningProfile: context.profile,
				activeLearningProfileId: 'non-existent-id',
			})

			const formData = new FormData()
			const result = await createFlashcard(initialState, formData)

			expect(result.status).toBe('error')
			expect(result.message).toBe('An unexpected error occurred while creating the flashcard.')
			expect(console.error).toHaveBeenCalledWith('Error creating flashcard:', expect.any(Error))
		})
	})

	describe('updateFlashcard', () => {
		it('should successfully update a flashcard and its existing PERSONAL answer', async () => {
			// seed initial flashcard
			const existingFlashcard = await prisma.flashcard.create({
				data: {
					question: 'Old Question',
					learningProfile: {
						connect: {
							id: context.profile.id,
						},
					},
					answer: {
						create: {
							text: 'Old Answer',
							isPersonal: true,
						},
					},
				},
			})

			;(parseAndValidateFlashcard as jest.Mock).mockReturnValue({
				success: true,
				data: {
					question: 'Updated Question',
					answer: 'Updated Answer',
					note: 'Updated note',
					synonyms: ['new synonym'],
					examples: ['New example.'],
					phonetic: '/ʌpˈdeɪtɪd/',
				},
			})

			const formData = new FormData()
			const result = await updateFlashcard(existingFlashcard.id, initialState, formData)

			expect(result.status).toBe('success')
			expect(result.message).toBe('Flashcard updated successfully.')

			const updatedFlashcard = await prisma.flashcard.findUnique({
				where: {id: existingFlashcard.id},
				include: {answer: true},
			})

			expect(updatedFlashcard?.question).toBe('Updated Question')
			expect(updatedFlashcard?.note).toBe('Updated note')
			expect(updatedFlashcard?.synonyms).toEqual(['new synonym'])
			expect(updatedFlashcard?.answer?.text).toBe('Updated Answer')
			expect(updatedFlashcard?.answer?.phonetic).toBe('/ʌpˈdeɪtɪd/')
			expect(updatedFlashcard?.answer?.isPersonal).toBe(true)
		})

		it('should update common data but keep the existing PUBLIC answer as public if the answer has not changed', async () => {
			const existingFlashcard = await prisma.flashcard.create({
				data: {
					question: 'Old Question',
					learningProfile: {
						connect: {
							id: context.profile.id,
						},
					},
					answer: {
						create: {
							text: 'Public Answer',
							isPersonal: false,
						},
					},
				},
			})

			// answer is the same as the existing one, but question is updated
			;(parseAndValidateFlashcard as jest.Mock).mockReturnValue({
				success: true,
				data: {
					question: 'Updated Question',
					answer: 'Public Answer', // unchanged!
					note: 'New note',
					phonetic: null,
				},
			})

			const formData = new FormData()
			const result = await updateFlashcard(existingFlashcard.id, initialState, formData)

			expect(result.status).toBe('success')

			const updatedFlashcard = await prisma.flashcard.findUnique({
				where: {id: existingFlashcard.id},
				include: {answer: true},
			})

			// verify that common data was updated
			expect(updatedFlashcard?.question).toBe('Updated Question')
			expect(updatedFlashcard?.note).toBe('New note')

			// verify that the answer remained untouched and is still public
			expect(updatedFlashcard?.answer?.text).toBe('Public Answer')
			expect(updatedFlashcard?.answer?.isPersonal).toBe(false)
		})

		it('should create a NEW PERSONAL answer if the existing one is NOT PERSONAL and is changed', async () => {
			const existingFlashcard = await prisma.flashcard.create({
				data: {
					question: 'Public Question',
					learningProfile: {
						connect: {
							id: context.profile.id,
						},
					},
					answer: {
						create: {
							text: 'Public Answer',
							isPersonal: false,
						},
					},
				},
			})

			;(parseAndValidateFlashcard as jest.Mock).mockReturnValue({
				success: true,
				data: {
					question: 'Public Question',
					answer: 'My New Personal Answer',
					phonetic: null,
				},
			})

			const formData = new FormData()
			const result = await updateFlashcard(existingFlashcard.id, initialState, formData)

			expect(result.status).toBe('success')

			const updatedFlashcard = await prisma.flashcard.findUnique({
				where: {id: existingFlashcard.id},
				include: {answer: true},
			})

			expect(updatedFlashcard?.answer?.text).toBe('My New Personal Answer')
			expect(updatedFlashcard?.answer?.isPersonal).toBe(true)
		})

		it('should return an error state if the user is not authenticated', async () => {
			const existingFlashcard = await prisma.flashcard.create({
				data: {
					question: 'Brave',
					learningProfile: {
						connect: {
							id: context.profile.id,
						},
					},
					answer: {
						create: {
							text: 'Ready to face danger or pain; showing courage.',
						},
					},
				},
			})

			;(getCurrentUser as jest.Mock).mockResolvedValue(null)

			const formData = new FormData()
			const result = await updateFlashcard(existingFlashcard.id, initialState, formData)

			expect(result.status).toBe('error')
			expect(result.message).toBe('Failed to update flashcard.')
			expect(console.error).toHaveBeenCalledWith(
				'Error updating flashcard:',
				expect.objectContaining({message: 'User not authenticated'}),
			)
		})

		it('should return an error state if the user has no active learning profile', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				activeLearningProfile: null,
				activeLearningProfileId: null,
			})

			const formData = new FormData()
			const result = await updateFlashcard(1, initialState, formData)

			expect(result.status).toBe('error')
			expect(result.message).toBe('Failed to update flashcard.')
			expect(console.error).toHaveBeenCalledWith(
				'Error updating flashcard:',
				expect.objectContaining({message: 'No active learning profile found.'}),
			)

			const count = await prisma.flashcard.count()
			expect(count).toBe(0)
		})

		it('should return validation error state if form data is invalid', async () => {
			const validationErrorState = {
				status: 'error',
				message: 'Validation failed.',
				errors: {
					answer: ['Answer is required.'],
				},
			}

			;(parseAndValidateFlashcard as jest.Mock).mockReturnValue({
				success: false,
				errorState: validationErrorState,
			})

			const formData = new FormData()
			const result = await updateFlashcard(1, initialState, formData)

			expect(result).toEqual(validationErrorState)
		})

		it('should return an error if the flashcard does not exist', async () => {
			;(parseAndValidateFlashcard as jest.Mock).mockReturnValue({
				success: true,
				data: {question: 'Valid', answer: 'Valid'},
			})

			const nonExistentId = 9999
			const formData = new FormData()
			const result = await updateFlashcard(nonExistentId, initialState, formData)

			expect(result.status).toBe('error')
			expect(result.message).toBe('Flashcard to update was not found.')
		})

		it('should return an error if the flashcard does not belong to the user', async () => {
			// flashcard that belongs to the test user
			const existingFlashcard = await prisma.flashcard.create({
				data: {
					question: 'Brave',
					learningProfile: {
						connect: {
							id: context.profile.id,
						},
					},
					answer: {
						create: {
							text: 'Ready to face danger or pain; showing courage.',
						},
					},
				},
			})

			// different activeLearningProfileId "runs" the test (not the test user's profile)
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				activeLearningProfile: {
					data: {
						userId: 9999, // different user
						profileName: 'Other Profile',
					},
				},
				activeLearningProfileId: 9999,
			})
			;(parseAndValidateFlashcard as jest.Mock).mockReturnValue({
				success: true,
				data: {
					answer: 'Updated Answer',
				},
			})

			const formData = new FormData()
			const result = await updateFlashcard(existingFlashcard.id, initialState, formData)

			expect(result.status).toBe('error')
			expect(result.message).toBe('Flashcard to update was not found.')

			// verify the flashcard was NOT updated in the database
			const flashcardInDb = await prisma.flashcard.findUnique({
				where: {id: existingFlashcard.id},
			})
			expect(flashcardInDb?.question).toBe('Brave')
		})

		it('should catch and handle unexpected database errors gracefully', async () => {
			const existingFlashcard = await prisma.flashcard.create({
				data: {
					question: 'Question',
					learningProfile: {
						connect: {
							id: context.profile.id,
						},
					},
					answer: {
						create: {text: 'Answer', isPersonal: true},
					},
				},
			})

			;(parseAndValidateFlashcard as jest.Mock).mockReturnValue({
				success: true,
				data: {question: 'Valid', answer: 'Valid'},
			})

			jest.spyOn(prisma.flashcard, 'update').mockRejectedValueOnce(new Error('Simulated DB error'))

			const formData = new FormData()
			const result = await updateFlashcard(existingFlashcard.id, initialState, formData)

			expect(result.status).toBe('error')
			expect(result.message).toBe('Failed to update flashcard.')
			expect(console.error).toHaveBeenCalledWith(
				'Error updating flashcard:',
				expect.objectContaining({message: 'Simulated DB error'}),
			)
		})
	})

	describe('deleteFlashcard', () => {
		it('should successfully delete a flashcard', async () => {
			// seed flashcard to delete
			const existingFlashcard = await prisma.flashcard.create({
				data: {
					question: 'Question to delete',
					learningProfile: {
						connect: {
							id: context.profile.id,
						},
					},
					answer: {
						create: {
							text: 'Answer to delete',
							isPersonal: true,
						},
					},
				},
			})

			const result = await deleteFlashcard(existingFlashcard.id)

			expect(result.success).toBe(true)
			expect(result.error).toBeUndefined()
			expect(console.error).not.toHaveBeenCalled()

			// verify it was removed from database
			const flashcardInDb = await prisma.flashcard.findUnique({
				where: {id: existingFlashcard.id},
			})

			expect(flashcardInDb).toBeNull()
		})

		it('should return an error if the user is not authenticated', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue(null)

			const result = await deleteFlashcard(1)

			expect(result.success).toBe(false)
			expect(result.error).toBe('Failed to delete flashcard.')
			expect(console.error).toHaveBeenCalledWith(
				'Error deleting flashcard:',
				expect.objectContaining({message: 'User not authenticated'}),
			)
		})

		it('should return an error if the user has no active learning profile', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				activeLearningProfile: null,
				activeLearningProfileId: null,
			})

			const result = await deleteFlashcard(1)

			expect(result.success).toBe(false)
			expect(result.error).toBe('Failed to delete flashcard.')
			expect(console.error).toHaveBeenCalledWith(
				'Error deleting flashcard:',
				expect.objectContaining({message: 'No active learning profile found.'}),
			)
		})

		it('should return an error if the flashcard does not exist', async () => {
			const nonExistentId = 9999

			const result = await deleteFlashcard(nonExistentId)

			expect(result.success).toBe(false)
			expect(result.error).toBe('Failed to delete flashcard.')
			// Prisma throws a RecordNotFound exception when trying to delete a non-existent record
			expect(console.error).toHaveBeenCalled()
		})

		it('should return an error if the flashcard does not belong to the user', async () => {
			// flashcard that belongs to the test user
			const existingFlashcard = await prisma.flashcard.create({
				data: {
					question: 'Not my flashcard',
					learningProfile: {
						connect: {
							id: context.profile.id,
						},
					},
					answer: {
						create: {
							text: 'Some answer',
							isPersonal: true,
						},
					},
				},
			})

			// different activeLearningProfileId "runs" the test (not the test user's profile)
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				activeLearningProfile: {
					data: {
						userId: 9999, // different user
						profileName: 'Other Profile',
					},
				},
				activeLearningProfileId: 9999,
			})

			const result = await deleteFlashcard(existingFlashcard.id)

			expect(result.success).toBe(false)
			expect(result.error).toBe('Failed to delete flashcard.')
			expect(console.error).toHaveBeenCalled()

			// verify the flashcard was NOT deleted from the database
			const flashcardInDb = await prisma.flashcard.findUnique({
				where: {id: existingFlashcard.id},
			})

			expect(flashcardInDb).not.toBeNull()
		})

		it('should catch and handle unexpected database errors gracefully', async () => {
			jest.spyOn(prisma.flashcard, 'delete').mockRejectedValueOnce(new Error('Simulated DB error'))

			const result = await deleteFlashcard(1)

			expect(result.success).toBe(false)
			expect(result.error).toBe('Failed to delete flashcard.')
			expect(console.error).toHaveBeenCalledWith(
				'Error deleting flashcard:',
				expect.objectContaining({message: 'Simulated DB error'}),
			)
		})
	})
})
