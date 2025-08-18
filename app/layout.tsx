import type {Metadata} from 'next'
import {Nunito} from 'next/font/google'
import './globals.css'

import {config} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import BottomNavigation from './BottomNavigation'
import MainNavigation from './MainNavigation'

const nunito = Nunito({
	variable: '--font-nunito',
	subsets: ['latin-ext'],
	weight: ['500', '700', '900'],
})

export const metadata: Metadata = {
	title: 'LingoMemo',
	description: 'Create your own cards, track your progress, and never forget the words that matter.',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${nunito.variable} flex h-dvh flex-col overflow-y-hidden antialiased sm:flex-row`}>
				<MainNavigation />
				<main className='w-full grow overflow-y-scroll py-48 scrollbar sm:py-64'>{children}</main>
				<BottomNavigation className='sm:hidden' />
			</body>
		</html>
	)
}
