import 'server-only'

import {prisma} from '@/prisma/client'
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

export async function getActiveLearningProfile() {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated.')

	const activeLearningProfile = user.activeLearningProfile
	const activeLearningProfileId = user.activeLearningProfileId
	if (!activeLearningProfile || !activeLearningProfileId)
		return {activeLearningProfile: null, activeLearningProfileId: null}

	return {activeLearningProfile, activeLearningProfileId}
}
