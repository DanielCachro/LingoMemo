'use client'

import {useMediaQuery} from '@/hooks/useMediaQuery'
import {cn} from '@/lib/utils'
import {AnimatePresence, motion, useAnimationControls, useDragControls} from 'motion/react'
import {usePathname} from 'next/navigation'
import {ReactNode, useCallback, useEffect, useState} from 'react'

export interface ModalDisableAnimations {
	disableEntryAnimation?: boolean
	disableExitAnimation?: boolean
}

interface ModalProps {
	header: 'mobile' | 'desktop' | 'both' | 'none'
	heading: string
	children: ReactNode | ((closeModal: () => void) => ReactNode)
	mobileScreenCoverage?: 'full' | '9/10' | '3/4' | '2/3' | '1/2' | '1/3'
	closingType?: 'navigateBack' | 'dialogClose'
	onClose?: () => void
	className?: string
	disableAnimations?: ModalDisableAnimations
}

export default function Modal({
	children,
	header,
	heading,
	mobileScreenCoverage = 'full',
	closingType = 'navigateBack',
	onClose,
	className,
	disableAnimations,
}: ModalProps) {
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(true)
	const [modalNavCount, setModalNavCount] = useState(process.env.NODE_ENV === 'development' ? -1 : 0)

	const isDesktop = useMediaQuery('(min-width: 40rem)')
	const animationControls = useAnimationControls()
	const dragControls = useDragControls()

	const shouldAnimateEntry = !disableAnimations?.disableEntryAnimation
	const shouldAnimateExit = !disableAnimations?.disableExitAnimation

	const getOpenPosition = useCallback(() => {
		if (typeof window === 'undefined') return 0

		if (mobileScreenCoverage === 'full') return 0
		const heightRatioParts = mobileScreenCoverage.split('/')
		const [numerator, denominator] = heightRatioParts.map(Number)
		return window.innerHeight * ((denominator - numerator) / denominator)
	}, [mobileScreenCoverage])

	const CLOSED_POSITION = typeof window !== 'undefined' ? window.innerHeight * 1.05 : 1500
	const openPosition = getOpenPosition()

	const animations = isDesktop
		? {
				initial: shouldAnimateEntry ? {scale: 0.95, opacity: 0} : {scale: 1, opacity: 1},
				exit: shouldAnimateExit ? {scale: 0.95, opacity: 0} : {scale: 1, opacity: 1, transition: {duration: 0}},
			}
		: {
				initial: shouldAnimateEntry ? {y: CLOSED_POSITION} : {y: openPosition},
				exit: shouldAnimateExit ? {y: CLOSED_POSITION} : {y: openPosition, transition: {duration: 0}},
			}

	const backdropAnimations = {
		initial: shouldAnimateEntry ? {opacity: 0} : {opacity: 1},
		animate: {opacity: 1},
		exit: shouldAnimateExit ? {opacity: 0} : {opacity: 1, transition: {duration: 0}},
	}

	const handleClose = useCallback(() => {
		setIsOpen(false)
	}, [])

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				handleClose()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [handleClose])

	// In Next.js 16, intercepted routes and modals are not unmounted on navigation.
	// Instead, they are hidden using the <Activity> API (kept in the DOM with display: none).
	// This cleanup function triggers right before the component goes to sleep.
	// By resetting the state here, we guarantee that when the user opens the modal again,
	// it wakes up with a fresh state and renders properly.
	useEffect(() => {
		return () => {
			setIsOpen(true)
			setModalNavCount(0)
		}
	}, [])

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function onDragEnd(_event: any, info: {offset: {y: number}; velocity: {y: number}}) {
		if (typeof window === 'undefined') return

		const closeThreshold = window.innerHeight * 0.15
		const offsetY = info.offset.y
		const velocityY = info.velocity.y

		if (offsetY > closeThreshold || velocityY > 800) {
			handleClose()
		} else {
			animationControls.start({y: openPosition})
		}
	}

	useEffect(() => {
		if (isOpen) {
			animationControls.start(isDesktop ? {scale: 1, opacity: 1} : {y: openPosition})
		}
	}, [isOpen, isDesktop, openPosition, animationControls])

	useEffect(() => {
		setModalNavCount(prevCount => prevCount + 1)
	}, [pathname])

	const getMobileHeight = () => {
		if (isDesktop || mobileScreenCoverage === 'full') return undefined
		const [numerator, denominator] = mobileScreenCoverage.split('/').map(Number)
		return `${(numerator / denominator) * 100}vh`
	}

	return (
		<AnimatePresence
			onExitComplete={() => {
				if (closingType === 'dialogClose') {
					onClose?.()
				} else {
					window.history.go(-modalNavCount)
				}
			}}>
			{isOpen && (
				<>
					<motion.div
						initial={backdropAnimations.initial}
						animate={backdropAnimations.animate}
						exit={backdropAnimations.exit}
						className='fixed inset-0 z-50 bg-background-950/60'
						onClick={handleClose}
					/>
					<motion.div
						aria-label={heading}
						onDragEnd={onDragEnd}
						initial={animations.initial}
						animate={animationControls}
						exit={animations.exit}
						transition={{type: 'tween', ease: 'easeInOut', duration: isDesktop ? 0.2 : 0.3}}
						drag={isDesktop ? false : 'y'}
						dragListener={false}
						dragControls={dragControls}
						dragConstraints={{top: 0}}
						dragElastic={{top: 0, bottom: 0.6}}
						className={cn(
							'fixed top-0 left-1/2 z-50 h-full max-h-full w-full max-w-full -translate-x-1/2 rounded-sm border-background-200 bg-background-100 text-background-800 scrollbar sm:top-1/2 sm:h-fit sm:max-h-[80vh] sm:max-w-512 sm:-translate-y-1/2 sm:border-2 sm:shadow-2xl md:max-w-640 lg:max-w-768 dark:border-background-800 dark:bg-background-900 dark:text-background-200 [@media(min-height:600px)]:sm:top-64 [@media(min-height:600px)]:sm:translate-y-0',
							className,
						)}
						style={{height: getMobileHeight()}}>
						<div
							onClick={e => e.stopPropagation()}
							className='grid h-full w-full grid-rows-[auto_1fr] sm:h-auto sm:max-h-[80vh]'>
							<div onPointerDown={event => dragControls.start(event)} style={{touchAction: 'none'}}>
								<div className='flex w-full justify-center py-16 sm:hidden'>
									<span className='h-4 w-32 rounded-full bg-background-400 dark:bg-background-700' />
								</div>
								{header !== 'none' && (
									<div
										className={cn(
											'flex items-center border-b border-background-200 px-16 pb-8 dark:border-background-700',
											{
												'block sm:hidden': header === 'mobile',
												'hidden sm:block': header === 'desktop',
												block: header === 'both',
											},
										)}>
										<p className='w-full text-center font-bold'>{heading}</p>
									</div>
								)}
							</div>
							<div className='overflow-y-auto'>{typeof children === 'function' ? children(handleClose) : children}</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}
