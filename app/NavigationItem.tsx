'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {motion} from 'motion/react'
import {cn} from '@/lib/utils'
import {navigationItems} from '@/lib/navigationItems'

interface Props {
	className?: string
	activeItemClassName?: string
	indicatorClassName?: string
	item: (typeof navigationItems)[number]
	indicatorLayoutId?: string
	indicatorPosition?: 'top' | 'right' | 'bottom' | 'left'
}

export default function NavigationItem({
	className,
	activeItemClassName,
	item,
	indicatorLayoutId,
	indicatorClassName,
	indicatorPosition = 'top',
}: Props) {
	const pathname = usePathname()
	return (
		<li
			className={cn(
				'relative transition-colors duration-100 hover:text-primary-500 has-focus-visible:text-primary-500 hover:dark:text-primary-600 dark:has-focus-visible:text-primary-500',
				pathname.endsWith(item.href) &&
					cn(
						'text-primary-500 hover:text-primary-400 has-focus-visible:text-primary-400 dark:text-primary-600 dark:hover:text-primary-500 dark:has-focus-visible:text-primary-500',
						activeItemClassName,
					),
				className,
			)}>
			<Link href={item.href} className='flex items-center gap-8'>
				{item.icon}
				<span>{item.title}</span>
				{indicatorLayoutId && pathname.endsWith(item.href) && (
					<motion.div
						layoutId={indicatorLayoutId}
						className={cn(
							'absolute bg-primary-500',
							{'top-0 -mt-[2px] h-[2px] w-full': indicatorPosition === 'top'},
							{'right-0 -mr-[2px] h-full w-[2px]': indicatorPosition === 'right'},
							{'bottom-0 -mb-[2px] h-[2px] w-full': indicatorPosition === 'bottom'},
							{'left-0 -ml-[2px] h-full w-[2px]': indicatorPosition === 'left'},
							indicatorClassName,
						)}
					/>
				)}
			</Link>
		</li>
	)
}
