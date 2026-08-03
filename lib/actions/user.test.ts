/**
 * @jest-environment node
 */

import {getCurrentUser} from '@/lib/queries/user'
import {prisma} from '@/prisma/client'
import {setupTestDatabase} from '@/tests/mocks/db'
import {setUserTimeZone} from './user'

jest.mock('@/lib/queries/user', () => ({
	getCurrentUser: jest.fn(),
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
})
