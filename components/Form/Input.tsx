import {cn} from '@/lib/utils'
import {Input as HeadlessInput, InputProps} from '@headlessui/react'

interface Props extends InputProps {
	className?: string
	error?: boolean
}

export default function Input({error, className, ...props}: Props) {
	return (
		<HeadlessInput
			className={cn(
				'w-full rounded-sm border-2 border-background-300 bg-background-200 px-16 py-16 placeholder-background-500 focus-within:border-background-400 focus:outline-none dark:border-background-700 dark:bg-background-800 dark:focus-within:border-background-600',
				{
					'border-error-400 dark:border-error-700': error,
				},
				className,
			)}
			{...props}
		/>
	)
}
