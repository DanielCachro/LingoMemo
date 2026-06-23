// components/CookieConsent.tsx
'use client'

import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'
import SlabBorder from '@/components/SlabBorder'
import {AnimatePresence, motion} from 'motion/react'
import Link from 'next/link'
import {useEffect, useState} from 'react'

export default function CookieConsent() {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const checkConsent = () => {
			const consent = localStorage.getItem('cookieConsent')
			if (!consent) {
				setIsVisible(true)
			}
		}

		checkConsent()

		const handleResetEvent = () => {
			localStorage.removeItem('cookieConsent')
			setIsVisible(true)
		}

		window.addEventListener('reset-cookie-consent', handleResetEvent)

		return () => {
			window.removeEventListener('reset-cookie-consent', handleResetEvent)
		}
	}, [])

	const handleAccept = () => {
		localStorage.setItem('cookieConsent', 'accepted')
		window.dispatchEvent(new Event('cookie-consent-update'))
		setIsVisible(false)
	}

	const handleDecline = () => {
		localStorage.setItem('cookieConsent', 'declined')
		window.dispatchEvent(new Event('cookie-consent-update'))
		setIsVisible(false)
	}

	return (
		<>
			<AnimatePresence>
				{isVisible && (
					<motion.div
						initial={{y: 100, opacity: 0}}
						animate={{y: 0, opacity: 1}}
						exit={{opacity: 0}}
						className='fixed bottom-0 left-0 z-50 p-16 sm:w-384'>
						<SlabBorder className='space-y-16 p-12'>
							<p>
								We use essential cookies to offer you a better application experience. We&apos;d like to use other
								cookies to analyse our website&apos;s performance, but only if you accept. Learn more about our{' '}
								<Link href='/privacy' className='underline hover:text-primary-500 dark:hover:text-primary-600'>
									cookie policy
								</Link>
								.
							</p>
							<div className='flex gap-12'>
								<PrimaryButton onClick={handleAccept} className='w-128'>
									Accept
								</PrimaryButton>
								<SecondaryButton onClick={handleDecline} className='w-128'>
									Decline
								</SecondaryButton>
							</div>
						</SlabBorder>
					</motion.div>
				)}
			</AnimatePresence>
			<div role='status' className='sr-only'>
				{isVisible ? 'Cookie consent banner is visible, please accept or decline' : undefined}
			</div>
		</>
	)
}
