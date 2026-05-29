import {getActiveLearningProfile} from '@/lib/actions/user'
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
			<MainNavigation activeLearningProfileType={activeLearningProfileType} />
			<BottomNavigation activeLearningProfileType={activeLearningProfileType} className='order-1 sm:hidden' />
		</>
	)
}
