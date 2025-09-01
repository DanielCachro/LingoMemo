'use client'

import {useEffect} from 'react'

export default function AudioPlayback({audio}: {audio: string}) {
	useEffect(() => {
		const audioElement = new Audio(audio)

		audioElement.play().catch(error => {})

		return () => {
			audioElement.pause()
			audioElement.currentTime = 0
		}
	}, [audio])

	return null
}
