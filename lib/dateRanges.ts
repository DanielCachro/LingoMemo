export function getCurrentWeekDays() {
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

export function getLast7Days() {
	const days = []
	const today = new Date()

	for (let i = 0; i < 7; i++) {
		const date = new Date(today)
		date.setDate(today.getDate() - i)

		const day = date.getDate()
		const month = date.toLocaleString('en-US', {month: 'short'})
		const datetime = date.toISOString().split('T')[0]

		// In future get info how many flashcards have been completed.
		// ...
		const cardsCompleted = Math.round(Math.random() * 120)

		days.unshift({day, month, datetime, cardsCompleted})
	}

	return days
}
