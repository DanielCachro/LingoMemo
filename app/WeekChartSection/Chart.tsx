'use client'
import {getLast7Days} from '@/lib/dateRanges'
import {cn} from '@/lib/utils'
import {motion} from 'motion/react'
import {useEffect, useState} from 'react'

const barMaxHeight = 96

export default function Chart({last7Days}: {last7Days: ReturnType<typeof getLast7Days>}) {
	const maxCards = Math.max(...last7Days.map(day => day.cardsCompleted))
	const [currentDay, setCurrentDay] = useState<number>()

	useEffect(() => {
		setCurrentDay(new Date().getDate())
	}, [])

	return (
		<motion.figure
			initial='hidden'
			animate='visible'
			transition={{delayChildren: 0.7}}
			className='flex min-w-max justify-start gap-8 pr-24 sm:p-0'
			style={{direction: 'ltr'}}>
			<figcaption className='sr-only'>Chart showing the number of cards completed over the last 7 days</figcaption>
			{last7Days.map(day => {
				const height = maxCards > 0 ? ((day.cardsCompleted + 1) / maxCards) * (barMaxHeight / 16) : 1

				return (
					<motion.div
						variants={{
							hidden: {opacity: 0},
							visible: {opacity: 1},
						}}
						key={day.datetime}
						className='flex flex-col items-center gap-12'>
						<div className='flex h-full w-48 flex-col items-center justify-end gap-12'>
							<motion.data
								tabIndex={0}
								value={day.cardsCompleted}
								style={{height: `${height}rem`}}
								variants={{
									hidden: {scaleY: 0},
									visible: {scaleY: 1, transition: {delay: 0.95, type: 'tween'}},
								}}
								className={cn(
									'peer order-2 w-full origin-bottom rounded-sm bg-primary-400 transition-colors duration-100 outline-none hover:bg-primary-600 focus-visible:bg-primary-600 focus-visible:inset-ring-1 dark:bg-primary-500',
									{
										'bg-primary-600 dark:bg-primary-600': currentDay === day.day,
									},
								)}></motion.data>
							<motion.p
								className={cn(
									'order-1 text-sm opacity-0 transition-opacity duration-100 peer-hover:opacity-100 peer-focus-visible:opacity-100',
									{
										'opacity-100': currentDay === day.day,
									},
								)}>
								{day.cardsCompleted}
							</motion.p>
						</div>
						<time dateTime={day.datetime} className='text-sm'>{`${day.month} ${day.day}`}</time>
					</motion.div>
				)
			})}
		</motion.figure>
	)
}
