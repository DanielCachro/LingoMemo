import Link from 'next/link'
import PreferencesButton from './PreferencesButton'
import StreakCount from './StreakCount'

export default async function MainNavigation({children}: {children?: React.ReactNode}) {
	return (
		<div className='border-background-200 px-32 py-16 sm:min-h-dvh sm:w-192 sm:shrink-0 sm:space-y-48 sm:border-r-2 sm:p-0 sm:pt-64 sm:pl-24 dark:border-background-800'>
			<div className='flex justify-between border-background-300 sm:mr-24 sm:rounded-sm sm:border sm:p-12 dark:border-background-700'>
				<Link href={'/home'} className='group' aria-label='Home' title='Home'>
					<StreakCount />
				</Link>
				<PreferencesButton />
			</div>
			{children}
		</div>
	)
}
