import {prisma} from '@/prisma/client'

import {User} from '@supabase/supabase-js'
import {z} from 'zod'

const userMetadataSchema = z.object({
	full_name: z.string().min(1),
	avatar_url: z.url(),
	email: z.email(),
})

async function create(userId: string, userMetadata: z.infer<typeof userMetadataSchema>) {
	await prisma.$transaction(async tx => {
		const createdUser = await tx.user.create({
			data: {
				id: userId,
				name: userMetadata.full_name,
				email: userMetadata.email,
				preferences: {
					create: {
						theme: 'Automatic',
					},
				},
				learningProfiles: {
					create: [
						{
							sourceLang: 'en',
							targetLang: 'en',
						},
					],
				},
			},
			include: {
				learningProfiles: true,
			},
		})

		const learningProfile = createdUser.learningProfiles[0]
		if (!learningProfile) throw new Error('LearningProfile has not been created!')

		await tx.user.update({
			where: {id: createdUser.id},
			data: {activeLearningProfileId: learningProfile.id},
		})
	})
}

export async function createNewUser(user: User | null) {
	if (!user) {
		throw new Error('User is null')
	}

	const parsed = userMetadataSchema.safeParse(user.user_metadata)

	if (!parsed.success) {
		throw new Error(`Invalid user metadata: ${parsed.error.message}`)
	}

	const userMetadata = parsed.data

	const dbUser = await prisma.user.findUnique({
		where: {id: user.id},
	})

	/* TODO: In the future, instead of immediately creating an en-en learningProfile when creating a new dbuser, do it in a separate component. Immediately after the login: (check if there is a learningProfile, if not, the user chooses the one they want). 
	Can do the same with preferences instead of creating them in advance with default settings, when there are no preferences, a screen for selecting them will appear. */

	if (!dbUser) {
		try {
			await create(user.id, userMetadata)
		} catch (error: unknown) {
			if (typeof error === 'object' && error !== null && 'message' in error) {
				console.error(`Error creating new user: ${error.message}`)
			} else {
				throw new Error('Failed to create new user')
			}
		}
	}
}
