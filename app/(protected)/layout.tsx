import {prefetchStreak} from '@/hooks/useStreak'
import {getActiveLearningProfile} from '@/lib/actions/user'
import type {LearningProfileTypes} from '@/types/profile'
import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query'
import {redirect} from 'next/navigation'
import BottomNavigation from './BottomNavigation'
import MainNavigation from './MainNavigation'
import ProfileToast from './ProfileToast'
import StreakSynchronizer from './StreakSynchronizer'
import {TimeZoneUpdater} from './TimeZoneUpdater'

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const {activeLearningProfile} = await getActiveLearningProfile()

	if (!activeLearningProfile) {
		redirect('/setup')
	}

	const queryClient = new QueryClient()
	await prefetchStreak(queryClient)

	let activeLearningProfileType: LearningProfileTypes = 'language'
	if (!activeLearningProfile.targetLang) {
		activeLearningProfileType = 'self-study'
	}

	return (
		<div className={'flex h-dvh flex-col overflow-y-hidden antialiased sm:flex-row'}>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<TimeZoneUpdater />
				<StreakSynchronizer activeLearningProfileId={activeLearningProfile.id} />
				<ProfileToast activeLearningProfile={activeLearningProfile} />
				<MainNavigation activeLearningProfileType={activeLearningProfileType} />
				<main className='w-full grow overflow-y-auto scrollbar'>{children}</main>
				<BottomNavigation activeLearningProfileType={activeLearningProfileType} className='sm:hidden' />
			</HydrationBoundary>
		</div>
	)
}
