import NavigationItems from '@/components/NavigationItems'
import PrimaryButton from '@/components/PrimaryButton'
import {faFireFlameSimple, faSliders} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export default async function MainNavigation() {
	return (
		<div className='border-background-200 px-32 py-16 sm:min-h-dvh sm:w-192 sm:shrink-0 sm:space-y-48 sm:border-r-2 sm:p-0 sm:pt-64 sm:pl-24 dark:border-background-800'>
			<div className='flex justify-between border-background-300 sm:mr-24 sm:rounded-sm sm:border-[1px] sm:p-12 dark:border-background-700'>
				<Link href={'/home'} className='group'>
					<span className='text-base font-bold group-hover:text-background-600 dark:group-hover:text-background-300'>
						<FontAwesomeIcon className='h-16 text-primary-500 dark:text-primary-600' icon={faFireFlameSimple} />
						64
					</span>
				</Link>
				<PrimaryButton>
					<FontAwesomeIcon icon={faSliders} />
				</PrimaryButton>
			</div>
			<nav>
				<NavigationItems className='hidden flex-col gap-16 sm:flex'>
					{item => (
						<NavigationItems.NavigationItem
							key={item.title}
							item={item}
							indicatorLayoutId='main-navigation-indicator'
							indicatorPosition='right'
						/>
					)}
				</NavigationItems>
			</nav>
		</div>
	)
}
