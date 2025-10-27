import type {Metadata} from 'next'
import {Nunito} from 'next/font/google'
import './globals.css'

import {config} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import {ThemeProvider} from 'next-themes'

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
	modal,
}: Readonly<{
	children: React.ReactNode
	modal: React.ReactNode
}>) {
	return (
		<html suppressHydrationWarning lang='en'>
			<body className={`${nunito.variable}`}>
				<ThemeProvider>
					<>
						<div id='modal-root' />
						{children}
						{modal}
					</>
				</ThemeProvider>
			</body>
		</html>
	)
}
