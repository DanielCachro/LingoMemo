import {DateTime} from 'luxon'

export function getUserDayRangeUTC(userZone: {timezone?: string; offsetMinutes?: number}): {
	startOfTodayUTC: DateTime
	endOfTodayUTC: DateTime
} {
	let userNow

	if (userZone.timezone) {
		userNow = DateTime.now().setZone(userZone.timezone)
	} else if (userZone.offsetMinutes) {
		const hours = userZone.offsetMinutes / 60
		const zoneString = `UTC${hours >= 0 ? '+' : ''}${hours}`
		userNow = DateTime.now().setZone(zoneString)
	} else {
		userNow = DateTime.now().setZone('UTC')
	}

	const startOfDayUser = userNow.startOf('day')
	const endOfDayUser = userNow.endOf('day')

	const startOfTodayUTC = startOfDayUser.toUTC()
	const endOfTodayUTC = endOfDayUser.toUTC()

	return {startOfTodayUTC, endOfTodayUTC}
}

export function getUserTimeZoneString(userZone: {timezone?: string; offsetMinutes?: number}): string {
	if (userZone.timezone) {
		return userZone.timezone
	} else if (userZone.offsetMinutes) {
		const hours = userZone.offsetMinutes / 60
		return `UTC${hours >= 0 ? '+' : ''}${hours}`
	} else {
		return 'UTC'
	}
}
