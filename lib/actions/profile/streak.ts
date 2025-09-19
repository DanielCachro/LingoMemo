'use server'
import {cookies} from 'next/headers'

export async function getTotalStreak() {
	const cookieStore = await cookies()

	const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/streak/total-streak`, {
		next: {tags: ['totalStreak']},
		headers: {
			cookie: cookieStore.toString(),
		},
	})

	if (!res.ok) {
		throw new Error('Failed to fetch total streak')
	}

	const data = await res.json()
	return data.streakCount as number
}
