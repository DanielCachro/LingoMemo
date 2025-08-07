'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import clsx from 'clsx'
import {navigationItems} from '@/lib/navigationItems'

interface Props {
	link: (typeof navigationItems)[number]
}

export default function NavigationItem({link}: Props) {
	const pathname = usePathname()
	return (
		<li
			key={link.title}
			className={clsx(pathname.endsWith(link.href) && '-mr-[2px] border-r-2 text-primary-500 dark:text-primary-600')}>
			<Link href={link.href} className='flex items-center gap-8'>
				{link.icon}
				<span>{link.title}</span>
			</Link>
		</li>
	)
}
