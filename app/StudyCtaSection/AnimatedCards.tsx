'use client'

import type {Transition, Variants} from 'motion/react'
import {motion} from 'motion/react'

import PrimaryButton from '@/components/PrimaryButton'

const transition: Transition = {
	type: 'spring',
	stiffness: 400,
	damping: 15,
}

const variants: Variants = {
	rest: {
		right: 0,
		bottom: 0,
		transition: transition,
	},
	hover: custom => ({
		right: `${custom / 16}rem`,
		bottom: `${custom / 16}rem`,
		transition: transition,
	}),
}

export default function AnimatedCards() {
	return (
		<motion.div initial='rest' animate='rest' whileHover='hover' className='relative'>
			<motion.div
				custom={12}
				variants={variants}
				className='relative z-20 flex h-192 w-256 flex-col items-center justify-between rounded-sm bg-primary-500 py-32 dark:bg-primary-600'>
				<p className='flex h-full items-center text-primary-50 uppercase'>pilny</p>

				{PrimaryButton ? (
					<PrimaryButton
						content='Let’s do some cards!'
						className={
							'border-2 border-primary-700 hover:border-primary-600 hover:bg-primary-500 focus-visible:border-primary-600 dark:border-primary-800 hover:dark:border-primary-700 hover:dark:bg-primary-600'
						}
					/>
				) : (
					<button className='rounded py-6 border-2 border-primary-700 px-12 hover:border-primary-600 hover:bg-primary-500 focus-visible:border-primary-600 dark:border-primary-800 hover:dark:border-primary-700 hover:dark:bg-primary-600'>
						Let’s do some cards!
					</button>
				)}
			</motion.div>

			<motion.div
				custom={6}
				variants={variants}
				className={
					'pointer-events-none absolute z-10 h-192 w-[calc(theme(--spacing-256)-theme(--spacing-4))] origin-bottom-right rounded-sm bg-primary-400 dark:bg-primary-500'
				}
				aria-hidden
			/>
			<motion.div
				custom={0}
				variants={variants}
				className={
					'pointer-events-none absolute z-0 h-192 w-[calc(theme(--spacing-256)-theme(--spacing-8))] origin-bottom-right rounded-sm bg-primary-300 dark:bg-primary-400'
				}
				aria-hidden
			/>
		</motion.div>
	)
}
