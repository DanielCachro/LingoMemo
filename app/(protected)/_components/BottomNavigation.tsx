'use client'
import {cn} from '@/lib/utils/cn'
import {motion} from 'motion/react'
import {usePathname} from 'next/navigation'

interface Props {
	className?: string
	children?: React.ReactNode
}

export default function BottomNavigation({className, children}: Props) {
	const pathname = usePathname()

	return (
		<motion.nav
			className={cn(
				'w-full border-t-2 border-background-200 bg-background-100 dark:border-background-800 dark:bg-background-900',
				className,
				{hidden: pathname.startsWith('/study')},
			)}>
			{children}
		</motion.nav>
	)
}
