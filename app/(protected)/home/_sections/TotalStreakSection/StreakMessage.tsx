import {MotionP} from '@/components/MotionWrappers'
import {getStreakData} from '@/lib/queries/profile/streak'

const zeroStreakMessages = ['The perfect time to begin!']
const superSmallStreakMessages = ['Keep it up!']
const smallStreakMessages = ['You’re doing great!', 'Fantastic progress!', 'You’re on a roll!', 'Awesome job!']
const bigStreakMessages = [
	'You are on fire!',
	'You’re a streak master!',
	'Unstoppable!',
	'Streak goals achieved!',
	'You’re a productivity machine!',
	'Total streak domination!',
]

function getStreakMessage(streakCount: number) {
	// Removed localStorage caching for streak messages to keep code simple and avoid to deal with hydration issues or making component structure more complex.
	// Old code commented out below for reference, but it can be safely deleted in the future if we are sure we won’t need it anymore.
	// Alternatively we can cache streak messages in database.

	// const key = 'streakMessage'

	if (streakCount < 0) {
		throw new Error('Streak count cannot be negative')
	}

	// const stored = localStorage.getItem(key)
	// if (stored) {
	// 	try {
	// 		const data = JSON.parse(stored)
	// 		if (data.streakCount === streakCount) {
	// 			return data.message
	// 		}
	// 	} catch {}
	// }

	let streakMessage: string

	if (streakCount === 0) {
		streakMessage = zeroStreakMessages[Math.floor(Math.random() * zeroStreakMessages.length)]
	} else if (streakCount <= 2) {
		streakMessage = superSmallStreakMessages[Math.floor(Math.random() * superSmallStreakMessages.length)]
	} else if (streakCount <= 15) {
		streakMessage = smallStreakMessages[Math.floor(Math.random() * smallStreakMessages.length)]
	} else {
		streakMessage = bigStreakMessages[Math.floor(Math.random() * bigStreakMessages.length)]
	}

	// const dataToStore = {
	// 	streakCount,
	// 	message: streakMessage,
	// }

	// localStorage.setItem(key, JSON.stringify(dataToStore))

	return streakMessage
}

export default async function StreakMessage() {
	const {streakCount} = await getStreakData()
	const streakMessage = getStreakMessage(streakCount)

	return (
		<MotionP
			initial={{scale: 0, rotate: -10}}
			animate={{scale: 1, rotate: 0}}
			transition={{visualDuration: 0.7, type: 'spring'}}
			className='text-xl font-bold text-background-500 sm:text-2xl'>
			{streakMessage}
		</MotionP>
	)
}
