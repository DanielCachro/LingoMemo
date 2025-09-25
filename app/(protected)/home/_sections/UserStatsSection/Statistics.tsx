'use client'

import {useStreak} from '@/hooks/useStreak'
import {useWeekFlashcardCount} from '@/hooks/useWeekFlashcardCount'
import {faClockRotateLeft, faFireFlameSimple} from '@fortawesome/free-solid-svg-icons'
import Statistic from './Statistic'

export default function Statistics() {
	const {data: streakData} = useStreak()
	const {data: weekFlashcardCountData} = useWeekFlashcardCount()
	const longestStreak = streakData?.longestStreak ?? 0
	const weekFlashcardCount = weekFlashcardCountData ?? 0
	return (
		<>
			<Statistic
				icon={faFireFlameSimple}
				record={`${longestStreak} day${longestStreak !== 1 ? 's' : ''}`}
				measure='in a row'
			/>
			<Statistic
				icon={faClockRotateLeft}
				record={`${weekFlashcardCount} card${weekFlashcardCount !== 1 ? 's' : ''}`}
				measure='in a week'
			/>
		</>
	)
}
