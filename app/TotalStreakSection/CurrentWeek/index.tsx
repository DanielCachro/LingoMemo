import StaggeredWeekItems from './StaggeredWeekItems'
import getCurrentWeekDays from './getCurrentWeekDays'

// Calculating the week days on the server to ensure a consistent reference week for all users, but determining the "current day" on the client side to match the user's local timezone.

export default function CurrentWeek() {
	const currentWeekDays = getCurrentWeekDays()

	return <StaggeredWeekItems currentWeekDays={currentWeekDays} />
}
