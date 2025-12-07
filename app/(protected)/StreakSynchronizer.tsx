'use client'

import {updateStreak} from '@/lib/actions/profile/streak'
import {useEffect} from 'react'

export default function StreakSynchronizer() {
	useEffect(() => {
		updateStreak().catch(console.error)
	}, [])

	return null
}
