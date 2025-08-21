'use client'

import {clsx} from 'clsx'
import {motion} from 'motion/react'
import {JSX, isValidElement} from 'react'

interface Props {
	content: string | JSX.Element
	className?: string
	wrapperClassName?: string
	shadowClassName?: string
}

export default function PrimaryButton({content, className, wrapperClassName, shadowClassName}: Props) {
	let type: string = ''

	if (isValidElement(content) && content.type === 'svg') {
		type = 'icon'
	} else {
		type = 'inline'
	}

	return (
		<div
			className={clsx(
				'relative inline-block',
				{
					'h-24 w-24': type === 'icon',
				},
				wrapperClassName,
			)}>
			<motion.button
				whileTap={{
					y: 3,
					boxShadow: 'none',
					transition: {duration: 0.075},
				}}
				className={clsx(
					'peer relative z-10 h-full w-full rounded-sm bg-primary-500 font-bold text-primary-100 transition-colors duration-50 hover:cursor-pointer focus-visible:bg-primary-400 focus-visible:outline-2 focus-visible:outline-primary-200 dark:bg-primary-600 dark:text-primary-200 focus-visible:dark:bg-primary-500 focus-visible:dark:outline-primary-300 pointer-fine:hover:bg-primary-600 pointer-fine:dark:hover:bg-primary-700',
					{
						'px-16 py-12': type === 'inline',
					},
					className,
				)}>
				{content}
			</motion.button>
			<div
				className={clsx(
					'absolute top-[3px] left-0 z-0 h-full w-full rounded-sm bg-primary-700 transition-colors duration-50 peer-focus-visible:bg-primary-600 dark:bg-primary-800 pointer-fine:peer-hover:bg-primary-800 pointer-fine:dark:peer-hover:bg-primary-900',
					shadowClassName,
				)}></div>
		</div>
	)
}
