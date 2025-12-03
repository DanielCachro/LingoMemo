import {prisma} from '@/prisma/client'

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

	if (!dbUser) {
		try {
			await prisma.user.create({
				data: {
					id: user.id,
					name: userMetadata.full_name,
					email: userMetadata.email,
					timeZone: 'Etc/UTC',
					utcOffsetMinutes: 0,
					preferences: {
						create: {},
					},
				},
			})
		} catch (error) {
			if (error instanceof Error) {
				console.error(`Error creating new user: ${error.message}`)
				throw new Error(`Database error: ${error.message}`)
			}

			throw new Error('Failed to create new user: Unknown error occurred')
		}
	}
}
