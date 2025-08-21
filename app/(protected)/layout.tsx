import BottomNavigation from './BottomNavigation'
import MainNavigation from './MainNavigation'

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className={'flex h-dvh flex-col overflow-y-hidden antialiased sm:flex-row'}>
			<MainNavigation />
			<main className='w-full grow overflow-y-scroll py-48 scrollbar sm:py-64'>{children}</main>
			<BottomNavigation className='sm:hidden' />
		</div>
	)
}
