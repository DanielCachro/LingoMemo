'use client'
import {DateTime} from 'luxon'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'

export function TimeZoneUpdater() {
	const router = useRouter()
	useEffect(() => {
		const dateTime = DateTime.local()
		const zone = {
			timeZone: dateTime.zoneName,
			offsetMinutes: dateTime.offset,
		}

		async function sendTimezoneToServer() {
			const response = await fetch('/api/user/timezone', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(zone),
			})
			if (!response.ok) {
				throw new Error('Failed to update user timezone')
			}
			const data = await response.json()

			if (data.updated) {
				router.refresh()
			}
		}
		sendTimezoneToServer().catch(error => {
			// TODO: show toast
			alert(error.message || 'Unknown error')
		})
	}, [router])

	return null
}
