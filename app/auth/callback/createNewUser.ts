import {prisma} from '@/prisma/client'
import {Prisma} from '@prisma/client'

import {User} from '@supabase/supabase-js'
import {z} from 'zod'

const userMetadataSchema = z.object({
	full_name: z.string().min(1),
	avatar_url: z.url(),
	email: z.email(),
})

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
			await prisma.user.create({
				data: {
					id: user.id,
					email: userMetadata.email,
					name: userMetadata.full_name,
					preferences: {
						create: {
							theme: 'Automatic',
						},
					},
					learningProfiles: {
						connectOrCreate: {
							where: {
								sourceLang_targetLang: {sourceLang: 'en', targetLang: 'en'},
							},
							create: {
								sourceLang: 'en',
								targetLang: 'en',
							},
						},
					},
				},
			})
		} catch (error: unknown) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				// Handling Unique constraint failed
				if (error.code === 'P2002') {
					const learningProfile = await prisma.learningProfile.findUnique({
						where: {sourceLang_targetLang: {sourceLang: 'en', targetLang: 'en'}},
					})
					if (!learningProfile) {
						throw error
					}

					await prisma.user.create({
						data: {
							id: user.id,
							email: userMetadata.email,
							name: userMetadata.full_name,
							preferences: {
								create: {
									theme: 'Automatic',
								},
							},
							learningProfiles: {
								connect: {
									id: learningProfile.id,
								},
							},
						},
					})
				}

				throw error
			}

			throw error
		}
	}
}
