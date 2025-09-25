'use client'
import {IconDefinition} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {clsx} from 'clsx'

export default function Statistic({
	icon,
	record,
	measure,
	className,
	...props
}: {
	icon: IconDefinition
	record: string
	measure: string
	className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={clsx('flex items-center gap-8 text-primary-100 dark:text-primary-200', className)} {...props}>
			<FontAwesomeIcon icon={icon} className='text-3xl' />
			<p className='flex flex-col font-bold'>
				{record}
				<span className='font-medium text-primary-300 dark:text-primary-400'>{measure}</span>
			</p>
		</div>
	)
}
