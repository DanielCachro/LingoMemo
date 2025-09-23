'use server'
import {cookies} from 'next/headers'

export async function getTotalStreak() {
	const cookieStore = await cookies()

	await resetIfBroken()
	const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/streak/total-streak`, {
		next: {tags: ['totalStreak']},
		headers: {
			cookie: cookieStore.toString(),
		},
	})

	if (!response.ok) {
		throw new Error('Failed to fetch total streak')
	}

	const data = await response.json()
	return data.streakCount as number
}

export async function resetIfBroken() {
	const cookieStore = await cookies()
	const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/streak/total-streak/reset-if-broken`, {
		method: 'POST',
		headers: {
			cookie: cookieStore.toString(),
		},
	})
	if (!response.ok) {
		throw new Error('Failed to reset total streak if broken')
	}
}
