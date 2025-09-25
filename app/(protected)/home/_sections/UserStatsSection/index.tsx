import Statistics from './Statistics'

export default function UserStatsSection() {
	return (
		<section className='flex items-center justify-center py-48'>
			<div className='mx-24 space-y-24'>
				<p className='text-lg font-bold'>This is what effort looks like!</p>
				<div className='grid grid-cols-2 gap-x-16 gap-y-48 rounded-sm bg-primary-500 px-24 py-32 lg:gap-y-32 lg:px-32 dark:bg-primary-600'>
					<Statistics />
				</div>
			</div>
		</section>
	)
}
