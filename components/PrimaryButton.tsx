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
				className='relative z-10 h-full w-full rounded-sm bg-primary-500 font-bold text-primary-100 transition-colors duration-50 hover:cursor-pointer hover:bg-primary-400 focus-visible:bg-primary-400 focus-visible:outline-2 focus-visible:outline-primary-200 dark:bg-primary-600 dark:text-primary-200 dark:hover:bg-primary-500 dark:focus-visible:outline-primary-500'>
				{content}
			</motion.button>
			<div className='absolute top-[3px] left-0 z-0 h-full w-full rounded-sm bg-primary-700 transition-colors duration-50 peer-hover:bg-primary-600 peer-focus:bg-primary-600 dark:bg-primary-800 dark:peer-hover:bg-primary-700'></div>
		</div>
	)
}
