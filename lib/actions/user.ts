'use server'
import 'server-only'

import {prisma} from '@/prisma/client'
import {cache} from 'react'
import {createClient} from '../supabase/server'

export const getCurrentUser = cache(async () => {
	const supabase = await createClient()
	const {data} = await supabase.auth.getUser()

	if (!data?.user) return null

	return prisma.user.findUnique({
		where: {id: data.user.id},
		include: {preferences: true, learningProfiles: true, activeLearningProfile: true},
	})
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

export async function getActiveLearingProfile() {
	'use server'
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated.')

	const activeLearningProfile = user.activeLearningProfile
	const activeLearningProfileId = user.activeLearningProfileId
	if (!activeLearningProfile || !activeLearningProfileId) throw new Error('No active learning profile for user.')

	return {activeLearningProfile, activeLearningProfileId}
}
