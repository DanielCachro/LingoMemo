'use client'

import {useMediaQuery} from '@/hooks/useMediaQuery'
import {cn} from '@/lib/utils/cn'
import {AnimatePresence, motion, useAnimationControls, useDragControls} from 'motion/react'
import {usePathname} from 'next/navigation'
import {CSSProperties, PointerEvent, ReactNode, useCallback, useEffect, useRef, useState} from 'react'

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

type ModalSkeletonProps = Partial<Pick<ModalProps, 'header' | 'heading'>> &
	Pick<ModalProps, 'mobileScreenCoverage' | 'className' | 'disableAnimations'> & {
		children: ReactNode
	}

const BACKDROP_BASE_CLASSES = 'fixed m-0 inset-0 z-50 bg-background-950/60 '
const MODAL_BASE_CLASSES = cn(
	'fixed inset-x-0 z-50 mx-auto w-full max-w-full rounded-sm border-background-200 bg-background-100 text-background-800 scrollbar dark:border-background-800 dark:bg-background-900 dark:text-background-200',
	'sm:inset-y-0 sm:my-auto sm:h-fit sm:max-h-[80vh] sm:max-w-512 sm:border-2 sm:shadow-2xl md:max-w-640 lg:max-w-768',
	'[@media(min-height:600px)]:sm:top-64 [@media(min-height:600px)]:sm:bottom-auto [@media(min-height:600px)]:sm:my-0',
)

const getMobileDimensions = (coverage: string) => {
	if (coverage === 'full') return {height: '100%', top: '0px'}
	const [numerator, denominator] = coverage.split('/').map(Number)
	return {
		height: `${(numerator / denominator) * 100}dvh`,
		top: `${((denominator - numerator) / denominator) * 100}dvh`,
	}
}

