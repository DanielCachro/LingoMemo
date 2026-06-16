'use server'

import {prisma} from '@/prisma/client'
import type {RevalidationConfig} from '@/types/revalidate'
import {revalidatePath} from 'next/cache'
import {getCurrentUser} from '../queries/user'

export const setUserTimeZone = async (timeZone: string | undefined, offsetMinutes: number) => {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated.')

	if (user.timeZone === timeZone && user.utcOffsetMinutes === offsetMinutes) {
		return {updated: false}
	}

	await prisma.user.update({
		where: {id: user.id},
		data: {
			timeZone,
			utcOffsetMinutes: offsetMinutes,
		},
	})

	return {updated: true}
}

export async function setActiveLearningProfile(
	profileId: number,
	config: RevalidationConfig = {revalidateAfter: false},
) {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated.')

	await prisma.user.update({
		where: {id: user.id},
		data: {
			activeLearningProfileId: profileId,
		},
	})

	if (config.revalidateAfter) {
		revalidatePath(config.pathToRevalidate, config.type)
	}
}
