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
				'transition-colors duration-100 hover:text-primary-500 has-focus-visible:text-primary-500 hover:dark:text-primary-600 dark:has-focus-visible:text-primary-500',
				pathname.endsWith(item.href) &&
					'-mr-[2px] border-r-2 text-primary-500 hover:text-primary-400 has-focus-visible:text-primary-400 dark:text-primary-600 dark:hover:text-primary-500 dark:has-focus-visible:text-primary-500',
				className,
			)}>
			<Link href={item.href} className='flex items-center gap-8'>
				{item.icon}
				<span>{item.title}</span>
			</Link>
		</li>
	)
}
