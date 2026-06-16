import {getWeekFlashcardCount} from '@/lib/queries/profile/week'
import {getStreakData} from '@/lib/queries/profile/streak'
import {faClockRotateLeft, faFireFlameSimple} from '@fortawesome/free-solid-svg-icons'
import Statistic from './Statistic'

export default async function Statistics() {
	const {longestStreak} = await getStreakData()
	const weekFlashcardCount = await getWeekFlashcardCount()

	return (
		<>
			<Statistic
				icon={faClockRotateLeft}
				record={`${weekFlashcardCount} card${weekFlashcardCount !== 1 ? 's' : ''}`}
				measure='this week'
			/>
			<Statistic
				icon={faFireFlameSimple}
				record={`${longestStreak} day${longestStreak !== 1 ? 's' : ''}`}
				measure='your record'
			/>
		</>
	)
}
