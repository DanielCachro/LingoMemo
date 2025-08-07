import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFireFlameSimple, faSliders} from '@fortawesome/free-solid-svg-icons'
import PrimaryButton from '../components/PrimaryButton'
import NavigationItems from './NavigationItems'
import NavigationItem from './NavigationItem'

export default function MainNavigation() {
	return (
		<div className='shrink-0 py-16 px-32 space-y-48 border-background-200 dark:border-background-800 sm:w-192 sm:h-dvh sm:border-r-2 sm:p-0 sm:pl-24 sm:pt-64'>
			<div className='flex justify-between border-background-300 sm:mr-24 sm:p-12 sm:border-[1px] sm:rounded-sm dark:border-background-700'>
				<span className='text-base font-bold'>
					<FontAwesomeIcon className='h-16 text-primary-500 dark:text-primary-600' icon={faFireFlameSimple} />
					64
				</span>
				<PrimaryButton content={<FontAwesomeIcon icon={faSliders} />} />
			</div>
			<NavigationItems>
				{links => (
					<ul className='hidden sm:flex flex-col gap-16'>
						{links.map(link => (
							<NavigationItem key={link.title} link={link} />
						))}
					</ul>
				)}
			</NavigationItems>
		</div>
	)
}
