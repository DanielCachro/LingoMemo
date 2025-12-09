'use client'

import {updateStreak} from '@/lib/actions/profile/streak'
import {useEffect} from 'react'
import {toast} from 'react-toastify'

export default function StreakSynchronizer({activeLearningProfileId}: {activeLearningProfileId?: number}) {
	useEffect(() => {
		updateStreak()
			.then(result => {
				if (result.updated) {
					toast(result.message)
				}
			})
			.catch(console.error)
	}, [activeLearningProfileId])

	return null
}
