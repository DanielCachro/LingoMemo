import {prefetchStreak} from '@/hooks/useStreak'
import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query'
import BottomNavigation from './BottomNavigation'
import MainNavigation from './MainNavigation'
import QueryClientProvider from './QueryClientProvider'

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const queryClient = new QueryClient()
	await prefetchStreak(queryClient)

	return (
		<div className={'flex h-dvh flex-col overflow-y-hidden antialiased sm:flex-row'}>
			<QueryClientProvider>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<MainNavigation />
					<main className='w-full grow overflow-y-auto scrollbar'>{children}</main>
					<BottomNavigation className='sm:hidden' />
				</HydrationBoundary>
			</QueryClientProvider>
		</div>
	)
}
