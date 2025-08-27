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
			},
			include: {preferences: true},
		})
	}
}
