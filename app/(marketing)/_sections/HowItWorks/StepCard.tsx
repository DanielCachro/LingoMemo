'use client'
import {motion} from 'motion/react'

export default function StepCard({number, title, description}: {number: string; title: string; description: string}) {
	return (
		<motion.div
			initial={{opacity: 0, scale: 0.9}}
			whileInView={{opacity: 1, scale: 1}}
			viewport={{once: true}}
			transition={{duration: 0.5}}
			className='text-center'>
			<div className='mb-24 text-7xl font-black text-background-200 dark:text-background-800'>{number}</div>
			<div className='-mt-48 space-y-16'>
				<h3 className='text-2xl font-bold'>{title}</h3>
				<p className='text-background-600 dark:text-background-400'>{description}</p>
			</div>
		</motion.div>
	)
}
