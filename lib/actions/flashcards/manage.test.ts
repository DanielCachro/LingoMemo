/**
 * @jest-environment node
 */

import {prisma} from '@/prisma/client'
import {setupTestDatabase} from '@/tests/mocks/db'
import {FlashcardActionState} from '@/types/flashcards'
import {bulkDeleteFlashcards, createFlashcard, deleteFlashcard, updateFlashcard} from './manage'

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
		it('should successfully delete a flashcard and its associated personal answer (isPersonal = true)', async () => {
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
				include: {
					answer: true,
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

			// verify the associated personal answer was also removed
			const answerInDb = await prisma.answer.findUnique({
				where: {id: existingFlashcard.answer.id},
			})
			expect(answerInDb).toBeNull()
		})

		it('should delete the flashcard but keep the associated answer if it is NOT personal (isPersonal = false)', async () => {
			// seed flashcard with a public answer
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
							text: 'Public Answer',
							isPersonal: false,
						},
					},
				},
				include: {
					answer: true,
				},
			})

			const result = await deleteFlashcard(existingFlashcard.id)

			expect(result.success).toBe(true)
			expect(result.error).toBeUndefined()

			// verify flashcard was removed from database
			const flashcardInDb = await prisma.flashcard.findUnique({
				where: {id: existingFlashcard.id},
			})
			expect(flashcardInDb).toBeNull()

			// verify the associated PUBLIC answer was NOT removed
			const answerInDb = await prisma.answer.findUnique({
				where: {id: existingFlashcard.answer.id},
			})
			expect(answerInDb).not.toBeNull()
			expect(answerInDb?.text).toBe('Public Answer')
			expect(answerInDb?.isPersonal).toBe(false)
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
			jest.spyOn(prisma.flashcard, 'findUnique').mockRejectedValueOnce(new Error('Simulated DB error'))

			const result = await deleteFlashcard(1)

			expect(result.success).toBe(false)
			expect(result.error).toBe('Failed to delete flashcard.')
			expect(console.error).toHaveBeenCalledWith(
				'Error deleting flashcard:',
				expect.objectContaining({message: 'Simulated DB error'}),
			)
		})
	})

	describe('bulkDeleteFlashcards', () => {
		it('should successfully delete multiple flashcards and their associated personal answers (isPersonal = true)', async () => {
			// seed multiple flashcards
			const flashcard1 = await prisma.flashcard.create({
				data: {
					question: 'Question 1',
					learningProfile: {connect: {id: context.profile.id}},
					answer: {create: {text: 'Answer 1', isPersonal: true}},
				},
				include: {answer: true},
			})
			const flashcard2 = await prisma.flashcard.create({
				data: {
					question: 'Question 2',
					learningProfile: {connect: {id: context.profile.id}},
					answer: {create: {text: 'Answer 2', isPersonal: true}},
				},
				include: {answer: true},
			})
			const flashcard3 = await prisma.flashcard.create({
				data: {
					question: 'Question 3 (should not be deleted)',
					learningProfile: {connect: {id: context.profile.id}},
					answer: {create: {text: 'Answer 3', isPersonal: true}},
				},
				include: {answer: true},
			})

			const result = await bulkDeleteFlashcards([flashcard1.id, flashcard2.id])

			expect(result.success).toBe(true)
			expect(result.error).toBeUndefined()
			expect(console.error).not.toHaveBeenCalled()

			// verify flashcards were removed from the database
			const remainingFlashcards = await prisma.flashcard.findMany({
				where: {
					id: {in: [flashcard1.id, flashcard2.id, flashcard3.id]},
				},
			})

			// only flashcard3 should remain
			expect(remainingFlashcards).toHaveLength(1)
			expect(remainingFlashcards[0].id).toBe(flashcard3.id)

			// verify the associated personal answers were also removed
			const remainingAnswers = await prisma.answer.findMany({
				where: {
					id: {in: [flashcard1.answer.id, flashcard2.answer.id, flashcard3.answer.id]},
				},
			})

			// only answer3 should remain
			expect(remainingAnswers).toHaveLength(1)
			expect(remainingAnswers[0].id).toBe(flashcard3.answer.id)
		})

		it('should delete flashcards but keep the associated answers if they are NOT personal (isPersonal = false)', async () => {
			// seed multiple flashcards with public answers
			const flashcard1 = await prisma.flashcard.create({
				data: {
					question: 'Question 1',
					learningProfile: {connect: {id: context.profile.id}},
					answer: {create: {text: 'Public Answer 1', isPersonal: false}},
				},
				include: {answer: true},
			})
			const flashcard2 = await prisma.flashcard.create({
				data: {
					question: 'Question 2',
					learningProfile: {connect: {id: context.profile.id}},
					answer: {create: {text: 'Public Answer 2', isPersonal: false}},
				},
				include: {answer: true},
			})

			const result = await bulkDeleteFlashcards([flashcard1.id, flashcard2.id])

			expect(result.success).toBe(true)
			expect(result.error).toBeUndefined()

			// verify flashcards were removed
			const remainingFlashcards = await prisma.flashcard.findMany({
				where: {
					id: {in: [flashcard1.id, flashcard2.id]},
				},
			})
			expect(remainingFlashcards).toHaveLength(0)

			// verify the associated PUBLIC answers were NOT removed
			const remainingAnswers = await prisma.answer.findMany({
				where: {
					id: {in: [flashcard1.answer.id, flashcard2.answer.id]},
				},
			})

			// both public answers should still exist in the database
			expect(remainingAnswers).toHaveLength(2)
		})

		it('should return an error if the user is not authenticated', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue(null)

			const result = await bulkDeleteFlashcards([1, 2, 3])

			expect(result.success).toBe(false)
			expect(result.error).toBe('Failed to delete flashcards.')
			expect(console.error).toHaveBeenCalledWith(
				'Error deleting flashcards in bulk:',
				expect.objectContaining({message: 'User not authenticated'}),
			)
		})

		it('should return an error if the user has no active learning profile', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				activeLearningProfile: null,
				activeLearningProfileId: null,
			})

			const result = await bulkDeleteFlashcards([1, 2, 3])

			expect(result.success).toBe(false)
			expect(result.error).toBe('Failed to delete flashcards.')
			expect(console.error).toHaveBeenCalledWith(
				'Error deleting flashcards in bulk:',
				expect.objectContaining({message: 'No active learning profile found.'}),
			)
		})

		it('should not delete flashcards that do not belong to the user (silently skip them)', async () => {
			// seed a flashcard that belongs to the test user
			const existingFlashcard = await prisma.flashcard.create({
				data: {
					question: 'Not my flashcard',
					learningProfile: {connect: {id: context.profile.id}},
					answer: {create: {text: 'Some answer', isPersonal: true}},
				},
			})

			// mock the current user to simulate someone else
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

			const result = await bulkDeleteFlashcards([existingFlashcard.id])

			// Prisma's deleteMany doesn't throw if it deletes 0 records, it just returns { count: 0 }.
			// So the function will return success: true, but the record should NOT be deleted.
			expect(result.success).toBe(true)

			// verify the flashcard was NOT deleted from the database
			const flashcardInDb = await prisma.flashcard.findUnique({
				where: {id: existingFlashcard.id},
			})

			expect(flashcardInDb).not.toBeNull()
		})

		it('should catch and handle unexpected database errors gracefully', async () => {
			jest.spyOn(prisma.flashcard, 'findMany').mockRejectedValueOnce(new Error('Simulated DB error'))

			const result = await bulkDeleteFlashcards([1, 2, 3])

			expect(result.success).toBe(false)
			expect(result.error).toBe('Failed to delete flashcards.')
			expect(console.error).toHaveBeenCalledWith(
				'Error deleting flashcards in bulk:',
				expect.objectContaining({message: 'Simulated DB error'}),
			)
		})
	})
})
