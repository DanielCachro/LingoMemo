'use client'
import {cn} from '@/lib/utils'
import {faChevronRight} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import {useSelectedLayoutSegments} from 'next/navigation'

interface BreadcrumbsProps {
	variant?: 'light' | 'bordered'
	rootSegment?: string
	className?: string
}

export default function Breadcrumbs({variant = 'light', rootSegment, className}: BreadcrumbsProps) {
	const layoutSegments = useSelectedLayoutSegments()
	const breadcrumbsSegments = rootSegment ? [rootSegment, ...layoutSegments] : layoutSegments
	const segments = breadcrumbsSegments.map((segment, index) => {
		const removedHyphens = segment.replace(/-/g, ' ')
		const formatted = removedHyphens
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')

		const href = `/${breadcrumbsSegments.slice(0, index + 1).join('/')}`

		return {formatted, href}
	})

	return (
		<nav
			aria-label='breadcrumbs'
			className={cn(
				'w-fit max-w-full text-sm',
				{
					'rounded-sm border-[1px] border-background-300 px-8 py-4 dark:border-background-700': variant === 'bordered',
				},
				className,
			)}>
			<ol className='flex flex-wrap'>
				{segments.map((segment, index) => (
					<li className='flex' key={`${index}-${segment}`}>
						<Link
							href={segment.href}
							className='pointer-coarse:active:text-background-600 pointer-coarse:dark:active:text-background-300 pointer-fine:hover:text-background-600 pointer-fine:dark:hover:text-background-300'>
							{segment.formatted}
						</Link>
						{index < segments.length - 1 && (
							<FontAwesomeIcon
								icon={faChevronRight}
								size='xs'
								transform='shrink-2'
								className='self-center px-4 text-background-300 dark:text-background-600'
							/>
						)}
					</li>
				))}
			</ol>
		</nav>
	)
}
