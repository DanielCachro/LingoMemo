'use client'
import NavigationItems from '@/components/NavigationItems'
import {cn} from '@/lib/utils'
import {motion} from 'motion/react'
import {usePathname} from 'next/navigation'

interface Props {
	className?: string
}

export default function BottomNavigation({className}: Props) {
	const pathname = usePathname()

	return (
		<motion.nav
			className={cn(
				'w-full border-t-2 border-background-200 bg-background-100 dark:border-background-800 dark:bg-background-900',
				className,
				{hidden: pathname.startsWith('/study')},
			)}>
			<NavigationItems className='flex justify-center gap-32'>
				{item => (
					<NavigationItems.NavigationItem
						key={item.title}
						className='py-16 text-xs [&>a]:h-full [&>a]:flex-col [&>a]:justify-center [&>a>svg]:text-base'
						item={item}
						indicatorLayoutId='bottom-navigation-indicator'
						indicatorPosition='top'
					/>
				)}
			</NavigationItems>
		</motion.nav>
	)
}
