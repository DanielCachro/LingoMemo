import {prefetchStreak} from '@/hooks/useStreak'
import {getActiveLearningProfile} from '@/lib/actions/user'
import type {LearningProfileTypes} from '@/types/profile'
import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query'
import BottomNavigation from './BottomNavigation'
import MainNavigation from './MainNavigation'
import QueryClientProvider from './QueryClientProvider'
import {TimeZoneUpdater} from './TimeZoneUpdater'

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const queryClient = new QueryClient()
	await prefetchStreak(queryClient)

	const {activeLearningProfile} = await getActiveLearningProfile()
	let activeLearningProfileType: LearningProfileTypes = 'language'
	if (!activeLearningProfile.targetLang) {
		activeLearningProfileType = 'self-study'
	}

	return (
		<div className={'flex h-dvh flex-col overflow-y-hidden antialiased sm:flex-row'}>
			<QueryClientProvider>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<TimeZoneUpdater />
					<MainNavigation activeLearningProfileType={activeLearningProfileType} />
					<main className='w-full grow overflow-y-auto scrollbar'>{children}</main>
					<BottomNavigation activeLearningProfileType={activeLearningProfileType} className='sm:hidden' />
				</HydrationBoundary>
			</QueryClientProvider>
		</div>
	)
}
