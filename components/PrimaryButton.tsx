'use client'

import {cn} from '@/lib/utils/cn'
import {HTMLMotionProps, motion} from 'motion/react'
import Link from 'next/link'
import {isValidElement, ReactNode} from 'react'

const MotionLink = motion.create(Link)

interface BaseProps {
	children: ReactNode
	className?: string
	wrapperClassName?: string
	shadowClassName?: string
	pressed?: boolean
}

type ButtonProps = BaseProps & HTMLMotionProps<'button'> & {href?: never}
type LinkProps = BaseProps & Omit<React.ComponentPropsWithoutRef<typeof MotionLink>, 'href'> & {href: string}

export type PrimaryButtonProps = ButtonProps | LinkProps

export default function PrimaryButton({
	children,
	className,
	wrapperClassName,
	shadowClassName,
	pressed = false,
	href,
	...props
}: PrimaryButtonProps) {
	let type: 'inline' | 'icon' = 'inline'

	if (isValidElement(children)) {
		if (children.type === 'svg') {
			type = 'icon'
		} else if (typeof children.type === 'object' && 'displayName' in children.type) {
			if ((children.type as {displayName: string}).displayName === 'FontAwesomeIcon') {
				type = 'icon'
			}
		}
	}

	const sharedProps = {
		whileTap: {
			y: 3,
			boxShadow: 'none',
			transition: {duration: 0.075},
		},
		animate: pressed ? {y: 3, boxShadow: 'none'} : {y: 0},
		className: cn(
			'peer relative z-10 flex items-center justify-center h-full w-full rounded-sm bg-primary-500 font-bold text-primary-100 transition-colors duration-50 hover:cursor-pointer focus-visible:bg-primary-400 focus-visible:outline-2 focus-visible:outline-primary-200 dark:bg-primary-600 dark:text-primary-200 focus-visible:dark:bg-primary-500 focus-visible:dark:outline-primary-300 pointer-fine:hover:bg-primary-600 pointer-fine:dark:hover:bg-primary-700',
			{
				'px-16 py-12': type === 'inline',
			},
			className,
		),
	}

	return (
		<div
			className={cn(
				'relative inline-block',
				{
					'h-24 w-24': type === 'icon',
				},
				wrapperClassName,
			)}>
			{href ? (
				<MotionLink {...sharedProps} {...(props as Extract<PrimaryButtonProps, {href: string}>)} href={href}>
					{children}
				</MotionLink>
			) : (
				<motion.button type='button' {...sharedProps} {...(props as Extract<PrimaryButtonProps, {href?: never}>)}>
					{children}
				</motion.button>
			)}
			<div
				className={cn(
					'absolute top-[3px] left-0 z-0 h-full w-full rounded-sm bg-primary-700 transition-colors duration-50 peer-focus-visible:bg-primary-600 dark:bg-primary-800 pointer-fine:peer-hover:bg-primary-800 pointer-fine:dark:peer-hover:bg-primary-900',
					shadowClassName,
				)}></div>
		</div>
	)
}
