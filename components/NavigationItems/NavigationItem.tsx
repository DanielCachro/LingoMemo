'use client'
import {navigationItems} from '@/lib/constants/navigationItems'
import {cn} from '@/lib/utils/cn'
import {motion} from 'motion/react'
import Link from 'next/link'
import {useSelectedLayoutSegment} from 'next/navigation'

interface Props {
	item: (typeof navigationItems)[number]
	indicatorLayoutId: string
	activeItemClassName?: string
	indicatorClassName?: string
	indicatorPosition?: 'top' | 'right' | 'bottom' | 'left'
	className?: string
}

export default function NavigationItem({
	item,
	indicatorLayoutId,
	activeItemClassName,
	indicatorClassName,
	indicatorPosition = 'top',
	className,
}: Props) {
	const segment = useSelectedLayoutSegment()
	const isActive = `/${segment}` === item.href
	return (
		<li
			className={cn(
				'relative transition-colors duration-100 hover:text-primary-500 has-focus-visible:text-primary-500 hover:dark:text-primary-600 dark:has-focus-visible:text-primary-500',
				isActive &&
					cn(
						'text-primary-500 hover:text-primary-400 has-focus-visible:text-primary-400 dark:text-primary-600 dark:hover:text-primary-500 dark:has-focus-visible:text-primary-500',
						activeItemClassName,
					),
				className,
			)}>
			<Link href={item.href} className='flex items-center gap-8'>
				{item.icon}
				<span>{item.title}</span>
				{isActive && (
					<motion.div
						layoutId={indicatorLayoutId}
						className={cn(
							'absolute bg-primary-500 dark:bg-primary-600',
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
