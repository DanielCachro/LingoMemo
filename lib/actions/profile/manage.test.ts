/**
 * @jest-environment node
 */

import {setActiveLearningProfile} from '@/lib/actions/user'
import {SourceLanguages, TargetLanguages} from '@/lib/generated/prisma/browser'
import {getCurrentUser} from '@/lib/queries/user'
import {prisma} from '@/prisma/client'
import {setupTestDatabase} from '@/tests/mocks/db'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'
import {createLearningProfile, deleteLearningProfile} from './manage'

// Mock external dependencies
jest.mock('@/lib/queries/user', () => ({
	getCurrentUser: jest.fn(),
}))

jest.mock('@/lib/actions/user', () => ({
	setActiveLearningProfile: jest.fn(),
}))

jest.mock('next/cache', () => ({
	revalidatePath: jest.fn(),
}))

jest.mock('next/navigation', () => ({
	redirect: jest.fn(),
}))

describe('Learning Profile Server Actions', () => {
	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {})
	})

	afterAll(() => {
		jest.restoreAllMocks()
	})

	const context = setupTestDatabase()

	beforeEach(() => {
		jest.clearAllMocks()

		// Default happy-path mock for the current user
		;(getCurrentUser as jest.Mock).mockResolvedValue({
			...context.user,
			activeLearningProfile: context.profile,
			activeLearningProfileId: context.profile.id,
			// learningProfiles array is required for deleteLearningProfile logic
			learningProfiles: [context.profile],
		})
	})

	describe('deleteLearningProfile', () => {
		it('should return an error if the user is not authenticated', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue(null)

			const result = await deleteLearningProfile(1)

			expect(result.success).toBe(false)
			expect(result.error).toBe('User not authenticated.')
		})

		it('should return an error if the user has no active learning profile', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				activeLearningProfile: null,
				activeLearningProfileId: null,
			})

			const result = await deleteLearningProfile(1)

			expect(result.success).toBe(false)
			expect(result.error).toBe('No active learning profile found.')
		})

		it('should return an error if trying to delete the only existing learning profile', async () => {
			// Context profile is the only one in the mocked learningProfiles array
			const result = await deleteLearningProfile(context.profile.id)

			expect(result.success).toBe(false)
			expect(result.error).toBe('Cannot delete the only learning profile.')
		})

		it('should return an error if active profile is being deleted but no alternative is found (edge case)', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				activeLearningProfile: context.profile,
				activeLearningProfileId: context.profile.id,
				learningProfiles: [],
			})

			const result = await deleteLearningProfile(context.profile.id)

			expect(result.success).toBe(false)
			expect(result.error).toBe('No alternative learning profile found to set as active.')
		})

		it('should successfully delete a NON-active learning profile', async () => {
			const profileToDelete = await prisma.learningProfile.create({
				data: {
					userId: context.user.id,
					profileName: 'Secondary Profile',
				},
			})

			// Mock user having multiple profiles
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				activeLearningProfile: context.profile,
				activeLearningProfileId: context.profile.id, // Trying to delete profileToDelete, so active profile stays intact
				learningProfiles: [context.profile, profileToDelete],
			})

			const result = await deleteLearningProfile(profileToDelete.id)

			expect(result.success).toBe(true)
			expect(setActiveLearningProfile).not.toHaveBeenCalled()

			const checkDb = await prisma.learningProfile.findUnique({where: {id: profileToDelete.id}})
			expect(checkDb).toBeNull()
		})

		it('should successfully delete the ACTIVE profile and set another profile as active', async () => {
			const anotherProfile = await prisma.learningProfile.create({
				data: {
					userId: context.user.id,
					profileName: 'Fallback Profile',
				},
			})

			// Trying to delete the currently active profile
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				activeLearningProfile: context.profile,
				activeLearningProfileId: context.profile.id,
				learningProfiles: [context.profile, anotherProfile],
			})

			const result = await deleteLearningProfile(context.profile.id)

			expect(result.success).toBe(true)

			// Verify that the fallback mechanism kicked in
			expect(setActiveLearningProfile).toHaveBeenCalledWith(
				anotherProfile.id,
				expect.objectContaining({
					revalidateAfter: true,
					pathToRevalidate: '/home',
					type: 'layout',
				}),
			)

			const checkDb = await prisma.learningProfile.findUnique({where: {id: context.profile.id}})
			expect(checkDb).toBeNull()
		})

		it('should catch database errors and return a generic error message', async () => {
			const profileToDelete = await prisma.learningProfile.create({
				data: {userId: context.user.id, profileName: 'Error Profile'},
			})

			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				activeLearningProfile: context.profile,
				activeLearningProfileId: context.profile.id,
				learningProfiles: [context.profile, profileToDelete],
			})

			jest.spyOn(prisma.learningProfile, 'delete').mockRejectedValueOnce(new Error('Simulated DB error'))

			const result = await deleteLearningProfile(profileToDelete.id)

			expect(result.success).toBe(false)
			expect(result.error).toBe('Failed to delete profile. Please try again.')
			expect(console.error).toHaveBeenCalledWith('Error deleting profile:', expect.any(Error))
		})

		it('should call revalidatePath if revalidateAfter is true in config', async () => {
			const profileToDelete = await prisma.learningProfile.create({
				data: {userId: context.user.id, profileName: 'To Be Revalidated'},
			})

			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				activeLearningProfile: context.profile,
				activeLearningProfileId: context.profile.id,
				learningProfiles: [context.profile, profileToDelete],
			})

			await deleteLearningProfile(profileToDelete.id, {
				revalidateAfter: true,
				pathToRevalidate: '/dashboard',
				type: 'page',
			})

			expect(revalidatePath).toHaveBeenCalledWith('/dashboard')
		})
	})

	describe('createLearningProfile', () => {
		const validSourceLang = SourceLanguages.en
		const validTargetLang = TargetLanguages.en

		it('should return an error if the user is not authenticated', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue(null)

			const result = await createLearningProfile({
				type: 'self-study',
				profileName: 'My Profile',
			})

			expect(result.success).toBe(false)
			expect(result.error).toBe('User not authenticated.')
		})

		it('should successfully create a self-study profile', async () => {
			const result = await createLearningProfile({
				type: 'self-study',
				profileName: 'Microeconomics',
			})

			expect(result.success).toBe(true)

			const profileInDb = await prisma.learningProfile.findFirst({
				where: {userId: context.user.id, profileName: 'Microeconomics'},
			})

			expect(profileInDb).not.toBeNull()
			expect(profileInDb?.profileName).toBe('Microeconomics')
		})

		it('should successfully create a language profile', async () => {
			const result = await createLearningProfile({
				type: 'language',
				sourceLang: validSourceLang,
				targetLang: validTargetLang,
			})

			expect(result.success).toBe(true)

			const profileInDb = await prisma.learningProfile.findFirst({
				where: {userId: context.user.id, sourceLang: validSourceLang, targetLang: validTargetLang},
			})

			expect(profileInDb).not.toBeNull()
			expect(profileInDb?.sourceLang).toBe(validSourceLang)
			expect(profileInDb?.targetLang).toBe(validTargetLang)
		})

		it('should update user to set active profile if they currently do not have one', async () => {
			// User authenticated but has no active profile
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				activeLearningProfileId: null,
			})

			const result = await createLearningProfile({
				type: 'self-study',
				profileName: 'First Profile',
			})

			expect(result.success).toBe(true)

			const updatedUser = await prisma.user.findUnique({where: {id: context.user.id}})
			const createdProfile = await prisma.learningProfile.findFirst({where: {profileName: 'First Profile'}})

			expect(updatedUser?.activeLearningProfileId).toBe(createdProfile?.id)
		})

		it('should return manual validation errors if language fields are missing', async () => {
			// @ts-expect-error - intentionally omitting fields to test manual validation behavior
			const result = await createLearningProfile({
				type: 'language',
			})

			expect(result.success).toBe(false)
			expect(result.errors).toContainEqual({message: 'Source language is required.', location: 'sourceLang'})
			expect(result.errors).toContainEqual({message: 'Target language is required.', location: 'targetLang'})
		})

		it('should return Zod validation errors if language enums are invalid', async () => {
			const result = await createLearningProfile({
				type: 'language',
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				sourceLang: 'INVALID_LANG' as any,
				targetLang: validTargetLang,
			})

			expect(result.success).toBe(false)
			expect(result.errors).toContainEqual({
				message: 'Validation error, at least one of the selected languages is incorrect.',
				location: 'form',
			})
		})

		it('should return a manual validation error if self-study profile name is missing', async () => {
			const result = await createLearningProfile({
				type: 'self-study',
				profileName: '', // Pusty string powoduje błąd walidacji ręcznej "is required"
			})

			expect(result.success).toBe(false)
			expect(result.errors).toContainEqual({message: 'Profile name is required.', location: 'profileName'})
		})

		it('should return Zod validation errors if self-study profile name is too short', async () => {
			const result = await createLearningProfile({
				type: 'self-study',
				profileName: 'A', // min 2 required
			})

			expect(result.success).toBe(false)
			expect(result.errors).toContainEqual({
				message: 'Please enter a valid name between 2 and 50 characters.',
				location: 'profileName',
			})
		})

		it('should handle P2002 unique constraint violation and return a user-friendly error when attempting to create a duplicate profile', async () => {
			// create a profile first to ensure a duplicate scenario, should succeed
			const firstResult = await createLearningProfile({
				type: 'self-study',
				profileName: 'Duplicate Profile',
			})
			expect(firstResult.success).toBe(true)

			// attempt to create the same profile again, should fail with a P2002 error
			const secondResult = await createLearningProfile({
				type: 'self-study',
				profileName: 'Duplicate Profile',
			})
			expect(secondResult.success).toBe(false)
			expect(secondResult.errors).toEqual([{message: 'Learning profile already exists.', location: 'form'}])
		})

		it('should catch generic database errors and return a generic error message', async () => {
			jest.spyOn(prisma.learningProfile, 'create').mockRejectedValueOnce(new Error('Simulated DB error'))

			const result = await createLearningProfile({
				type: 'self-study',
				profileName: 'Some Profile',
			})

			expect(result.success).toBe(false)
			expect(result.error).toBe('Failed to create profile. Please try again.')
			expect(console.error).toHaveBeenCalledWith(
				'Error creating profile:',
				expect.objectContaining({message: 'Simulated DB error'}),
			)
		})

		it('should call revalidatePath and redirect if specified in config', async () => {
			const result = await createLearningProfile(
				{type: 'self-study', profileName: 'New Path Profile'},
				{revalidateAfter: true, pathToRevalidate: '/profiles', type: 'page', redirectTo: '/dashboard'},
			)

			expect(result.success).toBe(true)
			expect(revalidatePath).toHaveBeenCalledWith('/profiles', 'page')
			expect(redirect).toHaveBeenCalledWith('/dashboard')
		})
	})
})
