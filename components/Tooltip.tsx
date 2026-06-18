'use client'
import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useEffect, useId, useRef, useState} from 'react'

export default function Tooltip({
	children,
	ariaLabel = 'More information',
}: {
	children: React.ReactNode
	ariaLabel?: string
}) {
	const [isOpen, setIsOpen] = useState(false)
	const [openMethod, setOpenMethod] = useState<'hover' | 'focus' | 'touch' | null>(null)
	const containerRef = useRef<HTMLSpanElement>(null)
	const tooltipId = useId()

	useEffect(() => {
		if (!isOpen) return

		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false)
				setOpenMethod(null)
			}
		}

		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false)
				setOpenMethod(null)
			}
		}

		document.addEventListener('click', handleClickOutside)
		document.addEventListener('keydown', handleEscapeKey)

		return () => {
			document.removeEventListener('click', handleClickOutside)
			document.removeEventListener('keydown', handleEscapeKey)
		}
	}, [isOpen])

	const handleMouseEnter = () => {
		setIsOpen(true)
		setOpenMethod('hover')
	}

	const handleMouseLeave = () => {
		if (openMethod === 'hover') {
			setIsOpen(false)
			setOpenMethod(null)
		}
	}

	const handleFocus = () => {
		setIsOpen(true)
		setOpenMethod('focus')
	}

	const handleBlur = () => {
		if (openMethod === 'focus') {
			setIsOpen(false)
			setOpenMethod(null)
		}
	}

	const handleTouchStart = (e: React.TouchEvent) => {
		e.preventDefault()
		setIsOpen(prev => !prev)
		setOpenMethod('touch')
	}

	return (
		<span
			ref={containerRef}
			className='relative inline-block'
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
			<button
				type='button'
				className='text-background-400 hover:text-primary-500 dark:hover:text-primary-600'
				aria-label={ariaLabel}
				aria-describedby={isOpen ? tooltipId : undefined}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onTouchStart={handleTouchStart}
				onClick={e => {
					e.stopPropagation()
				}}>
				<FontAwesomeIcon icon={faCircleQuestion} />
			</button>
			{isOpen && (
				<div
					id={tooltipId}
					role='tooltip'
					className='absolute bottom-full left-1/2 z-10 mb-4 w-192 -translate-x-1/2 rounded-sm bg-background-600 p-12 text-xs text-background-50 shadow-lg dark:bg-background-200 dark:text-background-900'>
					{children}
				</div>
			)}
		</span>
	)
}
