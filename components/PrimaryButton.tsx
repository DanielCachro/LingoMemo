'use client'

import {JSX} from 'react'
import {motion} from 'motion/react'
import {clsx} from 'clsx'

interface Props {
	content: string | JSX.Element
}

export default function PrimaryButton({content}: Props) {
	return (
		<div className={clsx('relative inline-block', typeof content === 'string' ? 'px-16 py-12' : 'h-24 w-24')}>
			<motion.button
				whileTap={{
					y: 3,
					boxShadow: 'none',
					transition: {duration: 0.075},
				}}
				className='h-full w-full bg-primary-500 text-primary-100 font-bold relative z-10 rounded-sm dark:bg-primary-600 dark:text-primary-200 hover:cursor-pointer'>
				{content}
			</motion.button>
			<div className='absolute h-full w-full top-[3px] left-0 z-0 bg-primary-700 dark:bg-primary-800 rounded-sm'></div>
		</div>
	)
}
