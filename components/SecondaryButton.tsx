import {cn} from '@/lib/utils'
import {HTMLMotionProps} from 'motion/react'
import {ReactNode} from 'react'
import PrimaryButton from './PrimaryButton'

interface Props extends HTMLMotionProps<'button'> {
	children: ReactNode
	className?: string
	wrapperClassName?: string
	shadowClassName?: string
	pressed?: boolean
}

export default function SecondaryButton({children, className, wrapperClassName, shadowClassName, pressed = false, ...props}: Props) {
	return (
		<PrimaryButton
			{...props}
			pressed={pressed}
			wrapperClassName={wrapperClassName}
			className={cn(
				'border-2 border-background-300 bg-background-100 px-[0.875rem] py-[0.625rem] text-primary-500 ring-inset focus-visible:bg-background-200 focus-visible:outline-background-400 dark:border-background-700 dark:bg-background-900 dark:text-primary-600 dark:focus-visible:bg-background-800 dark:focus-visible:outline-background-500 pointer-fine:hover:border-background-400 pointer-fine:hover:bg-background-200 dark:pointer-fine:hover:border-background-600 dark:pointer-fine:hover:bg-background-800',
				className,
			)}
			shadowClassName={cn(
				'bg-background-300 pointer-fine:peer-hover:bg-background-400 dark:pointer-fine:peer-hover:bg-background-600 peer-focus-visible:bg-background-300 dark:peer-focus-visible:bg-background-700 dark:bg-background-700',
				shadowClassName,
			)}>
			{children}
		</PrimaryButton>
	)
}
