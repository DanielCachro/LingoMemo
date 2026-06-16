import NavigationItems from '@/components/NavigationItems'
import {getActiveLearningProfile} from '@/lib/queries/user'
import type {LearningProfileTypes} from '@/types/profile'
import {redirect} from 'next/navigation'
import BottomNavigation from './BottomNavigation'
import MainNavigation from './MainNavigation'
import StreakSynchronizer from './StreakSynchronizer'
import {TimeZoneUpdater} from './TimeZoneUpdater'
import WelcomeToast from './WelcomeToast'

interface DefferedLayoutContentProps {
	activeLearningProfilePromise: ReturnType<typeof getActiveLearningProfile>
}

function AppNav({
	activeLearningProfileType,
	indicatorLayoutId,
	indicatorPosition = 'right',
	itemsClassName,
	itemClassName,
}: {
	activeLearningProfileType: LearningProfileTypes
	indicatorLayoutId: string
	indicatorPosition?: 'top' | 'right' | 'bottom' | 'left'
	itemsClassName?: string
	itemClassName?: string
}) {
	return (
		<nav>
			<NavigationItems className={itemsClassName}>
				{item => {
					if (!item.displayForProfile.includes(activeLearningProfileType)) {
						return null
					}
					return (
						<NavigationItems.NavigationItem
							key={item.title}
							item={item}
							indicatorLayoutId={indicatorLayoutId}
							indicatorPosition={indicatorPosition}
							className={itemClassName}
						/>
					)
				}}
			</NavigationItems>
		</nav>
	)
}

export default async function DefferedLayoutContent({activeLearningProfilePromise}: DefferedLayoutContentProps) {
	const activeLearningProfile = (await activeLearningProfilePromise).activeLearningProfile

	if (!activeLearningProfile) {
		redirect('/setup')
	}

	let activeLearningProfileType: LearningProfileTypes = 'language'
	if (!activeLearningProfile.targetLang) {
		activeLearningProfileType = 'self-study'
	}

	return (
		<>
			<TimeZoneUpdater />
			<StreakSynchronizer activeLearningProfileId={activeLearningProfile.id} />
			<WelcomeToast activeLearningProfile={activeLearningProfile} />
			<MainNavigation>
				<AppNav
					activeLearningProfileType={activeLearningProfileType}
					indicatorPosition='right'
					indicatorLayoutId='main-navigation-indicator'
					itemsClassName='hidden flex-col gap-16 sm:flex'
				/>
			</MainNavigation>
			<BottomNavigation className='order-1 sm:hidden'>
				<AppNav
					activeLearningProfileType={activeLearningProfileType}
					indicatorPosition='top'
					indicatorLayoutId='bottom-navigation-indicator'
					itemClassName='py-16 text-xs [&>a]:h-full [&>a]:flex-col [&>a]:justify-center [&>a>svg]:text-base'
					itemsClassName='flex flex-wrap justify-center gap-x-32'
				/>
			</BottomNavigation>
		</>
	)
}
