import {cn} from '@/lib/utils/cn'
import {Description} from '@headlessui/react'
import {HTMLAttributes} from 'react'

interface ErrorMessageProps extends HTMLAttributes<HTMLParagraphElement> {
	error?: string[] | string | null
}

export default function HeadlessErrorMessage({error, className, ...props}: ErrorMessageProps) {
	if (!error || (Array.isArray(error) && error.length === 0)) {
		return null
	}

	return (
		<Description as='p' className={cn('mt-8 text-sm text-error-500', className)} {...props}>
			{Array.isArray(error) ? error[0] : error}
		</Description>
	)
}
