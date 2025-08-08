import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFireFlameSimple, faSliders} from '@fortawesome/free-solid-svg-icons'
import PrimaryButton from '../components/PrimaryButton'
import NavigationItems from './NavigationItems'

export default function MainNavigation() {
	return (
		<div className='shrink-0 space-y-48 border-background-200 px-32 py-16 sm:h-dvh sm:w-192 sm:border-r-2 sm:p-0 sm:pt-64 sm:pl-24 dark:border-background-800'>
			<div className='flex justify-between border-background-300 sm:mr-24 sm:rounded-sm sm:border-[1px] sm:p-12 dark:border-background-700'>
				<span className='text-base font-bold'>
					<FontAwesomeIcon className='h-16 text-primary-500 dark:text-primary-600' icon={faFireFlameSimple} />
					64
				</span>
				<PrimaryButton content={<FontAwesomeIcon icon={faSliders} />} />
			</div>
			<NavigationItems className='hidden flex-col gap-16 sm:flex'>
				{item => <NavigationItems.NavigationItem key={item.title} item={item} />}
			</NavigationItems>
		</div>
	)
}
