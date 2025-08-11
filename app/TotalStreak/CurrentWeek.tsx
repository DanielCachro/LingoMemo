import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheck} from '@fortawesome/free-solid-svg-icons'
import {cn} from '@/lib/utils'

function getCurrentWeekDays() {
	const days = []
	const today = new Date()

	const dayOfWeek = today.getDay()
	const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

	const monday = new Date(today)
	monday.setDate(today.getDate() + diffToMonday)

	for (let i = 0; i < 7; i++) {
		const date = new Date(monday)
		date.setDate(monday.getDate() + i)

		const day = date.getDate()
		const dayLabel = date.toLocaleString('en-US', {weekday: 'short'})
		const datetime = date.toISOString().split('T')[0]

		// In future get info if the user completed flashcards on this day
		// ...

		days.push({day, dayLabel, datetime, completed: false})
	}

	// Simulate days completion, will be removed in future
	const newDays = days.splice(0, Math.abs(diffToMonday) + 1).map(day => {
		day.completed = true
		return day
	})
	days.unshift(...newDays)

	return days
}

export default function CurrentWeek() {
	const currentWeekDays = getCurrentWeekDays()
	const currentDay = new Date().getDate()

	return (
		<ul className='flex gap-8'>
			{currentWeekDays.map(({day, dayLabel, datetime, completed}) => (
				<li
					key={`${day}-${dayLabel}`}
					className={cn('space-y-16 text-center text-sm text-background-400 dark:text-background-600', {
						'text-background-800 dark:text-background-200': currentDay === day,
					})}>
					<p>
						<time dateTime={datetime}>{dayLabel}</time>
					</p>
					<p
						className={cn('flex size-32 items-center justify-center font-bold', {
							'rounded-full bg-primary-500 text-primary-50 dark:bg-primary-600': completed,
						})}>
						<time dateTime={datetime}>{completed ? <FontAwesomeIcon icon={faCheck} /> : day}</time>
					</p>
				</li>
			))}
		</ul>
	)
}
