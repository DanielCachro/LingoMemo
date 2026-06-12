'use client'
import {AnimatePresence, motion} from 'motion/react'
import {usePathname} from 'next/navigation'

export default function AnimatedModalContent({children}: {children: React.ReactNode}) {
	const pathname = usePathname()

	return (
		<AnimatePresence mode='popLayout'>
			<div className='h-full overflow-hidden'>
				<motion.div
					key={pathname}
					initial={{opacity: 0, scale: 0.98, filter: 'blur(4px)'}}
					animate={{opacity: 1, scale: 1, filter: 'blur(0px)'}}
					exit={{opacity: 0, scale: 0.98, filter: 'blur(4px)'}}
					transition={{duration: 0.4, ease: [0.22, 1, 0.36, 1]}}
					className='h-full overflow-auto px-16 py-32'>
					{children}
				</motion.div>
			</div>
		</AnimatePresence>
	)
}
