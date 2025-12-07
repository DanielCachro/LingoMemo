'use client'

import {Analytics} from '@vercel/analytics/next'
import {SpeedInsights} from '@vercel/speed-insights/next'
import {useEffect, useState} from 'react'

export default function AnalyticsWrapper() {
	const [consent, setConsent] = useState<string | null>(null)

	useEffect(() => {
		setConsent(localStorage.getItem('cookieConsent'))

		const handleConsentUpdate = () => {
			setConsent(localStorage.getItem('cookieConsent'))
		}

		window.addEventListener('cookie-consent-update', handleConsentUpdate)
		return () => window.removeEventListener('cookie-consent-update', handleConsentUpdate)
	}, [])

	if (consent !== 'accepted') {
		return null
	}

	return (
		<>
			<Analytics />
			<SpeedInsights />
		</>
	)
}
