'use server'
import {getCurrentUser, setActiveLearningProfile} from '@/lib/actions/user'
import {prisma} from '@/prisma/client'
import {revalidatePath} from 'next/cache'
import type { RevalidationConfig } from '@/types/revalidate'

export async function deleteLearningProfile(profileId: number, config: RevalidationConfig = {revalidateAfter: false}) {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated')

	const activeLearningProfile = user.activeLearningProfile
	const activeLearningProfileId = user.activeLearningProfileId

	if (!activeLearningProfile || !activeLearningProfileId) throw new Error('No active learning profile found.')

	if (activeLearningProfileId === profileId) {
		if (user.learningProfiles.length === 1) {
			throw new Error('Cannot delete the only learning profile.')
		}
		const newActiveProfile = user.learningProfiles.find(profile => profile.id !== profileId)
		if (!newActiveProfile) {
			throw new Error('No alternative learning profile found to set as active.')
		}

		await setActiveLearningProfile(newActiveProfile.id, {revalidateAfter: false})
	}

	await prisma.learningProfile.delete({
		where: {
			id: profileId,
			userId: user.id,
		},
	})

	if (config.revalidateAfter) {
		revalidatePath(config.pathToRevalidate)
	}
}
