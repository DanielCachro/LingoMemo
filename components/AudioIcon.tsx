'use client'
import {cn} from '@/lib/utils/cn'
import {faVolumeLow, faVolumeOff} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {HTMLAttributes, useEffect, useRef, useState} from 'react'

interface Props extends HTMLAttributes<HTMLSpanElement> {
	audio: string
	className?: string
}

export default function AudioIcon({audio, className, ...props}: Props) {
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)

	useEffect(() => {
		audioRef.current = new Audio(audio)
		audioRef.current.addEventListener('ended', () => setIsPlaying(false))
	}, [audio])

	function handlePlay() {
		if (!audioRef.current) return

		if (isPlaying) {
			audioRef.current.pause()
			audioRef.current.currentTime = 0
			setIsPlaying(false)
		} else {
			audioRef.current.play()
			setIsPlaying(true)
		}
	}

	return (
		<span
			role='button'
			tabIndex={0}
			aria-pressed={isPlaying}
			onClick={handlePlay}
			onKeyDown={e => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					handlePlay()
				}
			}}
			className={cn('inline-flex w-12 rounded-sm align-baseline hover:cursor-pointer', className)}
			{...props}>
			<FontAwesomeIcon widthAuto transform={'down-2'} icon={isPlaying ? faVolumeLow : faVolumeOff} />
		</span>
	)
}