function ModalHeaderLayout({
	header,
	heading,
	onPointerDown,
}: {
	header: ModalProps['header']
	heading: string
	onPointerDown?: (e: PointerEvent<HTMLDivElement>) => void
}) {
	return (
		<div onPointerDown={onPointerDown} style={onPointerDown ? {touchAction: 'none'} : undefined}>
			<div className='flex w-full justify-center py-16 sm:hidden'>
				<span className='h-4 w-32 rounded-full bg-background-400 dark:bg-background-700' />
			</div>
			{header !== 'none' && (
				<div
					className={cn('flex items-center border-b border-background-200 px-16 pb-8 dark:border-background-700', {
						'block sm:hidden': header === 'mobile',
						'hidden sm:block': header === 'desktop',
						block: header === 'both',
					})}>
					<p className='w-full text-center font-bold'>{heading}</p>
				</div>
			)}
		</div>
	)
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
	const modalRef = useRef<HTMLDivElement>(null)
	const [isOpen, setIsOpen] = useState(true)
	const [isExiting, setIsExiting] = useState(false)
	const [modalNavCount, setModalNavCount] = useState(process.env.NODE_ENV === 'development' ? -1 : 0)

	const isDesktop = useMediaQuery('(min-width: 40rem)')
	const animationControls = useAnimationControls()
	const dragControls = useDragControls()

	const shouldAnimateEntry = !disableAnimations?.disableEntryAnimation
	const shouldAnimateExit = !disableAnimations?.disableExitAnimation

	const handleClose = useCallback(() => {
		setIsExiting(true)
		setIsOpen(false)
	}, [])

	// Close on Escape key press
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

	// Body scroll lock
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen])

	// Focus trap
	useEffect(() => {
		const modalElement = modalRef.current
		if (!isOpen || !modalElement) return

		const getFocusableElements = () => {
			const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			return modalElement.querySelectorAll<HTMLElement>(focusableSelectors)
		}

		// Small delay to allow Next.js 16 routes and framer-motion to render/animate new elements
		const focusTimer = setTimeout(() => {
			const focusableElements = getFocusableElements()

			if (focusableElements.length === 0) {
				modalElement.focus()
				return
			}

			// Only auto-focus if focus is currently lost or outside the modal
			if (!modalElement.contains(document.activeElement)) {
				focusableElements[0].focus()
			}
		}, 100)

		// Loop focus within the modal
		const handleTabKey = (event: KeyboardEvent) => {
			if (event.key !== 'Tab') return

			const focusableElements = getFocusableElements()
			if (focusableElements.length === 0) return

			const firstElement = focusableElements[0]
			const lastElement = focusableElements[focusableElements.length - 1]

			// Shift + Tab
			if (event.shiftKey) {
				if (document.activeElement === firstElement || document.activeElement === modalElement) {
					event.preventDefault()
					lastElement.focus()
				}
			}
			// Regular Tab
			else {
				if (document.activeElement === lastElement) {
					event.preventDefault()
					firstElement.focus()
				}
			}
		}

		document.addEventListener('keydown', handleTabKey)
		return () => {
			document.removeEventListener('keydown', handleTabKey)
			clearTimeout(focusTimer)
		}
	}, [isOpen, pathname])

	// In Next.js 16, intercepted routes and modals are not unmounted on navigation.
	// Instead, they are hidden using the <Activity> API (kept in the DOM with display: none).
	// This cleanup function triggers right before the component goes to sleep.
	// By resetting the state here, we guarantee that when the user opens the modal again,
	// it wakes up with a fresh state and renders properly.
	useEffect(() => {
		return () => {
			setIsOpen(true)
			setIsExiting(false)
			setModalNavCount(0)
		}
	}, [])

	// Drag to close logic for mobile
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function onDragEnd(_event: any, info: {offset: {y: number}; velocity: {y: number}}) {
		if (typeof window === 'undefined') return

		const closeThreshold = window.innerHeight * 0.15
		const offsetY = info.offset.y
		const velocityY = info.velocity.y

		if (offsetY > closeThreshold || velocityY > 800) {
			handleClose()
		} else {
			animationControls.start({y: 0})
		}
	}

	// Trigger entry animation when modal opens
	useEffect(() => {
		if (isOpen) {
			animationControls.set({scale: 1, opacity: 1, y: 0})
		}
	}, [isOpen, animationControls])

	// Track navigation events to determine how many times the user has navigated while the modal is open (for proper back navigation on close)
	useEffect(() => {
		setModalNavCount(prevCount => prevCount + 1)
	}, [pathname])

	const {height: mobileHeight, top: mobileTop} = getMobileDimensions(mobileScreenCoverage)

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
						initial={false}
						animate={{opacity: 1}}
						exit={shouldAnimateExit ? {opacity: 0} : {opacity: 1, transition: {duration: 0}}}
						className={cn(BACKDROP_BASE_CLASSES, shouldAnimateEntry && !isExiting && 'modal-backdrop-entry')}
						onClick={handleClose}
					/>
					<motion.div
						ref={modalRef}
						tabIndex={-1} // Allow progammatic focus for focus trap
						aria-label={heading}
						onDragEnd={onDragEnd}
						initial={false}
						animate={animationControls}
						role='dialog'
						aria-modal='true'
						exit={
							shouldAnimateExit
								? isDesktop
									? {scale: 0.95, opacity: 0, y: 0}
									: {y: '100vh'}
								: {transition: {duration: 0}}
						}
						transition={{type: 'tween', ease: 'easeInOut', duration: isDesktop ? 0.2 : 0.3}}
						drag={isDesktop ? false : 'y'}
						dragListener={false}
						dragControls={dragControls}
						dragConstraints={{top: 0}}
						dragElastic={{top: 0, bottom: 0.6}}
						className={cn(
							MODAL_BASE_CLASSES,
							'top-(--mobile-top) h-(--mobile-height)',
							shouldAnimateEntry && !isExiting && 'modal-content-entry',
							className,
						)}
						style={
							{
								'--mobile-height': mobileHeight,
								'--mobile-top': mobileTop,
							} as CSSProperties
						}>
						<div
							onClick={e => e.stopPropagation()}
							className='grid h-full w-full grid-rows-[auto_1fr] sm:h-auto sm:max-h-[80vh]'>
							<ModalHeaderLayout header={header} heading={heading} onPointerDown={event => dragControls.start(event)} />
							<div className='overflow-y-auto'>{typeof children === 'function' ? children(handleClose) : children}</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}

export function ModalSkeleton({
	header = 'none',
	heading = '',
	children,
	mobileScreenCoverage = 'full',
	className,
	disableAnimations,
}: ModalSkeletonProps) {
	const shouldAnimate = !disableAnimations?.disableEntryAnimation
	const {height: mobileHeight, top: mobileTop} = getMobileDimensions(mobileScreenCoverage)

	return (
		<>
			<div
				className={cn(BACKDROP_BASE_CLASSES, shouldAnimate && 'modal-backdrop-entry [animation-fill-mode:forwards]')}
			/>

			<div
				className={cn(
					MODAL_BASE_CLASSES,
					'top-(--mobile-top) h-(--mobile-height)',
					shouldAnimate && 'modal-content-entry [animation-fill-mode:forwards]',
					className,
				)}
				style={
					{
						'--mobile-height': mobileHeight,
						'--mobile-top': mobileTop,
					} as CSSProperties
				}>
				<div className='grid h-full w-full grid-rows-[auto_1fr] sm:h-auto sm:max-h-[80vh]'>
					<ModalHeaderLayout header={header} heading={heading} />
					<div className='overflow-y-auto'>{children}</div>
				</div>
			</div>
		</>
	)
}
