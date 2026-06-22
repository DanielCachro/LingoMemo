'use client'
import {motion} from 'motion/react'

interface StepCardProps {
	number: string
	title: string
	description: string
}

export default function StepCard({number, title, description}: StepCardProps) {
	return (
		<motion.div
			initial={{opacity: 0, scale: 0.9}}
			whileInView={{opacity: 1, scale: 1}}
			viewport={{once: true}}
			transition={{duration: 0.5}}
			whileHover='hover'
			className='text-center'>
			<motion.div
				variants={{
					hover: {y: -20},
				}}
				className='mb-24 text-7xl font-black text-background-200 dark:text-background-800'>
				{number}
			</motion.div>

			<div className='relative z-10 -mt-48 space-y-16'>
				<h3 className='text-2xl font-bold'>{title}</h3>
				<p className='text-background-600 dark:text-background-400'>{description}</p>
			</div>
		</motion.div>
	)
}
