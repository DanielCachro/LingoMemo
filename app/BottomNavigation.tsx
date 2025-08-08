import NavigationItems from './NavigationItems'
import {cn} from '@/lib/utils'

interface Props {
	className?: string
}

export default function BottomNavigation({className}: Props) {
	return (
		<div className={cn('fixed bottom-0 w-full', className)}>
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
		</div>
	)
}
