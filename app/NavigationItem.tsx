'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {cn} from '@/lib/utils'
import {navigationItems} from '@/lib/navigationItems'

interface NavigationItemProps {
	className?: string
	item: (typeof navigationItems)[number]
}

export default function NavigationItem({className, item}: NavigationItemProps) {
	const pathname = usePathname()
	return (
		<li
			key={item.title}
			className={cn(
				pathname.endsWith(item.href) && '-mr-[2px] border-r-2 text-primary-500 dark:text-primary-600',
				className
			)}>
			<Link href={item.href} className='flex items-center gap-8'>
				{item.icon}
				<span>{item.title}</span>
			</Link>
		</li>
	)
}
