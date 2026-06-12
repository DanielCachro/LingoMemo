import {getActiveLearningProfile} from '@/lib/actions/user'
import {Suspense} from 'react'
import DefferedLayoutContent from './_components/DefferedLayoutContent'

function Skeleton() {
	return (
		<div
			role='status'
			className='flex h-full w-full shrink-0 animate-pulse flex-col items-center justify-between gap-48 p-32 sm:w-192 sm:items-stretch sm:justify-start sm:pt-64 sm:pr-24 sm:pl-24'>
			<span className='sr-only'>Loading data...</span>
			<div className='hidden h-48 w-full rounded-sm bg-skeleton sm:block'></div>
			<div className='flex w-full items-center justify-between sm:hidden'>
				<div className='h-16 w-32 rounded-full bg-skeleton'></div>
				<div className='h-24 w-24 rounded-sm bg-skeleton'></div>
			</div>
			<div className='flex flex-row gap-32 sm:flex-col sm:gap-16'>
				<div className='h-48 w-48 rounded-md bg-skeleton sm:h-24 sm:w-full'></div>
				<div className='h-48 w-48 rounded-md bg-skeleton sm:h-24 sm:w-full'></div>
				<div className='h-48 w-48 rounded-md bg-skeleton sm:h-24 sm:w-full'></div>
				<div className='h-48 w-48 rounded-md bg-skeleton sm:h-24 sm:w-full'></div>
			</div>
		</div>
	)
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const activeLearningProfilePromise = getActiveLearningProfile()

	return (
		<div className={'flex h-dvh flex-col overflow-y-hidden antialiased sm:flex-row'}>
			<Suspense fallback={<Skeleton />}>
				<DefferedLayoutContent activeLearningProfilePromise={activeLearningProfilePromise} />
			</Suspense>
			<main className='w-full grow overflow-y-auto scrollbar'>{children}</main>
		</div>
	)
}
