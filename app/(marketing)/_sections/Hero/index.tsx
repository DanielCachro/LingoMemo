'use client'

import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'
import {faBrain, faGraduationCap, faStar} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {motion, stagger, useScroll, useTransform, Variants} from 'motion/react'
import {useRouter} from 'next/navigation'
import {useRef} from 'react'
import FloatingCard from './FloatingCard'

const containerVariants: Variants = {
	hidden: {opacity: 0},
	visible: {
		opacity: 1,
		transition: {
			delayChildren: stagger(0.2),
		},
	},
}

const itemVariants: Variants = {
	hidden: {opacity: 0, y: 20},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			type: 'spring',
			stiffness: 100,
			damping: 10,
		},
	},
}

export default function HeroSection() {
	const router = useRouter()
	const targetRef = useRef<HTMLDivElement>(null)
	const {scrollYProgress} = useScroll({
		target: targetRef,
		offset: ['start start', 'end start'],
	})

	const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
	const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

	return (
		<section
			ref={targetRef}
			className='relative flex min-h-[90vh] flex-col items-center justify-center overflow-x-hidden section-pattern px-24 pt-128 pb-96 text-center md:pt-192'>
			<motion.div
				style={{opacity, scale}}
				variants={containerVariants}
				initial='hidden'
				animate='visible'
				className='relative z-10 max-w-768 space-y-32'>
				<motion.div variants={itemVariants} className='mx-auto w-fit'>
					<div className='rounded-full bg-primary-100 px-16 py-8 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'>
						<FontAwesomeIcon icon={faStar} className='mr-8 text-accent-500' />
						The smarter way to learn vocabulary
					</div>
				</motion.div>

				<motion.h1 variants={itemVariants} className='text-5xl leading-tight font-black md:text-7xl'>
					Master any language <br />
					<span className='text-primary-500 dark:text-primary-600'>effortlessly.</span>
				</motion.h1>

				<motion.p variants={itemVariants} className='text-lg text-background-600 md:text-xl dark:text-background-300'>
					Create custom flashcards, track your progress, and let our spaced repetition algorithm handle the rest.
				</motion.p>

				<motion.div variants={itemVariants} className='flex flex-col items-center justify-center gap-16 sm:flex-row'>
					<PrimaryButton onClick={() => router.push('/auth/signin')} className='h-64 px-32 text-lg'>
						Start Learning Now
					</PrimaryButton>
					<SecondaryButton
						onClick={() => {
							document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})
						}}
						className='h-64 px-32 text-lg'>
						Explore Features
					</SecondaryButton>
				</motion.div>
			</motion.div>

			<motion.div
				initial={{opacity: 0, x: -100}}
				animate={{opacity: 1, x: 0}}
				transition={{delay: 0.5, duration: 0.8}}
				className='absolute top-1/3 left-48 hidden xl:block'>
				<FloatingCard
					icon={faGraduationCap}
					title='Mastery'
					color='text-primary-500 dark:text-primary-600'
					rotate={-6}
				/>
			</motion.div>
			<motion.div
				initial={{opacity: 0, x: 100}}
				animate={{opacity: 1, x: 0}}
				transition={{delay: 0.7, duration: 0.8}}
				className='absolute top-1/4 right-48 hidden xl:block'>
				<FloatingCard icon={faBrain} title='Growth' color='text-accent-500' rotate={6} />
			</motion.div>
		</section>
	)
}
