'use client'

import type {Transition, Variants} from 'motion/react'
import {motion} from 'motion/react'

import PrimaryButton from '@/components/PrimaryButton'
import {useRouter} from 'next/navigation'

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

export default function AnimatedCards({frontCardText}: {frontCardText?: string}) {
	const router = useRouter()
	return (
		<motion.div initial='rest' animate='rest' whileHover='hover' className='relative mx-32'>
			<motion.div
				custom={12}
				variants={variants}
				className='relative z-20 flex h-192 w-256 flex-col items-center justify-between rounded-sm bg-primary-500 py-32 dark:bg-primary-600'>
				<div className='flex w-full items-center justify-center pb-8'>
					<p className='line-clamp-3 w-full px-32 text-center wrap-break-word text-primary-50'>{frontCardText}</p>
				</div>

				<PrimaryButton
					className={
						'border-2 border-primary-700 focus-visible:border-primary-600 dark:border-primary-800 pointer-fine:hover:border-primary-800 pointer-fine:hover:dark:border-primary-900'
					}
					onClick={() => {
						router.push('/study')
					}}>
					Let’s do some cards!
				</PrimaryButton>
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
