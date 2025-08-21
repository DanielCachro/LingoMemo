import {faFireFlameSimple, faSliders} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import NavigationItems from '../../components/NavigationItems'
import PrimaryButton from '../../components/PrimaryButton'

export default function MainNavigation() {
	return (
		<div className='border-background-200 sm:w-192 dark:border-background-800 px-32 py-16 sm:min-h-dvh sm:shrink-0 sm:space-y-48 sm:border-r-2 sm:p-0 sm:pl-24 sm:pt-64'>
			<div className='border-background-300 dark:border-background-700 flex justify-between sm:mr-24 sm:rounded-sm sm:border-[1px] sm:p-12'>
				<span className='text-base font-bold'>
					<FontAwesomeIcon className='text-primary-500 dark:text-primary-600 h-16' icon={faFireFlameSimple} />
					64
				</span>
				<PrimaryButton content={<FontAwesomeIcon icon={faSliders} />} />
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
