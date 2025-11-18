import {cn} from '@/lib/utils'
import {Textarea as HeadlessTextarea, TextareaProps} from '@headlessui/react'
import ErrorMessage from './ErrorMessage'

interface Props extends TextareaProps {
	className?: string
	error?: boolean
	errorMessage?: string
}

export default function Textarea({error, errorMessage, className, ...props}: Props) {
	return (
		<div>
			<HeadlessTextarea
				className={cn(
					'w-full rounded-sm border-2 border-background-300 bg-background-50 px-16 py-16 text-base placeholder-background-400 placeholder:font-medium focus-within:border-background-400 focus:outline-none dark:border-background-700 dark:bg-background-900 dark:focus-within:border-background-600',
					{
						'border-error-400 dark:border-error-700': error,
					},
					className,
				)}
				{...props}
			/>
			{errorMessage && <ErrorMessage error={errorMessage} />}
		</div>
	)
}
