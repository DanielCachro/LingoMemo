'use client'

import {useStreak} from '@/hooks/useStreak'
import {faFireFlameSimple} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export default function TotalStreakDisplay() {
	const {data} = useStreak()
	return (
		<span className='text-base font-bold group-hover:text-background-600 dark:group-hover:text-background-300'>
			<FontAwesomeIcon className='h-16 text-primary-500 dark:text-primary-600' icon={faFireFlameSimple} />
			{data?.streakCount ?? 0}
		</span>
	)
}
