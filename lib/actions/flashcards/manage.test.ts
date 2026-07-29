/**
 * @jest-environment node
 */

import {prisma} from '@/prisma/client'
import {setupTestDatabase} from '@/tests/mocks/db'
import {FlashcardActionState} from '@/types/flashcards'
import {createFlashcard} from './manage'

import {getCurrentUser} from '@/lib/queries/user'
import {parseAndValidateFlashcard} from './manageUtils'

// Mock external dependencies
jest.mock('@/lib/queries/user', () => ({
	getCurrentUser: jest.fn(),
}))

jest.mock('./manageUtils', () => ({
	parseAndValidateFlashcard: jest.fn(),
}))

describe('serverAction/createFlashcard', () => {
	// Suppress expected console.errors during tests for cleaner output
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
