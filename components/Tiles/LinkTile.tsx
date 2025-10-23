import SlabBorder from '@/components/SlabBorder'
import {faChevronRight} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import {JSX} from 'react'

interface LinkTileProps {
	icon: JSX.Element
	title: string
	href: string
}

export default function LinkTile({icon, title, href}: LinkTileProps) {
	return (
		<SlabBorder className='hover:bg-background-50 dark:hover:bg-background-800'>
			<Link
				href={href}
				className='group bold flex items-center gap-12 border-background-300 p-16 font-bold transition-colors duration-100'>
				{icon}
				<span>{title}</span>
				<FontAwesomeIcon
					icon={faChevronRight}
					className='ml-auto transition-transform duration-100 group-hover:translate-x-4'
				/>
			</Link>
		</SlabBorder>
	)
}
