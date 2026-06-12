'use server'

import {prisma} from '@/prisma/client'
import type {RevalidationConfig} from '@/types/revalidate'
import {revalidatePath} from 'next/cache'
import {cache} from 'react'
import {createClient} from '../supabase/server'

export const getCurrentUser = cache(async () => {
	const supabase = await createClient()
	const {data} = await supabase.auth.getUser()

	if (!data?.user) return null

	const user = await prisma.user.findUnique({
		where: {id: data.user.id},
		include: {preferences: true, learningProfiles: true, activeLearningProfile: true},
	})

	if (!user) {
		await supabase.auth.signOut()
		return null
	}

	return user
})

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

export async function getActiveLearningProfile() {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated.')

	const activeLearningProfile = user.activeLearningProfile
	const activeLearningProfileId = user.activeLearningProfileId
	if (!activeLearningProfile || !activeLearningProfileId)
		return {activeLearningProfile: null, activeLearningProfileId: null}

	return {activeLearningProfile, activeLearningProfileId}
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
