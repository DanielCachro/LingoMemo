import {faChevronRight} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import {JSX} from 'react'

interface LinkTileProps {
	title: string
	icon: JSX.Element
	href: string
}

export default function LinkTile({title, icon, href}: LinkTileProps) {
	return (
		<div className='relative'>
			<Link
				href={href}
				className='group bold relative z-10 flex items-center gap-12 rounded-sm border-2 border-background-300 bg-background-100 p-16 font-bold transition-colors duration-100 hover:bg-background-50 dark:border-background-700 dark:bg-background-900 dark:hover:bg-background-800'>
				{icon}
				<span>{title}</span>
				<FontAwesomeIcon
					icon={faChevronRight}
					className='ml-auto transition-transform duration-100 group-hover:translate-x-4'
				/>
			</Link>
			<div className='absolute top-[2px] left-0 z-0 h-full w-full rounded-sm bg-background-300 transition-colors duration-50 dark:bg-background-700'></div>
		</div>
	)
}


