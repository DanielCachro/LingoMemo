import {IconDefinition} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Url} from 'next/dist/shared/lib/router/router'
import Link from 'next/link'

interface Props {
	icon: IconDefinition
	href: Url
}

export default function SearchOptionsLinkButton({icon, href}: Props) {
	return (
		<Link
			href={href}
			className='group flex aspect-square w-[3.25rem] items-center justify-center rounded-sm border-2 border-background-300 bg-background-50 transition-colors duration-150 hover:border-background-400 dark:border-background-700 dark:bg-background-900 dark:hover:border-background-600'>
			<FontAwesomeIcon
				icon={icon}
				className='text-background-500 transition-colors duration-150 group-hover:text-background-600 dark:text-background-400 dark:group-hover:text-background-300'
			/>
		</Link>
	)
}
