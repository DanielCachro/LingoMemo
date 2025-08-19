import {faClockRotateLeft, faFireFlameSimple, faStopwatch} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import clsx from 'clsx'

const DUMMY_RECORDS = [
	{
		id: 1,
		icon: faFireFlameSimple,
		record: '64 days',
		measure: 'in a row',
	},
	{
		id: 2,
		icon: faClockRotateLeft,
		record: '1090 cards',
		measure: 'this week',
	},
	{
		id: 3,
		icon: faStopwatch,
		record: '240 minutes',
		measure: 'this week',
	},
]

export default function UserStatsSection() {
	return (
		<section className='flex items-center justify-center py-48'>
			<div className='mx-24 space-y-24'>
				<p className='text-lg font-bold'>This is what effort looks like!</p>
				<div className='grid grid-cols-2 gap-x-16 gap-y-48 rounded-sm bg-primary-500 px-24 py-32 lg:gap-y-32 lg:px-32 dark:bg-primary-600'>
					{DUMMY_RECORDS.map((item, index) => {
						const isLast = index === DUMMY_RECORDS.length - 1
						const isOdd = DUMMY_RECORDS.length % 2 !== 0

						return (
							<div
								key={item.id}
								className={clsx('flex items-center gap-8 text-primary-100 dark:text-primary-200', {
									'col-span-2 justify-self-center': isLast && isOdd,
								})}>
								<FontAwesomeIcon icon={item.icon} className='text-3xl' />
								<p className='flex flex-col font-bold'>
									{item.record}
									<span className='font-medium text-primary-300 dark:text-primary-400'>{item.measure}</span>
								</p>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
