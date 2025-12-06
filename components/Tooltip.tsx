import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useEffect, useRef, useState} from 'react'

export default function Tooltip({children}: {children: React.ReactNode}) {
	const [isOpen, setIsOpen] = useState(false)
	const [openMethod, setOpenMethod] = useState<'hover' | 'focus' | 'touch' | null>(null)
	const containerRef = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		if (!isOpen) return

		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false)
				setOpenMethod(null)
			}
		}

		document.addEventListener('click', handleClickOutside)
		return () => document.removeEventListener('click', handleClickOutside)
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
				onFocus={handleFocus}
				onBlur={handleBlur}
				onTouchStart={handleTouchStart}
				onClick={e => {
					e.stopPropagation()
				}}>
				<FontAwesomeIcon icon={faCircleQuestion} />
			</button>
			{isOpen && (
				<div className='absolute bottom-full left-1/2 z-10 mb-4 w-192 -translate-x-1/2 rounded-sm bg-background-600 p-12 text-xs text-background-50 shadow-lg dark:bg-background-200 dark:text-background-900'>
					{children}
				</div>
			)}
		</span>
	)
}
