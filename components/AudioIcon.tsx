'use client'
import {cn} from '@/lib/utils/cn'
import {faVolumeLow, faVolumeOff} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {HTMLAttributes, useEffect, useRef, useState} from 'react'
import {toast} from 'react-toastify'

interface Props extends HTMLAttributes<HTMLSpanElement> {
	audio: string
	className?: string
}

// maximum time to wait for the audio to start playing before showing an error
const TIMEOUT_MS = 5000

export default function AudioIcon({audio, className, ...props}: Props) {
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const playTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	// Tracks if the audio is currently playing
	const [isPlaying, setIsPlaying] = useState(false)
	// Tracks if we are waiting for the play request to resolve/timeout (state used for blinking icon effect)
	const [isAttemptingPlay, setIsAttemptingPlay] = useState(false)

	useEffect(() => {
		const currentAudio = new Audio(audio)
		audioRef.current = currentAudio

		const handleEnded = () => {
			setIsPlaying(false)
			setIsAttemptingPlay(false) // Reset loading state if audio ends early
		}
		const handleError = () => {
			setIsPlaying(false)
			setIsAttemptingPlay(false) // Reset loading state on error
		}

		currentAudio.addEventListener('ended', handleEnded)
		currentAudio.addEventListener('error', handleError)

		return () => {
			currentAudio.removeEventListener('ended', handleEnded)
			currentAudio.removeEventListener('error', handleError)
			currentAudio.pause()

			if (playTimeoutRef.current) {
				clearTimeout(playTimeoutRef.current)
			}
		}
	}, [audio])

	function handlePlay() {
		if (!audioRef.current) return

		if (isPlaying) {
			// pause the audio and reset the state
			audioRef.current.pause()
			audioRef.current.currentTime = 0
			setIsPlaying(false)
			setIsAttemptingPlay(false)
			if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current)
		} else {
			// activate the blinking icon effect while waiting for the play request to resolve
			setIsAttemptingPlay(true)

			const playPromise = audioRef.current.play()

			if (playPromise !== undefined) {
				let isTimeoutAborted = false

				// Set a timeout for the play request
				playTimeoutRef.current = setTimeout(() => {
					isTimeoutAborted = true // Mark that the timeout has been reached
					setIsAttemptingPlay(false)
					setIsPlaying(false)
					toast.error('Failed to play audio. It might be unavailable or corrupted. Please try again later.')

					// Reset the audio element to allow for future play attempts
					if (audioRef.current) {
						audioRef.current.pause()
						audioRef.current.removeAttribute('src')
						audioRef.current.load()
						audioRef.current.src = audio
					}
				}, TIMEOUT_MS)

				playPromise
					.then(() => {
						if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current)
						setIsAttemptingPlay(false)
						setIsPlaying(true)
					})
					.catch((error: DOMException | Error) => {
						if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current)

						setIsAttemptingPlay(false)

						if (isTimeoutAborted || error.name === 'AbortError') {
							return
						}

						// setIsPlaying(false) is already called in the timeout handler, so we only need to call it here if the error is not due to a timeout
						setIsPlaying(false)
						toast.error('Failed to play audio. It might be unavailable or corrupted. Please try again later.')
					})
			}
		}
	}

	return (
		<span
			role='button'
			tabIndex={0}
			aria-pressed={isPlaying}
			aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
			onClick={handlePlay}
			onKeyDown={e => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					handlePlay()
				}
			}}
			// Standard Tailwind 'animate-pulse' is applied during loading
			className={cn(
				'inline-flex w-12 rounded-sm align-baseline transition-opacity duration-300 hover:cursor-pointer',
				className,
				isAttemptingPlay && 'animate-pulse opacity-70',
			)}
			{...props}>
			<FontAwesomeIcon widthAuto transform={'down-2'} icon={isPlaying ? faVolumeLow : faVolumeOff} />
		</span>
	)
}
