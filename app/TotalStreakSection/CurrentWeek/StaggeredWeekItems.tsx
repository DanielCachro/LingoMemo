'use client'

import {getCurrentWeekDays} from '@/lib/dateRanges'
import {cn} from '@/lib/utils'
import {motion, stagger} from 'motion/react'
import {useEffect, useState} from 'react'

function AnimatedCheck() {
	// Icon Copyright
	// Copyright (c) 2013-2023 Cole Bemis

	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to deal
	// in the Software without restriction, including without limitation the rights
	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:

	// The above copyright notice and this permission notice shall be included in all
	// copies or substantial portions of the Software.
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<motion.polyline
				initial={{pathLength: 0, opacity: 0}}
				animate={{pathLength: 1, opacity: 1}}
				transition={{type: 'spring', duration: 1.5, delay: 0.3}}
				points='20 6 9 17 4 12'></motion.polyline>
		</svg>
	)
}

interface Props {
	currentWeekDays: ReturnType<typeof getCurrentWeekDays>
}

export default function StaggeredWeekItems({currentWeekDays}: Props) {
	const [currentDay, setCurrentDay] = useState<number>(0)

	useEffect(() => {
		setCurrentDay(new Date().getDate())
	}, [])

	return (
		<motion.ul initial='hidden' animate='visible' transition={{delayChildren: stagger(0.1)}} className='flex gap-8'>
			{currentWeekDays.map(({day, dayLabel, datetime, completed}) => (
				<motion.li
					variants={{
						hidden: {opacity: 0, y: 20},
						visible: {opacity: 1, y: 0},
					}}
					key={`${day}-${dayLabel}`}
					className={cn('space-y-16 text-center text-sm text-background-400 dark:text-background-600', {
						'text-background-800 dark:text-background-200': currentDay === day,
					})}>
					<p>
						<time dateTime={datetime}>{dayLabel}</time>
					</p>
					<motion.p
						variants={{
							hidden: {rotate: -160, scale: 0.5},
							visible: {rotate: 0, scale: 1},
						}}
						transition={{type: 'spring'}}
						className={cn('flex size-32 items-center justify-center font-bold', {
							'rounded-full bg-primary-500 text-primary-50 dark:bg-primary-600': completed,
						})}>
						<time dateTime={datetime}>{completed ? <AnimatedCheck /> : day}</time>
					</motion.p>
				</motion.li>
			))}
		</motion.ul>
	)
}
