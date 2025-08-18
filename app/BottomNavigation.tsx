'use client'
import {cn} from '@/lib/utils'
import {motion} from 'motion/react'
import NavigationItems from '../components/NavigationItems'

interface Props {
	className?: string
}

export default function BottomNavigation({className}: Props) {
	return (
		<motion.nav
			className={cn(
				'w-full border-t-2 border-background-200 bg-background-100 dark:border-background-800 dark:bg-background-900',
				className,
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
