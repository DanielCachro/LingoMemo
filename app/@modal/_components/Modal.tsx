'use client'

import {useMediaQuery} from '@/hooks/useMediaQuery'
import {cn} from '@/lib/utils'
import {AnimatePresence, motion, useAnimationControls} from 'motion/react'
import {useSelectedLayoutSegments} from 'next/navigation'
import {useEffect, useRef, useState} from 'react'
import {createPortal} from 'react-dom'

interface ModalWithHeader {
	header: 'mobile' | 'desktop' | 'both' | 'none'
	heading: string
	children: React.ReactNode
	className?: string
}

export default function Modal({children, header, heading, className}: ModalWithHeader) {
	const OPEN = 0
	const CLOSED = () => window.innerHeight * 1.5
	const dialogRef = useRef<HTMLDialogElement>(null)
	const [isOpen, setIsOpen] = useState(true)
	const isDesktop = useMediaQuery('(min-width: 40rem)')
	const controls = useAnimationControls()
	const selectedSegments = useSelectedLayoutSegments()

	const animations = isDesktop
		? {initial: {scale: 0.95, opacity: 0}, animate: {scale: 1, opacity: 1}, exit: {scale: 0.95, opacity: 0}}
		: {initial: {y: CLOSED()}, animate: {y: OPEN}, exit: {y: CLOSED()}}

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
			controls.start({y: OPEN})
		}
	}

	useEffect(() => {
		if (isOpen) {
			dialogRef.current?.showModal()
			controls.start(animations.animate)
		}
	}, [isOpen, controls, animations.animate])

	return createPortal(
		<AnimatePresence
			onExitComplete={() => {
				// Close as many segments as are open in the modal
				// Handling it this way because the router.push() function causes hard navigation, which results in slow closing of modal window and a poor user experience.
				const segmentsToClose = selectedSegments.length + 1
				window.history.go(-segmentsToClose)
			}}>
			{isOpen && (
				<motion.dialog
					ref={dialogRef}
					aria-label={heading}
					onClose={handleClose}
					onClick={handleClose}
					onDragEnd={onDragEnd}
					initial={animations.initial}
					animate={controls}
					exit={animations.exit}
					transition={{type: 'tween', ease: 'easeOut', duration: isDesktop ? 0.2 : 0.3}}
					drag={isDesktop ? false : 'y'}
					className={cn(
						'top-1/2 bottom-0 left-1/2 h-full max-h-full w-full max-w-full -translate-x-1/2 -translate-y-1/2 rounded-sm bg-background-100 text-background-800 sm:top-1/5 sm:h-fit sm:max-w-512 md:max-w-640 lg:max-w-768 dark:bg-background-900 dark:text-background-200',
						className,
					)}>
					<div onClick={e => e.stopPropagation()} className='h-full w-full'>
						<div className='flex w-full justify-center py-8 sm:hidden'>
							<span className='h-4 w-32 rounded-full bg-background-400 dark:bg-background-700' />
						</div>
						{header !== 'none' && (
							<div
								className={cn(
									'flex items-center border-b-[1px] border-background-200 px-16 py-8 dark:border-background-700',
									{
										'block sm:hidden': header === 'mobile',
										'hidden sm:block': header === 'desktop',
										block: header === 'both',
									},
								)}>
								<p className='w-full text-center font-bold'>{heading}</p>
							</div>
						)}
						<div className='px-16 py-32'>{children}</div>
					</div>
				</motion.dialog>
			)}
		</AnimatePresence>,
		document.getElementById('modal-root') as HTMLElement,
	)
}
