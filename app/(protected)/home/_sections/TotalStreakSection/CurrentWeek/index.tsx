import {getWeekdaysCompletion} from '@/lib/actions/profile/week'
import StaggeredWeekItems from './StaggeredWeekItems'

// Calculating the week days on the server to ensure a consistent reference week for all users, but determining the "current day" on the client side to match the user's local timezone.

export default async function CurrentWeek() {
	const weekDaysCompletion = await getWeekdaysCompletion()
	return <StaggeredWeekItems weekDaysCompletion={weekDaysCompletion} />
}
