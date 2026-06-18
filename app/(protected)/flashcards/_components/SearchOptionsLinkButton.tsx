import {cn} from '@/lib/utils/cn'
import {IconDefinition} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Url} from 'next/dist/shared/lib/router/router'
import Link from 'next/link'

interface Props {
	icon: IconDefinition
	href: Url
	isActive?: boolean
}

export default function SearchOptionsLinkButton({icon, href, isActive = false}: Props) {
	return (
		<Link
			href={href}
			className={cn(
				'group flex aspect-square w-[3.25rem] items-center justify-center rounded-sm border-2 border-background-300 bg-background-50 transition-colors duration-150 hover:border-background-400 focus:outline-none focus-visible:border-background-400 dark:border-background-700 dark:bg-background-900 dark:hover:border-background-600 dark:focus-visible:border-background-600',
				{
					'border-primary-500 bg-primary-100 hover:border-primary-400 dark:border-primary-500 dark:bg-primary-700 dark:hover:border-primary-400':
						isActive,
				},
			)}>
			<FontAwesomeIcon
				icon={icon}
				className={cn(
					'text-background-500 transition-colors duration-150 group-hover:text-background-600 dark:text-background-400 dark:group-hover:text-background-300',
					{
						'text-primary-500 group-hover:text-primary-400 dark:text-primary-100 dark:group-hover:text-primary-50':
							isActive,
					},
				)}
			/>
		</Link>
	)
}
