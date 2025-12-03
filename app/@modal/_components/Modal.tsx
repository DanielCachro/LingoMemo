'use client'

import {useMediaQuery} from '@/hooks/useMediaQuery'
import {cn} from '@/lib/utils'
import {AnimatePresence, motion, useAnimationControls, useDragControls} from 'motion/react'
import {usePathname} from 'next/navigation'
import {ReactNode, useEffect, useState} from 'react'
import {createPortal} from 'react-dom'

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
	const OPEN = () => {
		if (mobileScreenCoverage === 'full') return 0
		const heightRatioParts = mobileScreenCoverage.split('/')
		const [numerator, denominator] = heightRatioParts.map(Number)
		return window.innerHeight * ((denominator - numerator) / denominator)
	}
	const CLOSED = () => window.innerHeight * 1.5
	const [isOpen, setIsOpen] = useState(true)
	const [modalNavCount, setModalNavCount] = useState(process.env.NODE_ENV === 'development' ? -1 : 0)
	const pathname = usePathname()
	const isDesktop = useMediaQuery('(min-width: 40rem)')
	const animationControls = useAnimationControls()
	const dragControls = useDragControls()
	const shouldAnimateEntry = !disableAnimations?.disableEntryAnimation
	const shouldAnimateExit = !disableAnimations?.disableExitAnimation

	const animations = isDesktop
		? {
				initial: shouldAnimateEntry ? {scale: 0.95, opacity: 0} : {scale: 1, opacity: 1},
				animate: {scale: 1, opacity: 1},
				exit: shouldAnimateExit ? {scale: 0.95, opacity: 0} : {scale: 1, opacity: 1, transition: {duration: 0}},
			}
		: {
				initial: shouldAnimateEntry ? {y: CLOSED()} : {y: OPEN()},
				animate: {y: OPEN()},
				exit: shouldAnimateExit ? {y: CLOSED()} : {y: OPEN(), transition: {duration: 0}},
			}

	const backdropAnimations = {
		initial: shouldAnimateEntry ? {opacity: 0} : {opacity: 1},
		animate: {opacity: 1},
		exit: shouldAnimateExit ? {opacity: 0} : {opacity: 1, transition: {duration: 0}},
	}

	function handleClose() {
		setIsOpen(false)
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function onDragEnd(_event: any, info: {offset: {y: number}; velocity: {y: number}}) {
		const closeThreshold = window.innerHeight * 0.15
		const offsetY = info.offset.y
		const velocityY = info.velocity.y

		if (offsetY > closeThreshold || velocityY > 800) {
			handleClose()
		} else {
			animationControls.start({y: OPEN()})
		}
	}

	useEffect(() => {
		if (isOpen) {
			animationControls.start(animations.animate)
		}
	}, [isOpen, animationControls, animations.animate])

	useEffect(() => {
		// Count how many navigations have occurred within the modal
		setModalNavCount(prevCount => prevCount + 1)
	}, [pathname])

	return createPortal(
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
						transition={{type: 'tween', ease: 'easeOut', duration: isDesktop ? 0.2 : 0.3}}
						drag={isDesktop ? false : 'y'}
						dragListener={false}
						dragControls={dragControls}
						className={cn(
							'fixed left-1/2 z-50 h-full max-h-full w-full max-w-full -translate-x-1/2 rounded-sm border-background-200 bg-background-100 text-background-800 scrollbar sm:top-64 sm:h-fit sm:max-w-512 sm:translate-y-0 sm:border-2 sm:shadow-2xl md:max-w-640 lg:max-w-768 dark:border-background-800 dark:bg-background-900 dark:text-background-200',
							className,
						)}
						style={
							!isDesktop && mobileScreenCoverage !== 'full'
								? {
										height: `${window.innerHeight * (Number(mobileScreenCoverage.split('/')[0]) / Number(mobileScreenCoverage.split('/')[1]))}px`,
									}
								: {}
						}>
						<div onClick={e => e.stopPropagation()} className='grid h-full w-full grid-rows-[auto_1fr] sm:max-h-768'>
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
		</AnimatePresence>,
		document.getElementById('modal-root') as HTMLElement,
	)
}
