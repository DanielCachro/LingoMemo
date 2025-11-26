import SlabBorder from '@/components/SlabBorder'
import {IconDefinition} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {motion} from 'motion/react'

export default function FloatingCard({
	icon,
	title,
	color,
	rotate,
}: {
	icon: IconDefinition
	title: string
	color: string
	rotate: number
}) {
	return (
		<motion.div
			animate={{y: [0, -10, 0]}}
			transition={{repeat: Infinity, duration: 4, ease: 'easeInOut'}}
			style={{rotate}}
			className='w-192'
			aria-hidden='true'>
			<SlabBorder rounded='lg' borderSize='sm' slabSize='md' className='p-16'>
				<div className='flex items-center gap-12'>
					<div
						className={`flex h-48 w-48 items-center justify-center rounded-lg bg-background-300 dark:bg-background-700 ${color}`}>
						<FontAwesomeIcon icon={icon} />
					</div>
					<div className='font-bold'>{title}</div>
				</div>
				<div className='mt-12 space-y-8'>
					<div className='h-8 w-3/4 rounded-full bg-background-300 dark:bg-background-700' />
					<div className='h-8 w-1/2 rounded-full bg-background-300 dark:bg-background-700' />
				</div>
			</SlabBorder>
		</motion.div>
	)
}
