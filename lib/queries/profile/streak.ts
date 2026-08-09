import 'server-only'

import calculateStreakStatus from '@/lib/utils/profile/calculateStreakStatus'
import {cache} from 'react'

export const getStreakData = cache(async () => {
	const status = await calculateStreakStatus()
	if (!status) throw new Error('User not authenticated or no profile')

	return {
		streakCount: status.newStreakCount,
		longestStreak: status.shouldIncrement
			? Math.max(status.dbLongestStreak, status.newStreakCount)
			: status.dbLongestStreak,
	}
})
