import {getStreakData} from '@/lib/queries/profile/streak'
import {faFireFlameSimple} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export default async function StreakCount() {
	const {streakCount} = await getStreakData()
	return (
		<span className='text-base font-bold group-hover:text-background-600 dark:group-hover:text-background-300'>
			<FontAwesomeIcon className='h-16 text-primary-500 dark:text-primary-600' icon={faFireFlameSimple} />
			{streakCount}
		</span>
	)
}
