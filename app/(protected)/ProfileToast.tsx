'use client'

import {LearningProfile} from '@/lib/generated/prisma/browser'
import {languageCodeToName} from '@/lib/utils'
import {useEffect, useRef} from 'react' // Dodano useRef
import {toast} from 'react-toastify'

export default function ProfileToast({activeLearningProfile}: {activeLearningProfile: LearningProfile}) {
	const mounted = useRef(false)

	useEffect(() => {
		const hasShownToast = sessionStorage.getItem('welcome_toast_shown')

		if (hasShownToast || mounted.current) return

		mounted.current = true

		const sourceLang = activeLearningProfile?.sourceLang
		const targetLang = activeLearningProfile?.targetLang

		const displayName = activeLearningProfile.profileName ? (
			<>
				on profile <span className='font-bold'>{activeLearningProfile.profileName}</span>
			</>
		) : sourceLang && targetLang ? (
			<>
				learning <span className='font-bold'>{languageCodeToName(targetLang)}</span> from{' '}
				<span className='font-bold'>{languageCodeToName(sourceLang)}</span>
			</>
		) : null

		if (displayName) {
			toast(
				<div>
					<p>Welcome back! 👋</p>
					<p>You are currently {displayName}</p>
				</div>,
			)

			sessionStorage.setItem('welcome_toast_shown', 'true')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return null
}
