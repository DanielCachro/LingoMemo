import NavigationItems from '@/components/NavigationItems'
import type {LearningProfileTypes} from '@/types/profile'
import Link from 'next/link'
import PreferencesButton from './PreferencesButton'
import TotalStreakDisplay from './TotalStreakDisplay'

export default async function MainNavigation({
	activeLearningProfileType,
}: {
	activeLearningProfileType: LearningProfileTypes
}) {
	return (
		<div className='border-background-200 px-32 py-16 sm:min-h-dvh sm:w-192 sm:shrink-0 sm:space-y-48 sm:border-r-2 sm:p-0 sm:pt-64 sm:pl-24 dark:border-background-800'>
			<div className='flex justify-between border-background-300 sm:mr-24 sm:rounded-sm sm:border-px sm:p-12 dark:border-background-700'>
				<Link href={'/home'} className='group'>
					<TotalStreakDisplay />
				</Link>
				<PreferencesButton />
			</div>
			<nav>
				<NavigationItems className='hidden flex-col gap-16 sm:flex'>
					{item => {
						if (!item.displayForProfile.includes(activeLearningProfileType)) {
							return null
						}
						return (
							<NavigationItems.NavigationItem
								key={item.title}
								item={item}
								indicatorLayoutId='main-navigation-indicator'
								indicatorPosition='right'
							/>
						)
					}}
				</NavigationItems>
			</nav>
		</div>
	)
}
