/**
 * @jest-environment node
 */

import {getCurrentUser} from '@/lib/queries/user'
import {prisma} from '@/prisma/client'
import {setupTestDatabase} from '@/tests/mocks/db'
import {FlashcardResponseQuality} from '@/types/study'
import {updateFlashcard} from './study'

jest.mock('@/lib/queries/user', () => ({
	getCurrentUser: jest.fn(),
}))

describe('Spaced Repetition (study) Server Actions', () => {
	// Suppress console.error output during tests to keep the test output clean
	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {})
	})

	afterAll(() => {
		jest.restoreAllMocks()
	})

	const context = setupTestDatabase()

	beforeEach(() => {
		// already in setupTestDatabase, but just to be explicit here
		jest.clearAllMocks()

		// set up default happy-path mock before each test
		;(getCurrentUser as jest.Mock).mockResolvedValue({
			...context.user,
			activeLearningProfileId: context.profile.id,
			activeLearningProfile: context.profile,
		})
	})

	describe('updateFlashcard', () => {
		let transactionSpy: jest.SpyInstance

		beforeEach(() => {
			// spy on the $transaction method of the prisma client to monitor its calls
			transactionSpy = jest.spyOn(prisma, '$transaction')
		})

		afterEach(() => {
			// clear the spy after each test to avoid interference between tests
			transactionSpy.mockClear()
		})

		it('should throw an error if the quality value is invalid', async () => {
			const invalidQuality = 4 as FlashcardResponseQuality

			await expect(updateFlashcard(1, invalidQuality)).rejects.toThrow('Invalid quality value.')
			expect(transactionSpy).not.toHaveBeenCalled()
		})

		it('should throw an error if user is not authenticated', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue(null)

			await expect(updateFlashcard(1, 5)).rejects.toThrow('User not authenticated.')
			expect(transactionSpy).not.toHaveBeenCalled()
		})

		it('should throw an error if user has no active learning profile', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				activeLearningProfileId: null,
				activeLearningProfile: null,
			})

			await expect(updateFlashcard(1, 5)).rejects.toThrow('No active learning profile found.')
			expect(transactionSpy).not.toHaveBeenCalled()
		})

		it('should throw an error if flashcard is not found or does not belong to profile', async () => {
			const nonExistentId = 9999

			await expect(updateFlashcard(nonExistentId, 5)).rejects.toThrow('Flashcard not found or access denied.')
			expect(transactionSpy).not.toHaveBeenCalled()
		})

		it('should set interval to 6 and increase eFactor when quality is 5 and current interval < 6', async () => {
			const existingFlashcard = await prisma.flashcard.create({
				data: {
					question: 'Test Q5',
					interval: 1,
					eFactor: 2.0,
					learningProfile: {connect: {id: context.profile.id}},
					answer: {create: {text: 'dummy answer', isPersonal: true}},
				},
			})

			const result = await updateFlashcard(existingFlashcard.id, 5)

			expect(result).toEqual({updated: true, alreadyReviewed: false})

			const updated = await prisma.flashcard.findUnique({where: {id: existingFlashcard.id}})

			// For q=5: eFactor += 0.1 - (0) = 0.1 -> 2.1
			expect(updated?.interval).toBe(6)
			expect(updated?.eFactor).toBeCloseTo(2.1)

			const logsCount = await prisma.flashcardReviewLog.count({
				where: {flashcardId: existingFlashcard.id},
			})
			expect(logsCount).toBe(1)
		})

		it('should calculate new interval based on eFactor and decrease eFactor when quality is 3', async () => {
			const existingFlashcard = await prisma.flashcard.create({
				data: {
					question: 'Test Q3',
					interval: 10,
					eFactor: 2.0,
					learningProfile: {connect: {id: context.profile.id}},
					answer: {create: {text: 'dummy answer', isPersonal: true}},
				},
			})

			const result = await updateFlashcard(existingFlashcard.id, 3)

			expect(result.updated).toBe(true)

			const updated = await prisma.flashcard.findUnique({where: {id: existingFlashcard.id}})

			// interval = round(10 * 2.0) = 20
			expect(updated?.interval).toBe(20)

			// For q=3: eFactor math -> 2.0 + (0.1 - 2 * (0.08 + 2 * 0.02)) = 2.0 + (0.1 - 0.24) = 1.86
			expect(updated?.eFactor).toBeCloseTo(1.86)
		})

		it('should reset interval to 0 and keep eFactor unchanged when quality is 0', async () => {
			const existingFlashcard = await prisma.flashcard.create({
				data: {
					question: 'Test Q0',
					interval: 15,
					eFactor: 2.2,
					learningProfile: {connect: {id: context.profile.id}},
					answer: {create: {text: 'dummy answer', isPersonal: true}},
				},
			})

			const result = await updateFlashcard(existingFlashcard.id, 0)

			expect(result.updated).toBe(true)

			const updated = await prisma.flashcard.findUnique({where: {id: existingFlashcard.id}})

			// Interval resets, eFactor stays the same for q < 3
			expect(updated?.interval).toBe(0)
			expect(updated?.eFactor).toBe(2.2)

			// Since newInterval === 0, it should NOT create a FlashcardReviewLog
			const logsCount = await prisma.flashcardReviewLog.count({
				where: {flashcardId: existingFlashcard.id},
			})
			expect(logsCount).toBe(0)
		})

		it('should respect the maximum (2.5) and minimum (1.3) boundaries for eFactor', async () => {
			// Test MAX boundary
			const maxFlashcard = await prisma.flashcard.create({
				data: {
					question: 'Max Bound',
					interval: 10,
					eFactor: 2.5,
					learningProfile: {connect: {id: context.profile.id}},
					answer: {create: {text: 'dummy answer', isPersonal: true}},
				},
			})

			await updateFlashcard(maxFlashcard.id, 5) // would normally increase

			const updatedMax = await prisma.flashcard.findUnique({where: {id: maxFlashcard.id}})
			expect(updatedMax?.eFactor).toBe(2.5) // capped at 2.5

			// Test MIN boundary
			const minFlashcard = await prisma.flashcard.create({
				data: {
					question: 'Min Bound',
					interval: 10,
					eFactor: 1.3,
					learningProfile: {connect: {id: context.profile.id}},
					answer: {create: {text: 'dummy answer', isPersonal: true}},
				},
			})

			await updateFlashcard(minFlashcard.id, 3) // would normally decrease

			const updatedMin = await prisma.flashcard.findUnique({where: {id: minFlashcard.id}})
			expect(updatedMin?.eFactor).toBe(1.3) // bottomed at 1.3
		})

		it('should return alreadyReviewed: true and NOT throw on P2002 unique constraint violation when attempting to review same flashcard twice in one day', async () => {
			const existingFlashcard = await prisma.flashcard.create({
				data: {
					question: 'P2002 Duplicate Log Test',
					interval: 1,
					eFactor: 2.0,
					learningProfile: {connect: {id: context.profile.id}},
					answer: {create: {text: 'dummy answer', isPersonal: true}},
				},
			})

			// First review - should succeed
			const firstResult = await updateFlashcard(existingFlashcard.id, 5)
			expect(firstResult).toEqual({updated: true, alreadyReviewed: false})

			// Second review immediately after - hits unique constraint on [flashcardId, reviewedAt]
			const secondResult = await updateFlashcard(existingFlashcard.id, 5)
			expect(secondResult).toEqual({updated: false, alreadyReviewed: true})
		})

		it('should catch generic database errors and throw a safe error message', async () => {
			const existingFlashcard = await prisma.flashcard.create({
				data: {
					question: 'Generic DB Error Test',
					interval: 1,
					eFactor: 2.0,
					learningProfile: {connect: {id: context.profile.id}},
					answer: {create: {text: 'dummy answer', isPersonal: true}},
				},
			})

			jest.spyOn(prisma, '$transaction').mockRejectedValueOnce(new Error('Simulated generic DB error'))

			await expect(updateFlashcard(existingFlashcard.id, 5)).rejects.toThrow('Failed to update flashcard')

			expect(console.error).toHaveBeenCalledWith(
				'Error updating flashcard:',
				expect.objectContaining({message: 'Simulated generic DB error'}),
			)
		})
	})
})
