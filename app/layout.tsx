import type {Metadata} from 'next'
import {Nunito} from 'next/font/google'
import './globals.css'

import {config} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import MainNavigation from './MainNavigation'
import BottomNavigation from './BottomNavigation'

const nunito = Nunito({
	variable: '--font-nunito',
	subsets: ['latin-ext'],
	weight: ['500', '700'],
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
			<body className={`${nunito.variable} antialiased sm:flex`}>
				<MainNavigation />
				<main className='w-full'>{children}</main>
				<BottomNavigation className='sm:hidden' />
			</body>
		</html>
	)
}
