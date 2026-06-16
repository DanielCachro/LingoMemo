import FadeInChildren from '@/components/FadeInChildren'
import {getLast7DaysCompletionCount} from '@/lib/queries/profile/week'
import Chart from './Chart'

export default async function WeekChart() {
	const last7Days = await getLast7DaysCompletionCount()

	let activeDaysThisWeek = 0
	for (const day of last7Days) {
		if (day.cardsCompleted > 0) {
			activeDaysThisWeek++
		}
	}

	let chartMessage = ''
	if (activeDaysThisWeek === 0) {
		chartMessage = 'No cards completed this week.'
	} else if (activeDaysThisWeek <= 1) {
		chartMessage = 'Great start! Keep going!'
	} else if (activeDaysThisWeek <= 3) {
		chartMessage = 'Doing well this week!'
	} else {
		chartMessage = 'Whoa, look at your week!'
	}

	return (
		<section className='flex-col items-center overflow-hidden py-48 min-[26.8rem]:flex'>
			<div>
				<FadeInChildren delay={0.7} delayStep={0} duration={0.3}>
					<p className='ml-24 pb-8 text-lg font-bold sm:m-0'>{chartMessage}</p>
				</FadeInChildren>
				<div className='no-scrollbar overflow-x-scroll pl-24 sm:p-0' style={{direction: 'rtl'}}>
					<Chart last7Days={last7Days} />
				</div>
			</div>
		</section>
	)
}
