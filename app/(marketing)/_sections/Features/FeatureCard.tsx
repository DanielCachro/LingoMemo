'use client'
import SlabBorder from '@/components/SlabBorder'
import {IconDefinition} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {motion} from 'motion/react'

export default function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: IconDefinition
	title: string
	description: string
}) {
	return (
		<motion.div
			initial={{opacity: 0, y: 20}}
			whileInView={{opacity: 1, y: 0}}
			viewport={{once: true, margin: '-50px'}}
			transition={{duration: 0.2}}
			whileHover={{y: -10}}
			className='group'>
			<SlabBorder
				rounded='xl'
				borderSize='sm'
				slabSize='sm'
				className='h-full p-32 dark:bg-background-800'
				wrapperClassName='h-full'>
				<div className='mb-24 inline-flex h-48 w-48 items-center justify-center rounded-xl bg-primary-100 text-primary-500 dark:bg-primary-900/50 dark:text-primary-400'>
					<FontAwesomeIcon icon={icon} />
				</div>
				<h3 className='mb-12 text-xl font-bold group-hover:text-primary-500 dark:group-hover:text-primary-600'>
					{title}
				</h3>
				<p className='text-background-600 dark:text-background-400'>{description}</p>
			</SlabBorder>
		</motion.div>
	)
}
