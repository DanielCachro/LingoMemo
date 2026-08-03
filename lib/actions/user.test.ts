/**
 * @jest-environment node
 */

import {getCurrentUser} from '@/lib/queries/user'
import {prisma} from '@/prisma/client'
import {setupTestDatabase} from '@/tests/mocks/db'
import type {RevalidationConfig} from '@/types/revalidate'
import {revalidatePath} from 'next/cache'
import {setActiveLearningProfile, setUserTimeZone} from './user'

jest.mock('@/lib/queries/user', () => ({
	getCurrentUser: jest.fn(),
}))

jest.mock('next/cache', () => ({
	revalidatePath: jest.fn(),
}))

describe('User Server Actions', () => {
	afterAll(() => {
		jest.restoreAllMocks()
	})

	const context = setupTestDatabase()

	describe('setUserTimeZone', () => {
		beforeEach(async () => {
			// already in setupTestDatabase, but just to be explicit here
			jest.clearAllMocks()
			// set up default happy-path mock before each test
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				timeZone: 'Europe/Warsaw',
				utcOffsetMinutes: 120,
			})

			// reset the user to a known state before each test
			await prisma.user.update({
				where: {id: context.user.id},
				data: {
					timeZone: 'Europe/Warsaw',
					utcOffsetMinutes: 120,
				},
			})
		})

		it('should successfully update the user time zone and offset in the database', async () => {
			const result = await setUserTimeZone('Asia/Tokyo', 540)

			expect(result).toEqual({updated: true})

			// verify that changes were actually persisted in the database
			const userInDb = await prisma.user.findUnique({
				where: {id: context.user.id},
			})

			expect(userInDb).not.toBeNull()
			expect(userInDb?.timeZone).toBe('Asia/Tokyo')
			expect(userInDb?.utcOffsetMinutes).toBe(540)
		})

		it('should return { updated: false } and skip the database update if values are identical', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				timeZone: 'Asia/Tokyo',
				utcOffsetMinutes: 540,
			})

			const updateSpy = jest.spyOn(prisma.user, 'update')

			const result = await setUserTimeZone('Asia/Tokyo', 540)

			expect(result).toEqual({updated: false})

			// verify no unnecessary database calls were made
			expect(updateSpy).not.toHaveBeenCalled()
		})

		it('should throw an error if the user is not authenticated', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue(null)

			await expect(setUserTimeZone('Asia/Tokyo', 540)).rejects.toThrow('User not authenticated.')
		})

		it('should allow timeZone to be undefined and preserve existing timeZone', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				timeZone: undefined,
				utcOffsetMinutes: 120,
			})

			const result = await setUserTimeZone(undefined, 540)

			expect(result).toEqual({updated: true})

			const userInDb = await prisma.user.findUnique({
				where: {id: context.user.id},
			})

			expect(userInDb).not.toBeNull()
			expect(userInDb?.utcOffsetMinutes).toBe(540)
			// check if timeZone remains unchanged (not updated to undefined)
			expect(userInDb?.timeZone).toBe('Europe/Warsaw')
		})

		it('should propagate database errors if prisma update fails', async () => {
			// artificially force a Prisma error for this test
			jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(new Error('Simulated DB error'))

			await expect(setUserTimeZone('Asia/Tokyo', 540)).rejects.toThrow('Simulated DB error')
		})
	})

	describe('setActiveLearningProfile', () => {
		beforeEach(async () => {
			jest.clearAllMocks()

			// mock user with a null learning profile initially
			;(getCurrentUser as jest.Mock).mockResolvedValue({
				...context.user,
				activeLearningProfileId: null,
			})

			// reset the database state
			await prisma.user.update({
				where: {id: context.user.id},
				data: {
					activeLearningProfileId: null,
				},
			})
		})

		it('should successfully update the active learning profile and its relation in the database', async () => {
			// use the profile created in setupTestDatabase
			const validProfileId = context.profile.id

			// verify initial state before action
			const userBeforeAction = await prisma.user.findUnique({
				where: {id: context.user.id},
				include: {activeLearningProfile: true},
			})

			expect(userBeforeAction?.activeLearningProfileId).toBeNull()
			expect(userBeforeAction?.activeLearningProfile).toBeNull() // verify that the relation is also null before the action

			await setActiveLearningProfile(validProfileId)

			// verify the state after the action
			const userAfterAction = await prisma.user.findUnique({
				where: {id: context.user.id},
				include: {activeLearningProfile: true},
			})

			expect(userAfterAction).not.toBeNull()
			expect(userAfterAction?.activeLearningProfileId).toBe(validProfileId)

			// verify that the relation is also updated correctly
			expect(userAfterAction?.activeLearningProfile).not.toBeNull()
			expect(userAfterAction?.activeLearningProfile?.id).toBe(validProfileId)
		})

		it('should throw an error if the user is not authenticated', async () => {
			;(getCurrentUser as jest.Mock).mockResolvedValue(null)

			const validProfileId = context.profile.id
			await expect(setActiveLearningProfile(validProfileId)).rejects.toThrow('User not authenticated.')

			// verify that no changes were made to the database
			const userInDb = await prisma.user.findUnique({
				where: {id: context.user.id},
			})
			expect(userInDb?.activeLearningProfileId).toBeNull()
		})

		it('should call revalidatePath when config.revalidateAfter is true', async () => {
			const validProfileId = context.profile.id
			const config: RevalidationConfig = {
				revalidateAfter: true,
				pathToRevalidate: '/dashboard',
				type: 'layout',
			}

			await setActiveLearningProfile(validProfileId, config)

			expect(revalidatePath).toHaveBeenCalledTimes(1)
			expect(revalidatePath).toHaveBeenCalledWith('/dashboard', 'layout')
		})

		it('should NOT call revalidatePath when config.revalidateAfter is false', async () => {
			const validProfileId = context.profile.id
			const config: RevalidationConfig = {
				revalidateAfter: false,
			}

			await setActiveLearningProfile(validProfileId, config)

			expect(revalidatePath).not.toHaveBeenCalled()
		})

		it('should NOT call revalidatePath by default if no config is provided', async () => {
			const validProfileId = context.profile.id

			// calling without the second argument (defaults to false)
			await setActiveLearningProfile(validProfileId)

			expect(revalidatePath).not.toHaveBeenCalled()
		})

		it('should propagate database errors if prisma update fails', async () => {
			jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(new Error('Simulated DB error'))

			const validProfileId = context.profile.id
			await expect(setActiveLearningProfile(validProfileId)).rejects.toThrow('Simulated DB error')
		})
	})
})
