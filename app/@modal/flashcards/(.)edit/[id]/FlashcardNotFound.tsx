'use client'

import {useRouter} from 'next/navigation'
import {useEffect} from 'react'
import {toast} from 'react-toastify'

export default function FlashcardNotFound() {
	const router = useRouter()

	useEffect(() => {
		toast.error('Failed to load flashcard data. Please try again.')
		router.back()
	}, [router])

	return null
}
