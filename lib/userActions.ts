'use server'
import 'server-only'

import {prisma} from '@/prisma/client'
import {cache} from 'react'
import {createClient} from './supabase/server'

export const getCurrentUser = cache(async () => {
	const supabase = await createClient()
	const {data} = await supabase.auth.getUser()

	if (!data?.user) return null

	return prisma.user.findUnique({
		where: {id: data.user.id},
		include: {preferences: true, learningProfiles: true, activeLearningProfile: true},
	})
})
