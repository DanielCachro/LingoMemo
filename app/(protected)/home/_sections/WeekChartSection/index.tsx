import {getLast7Days} from '@/lib/dateRanges'
import Chart from './Chart'

export default function WeekChart() {
	const last7Days = getLast7Days()

	return (
		<section className='flex-col items-center py-48 min-[26.8rem]:flex'>
			<div>
				<p className='ml-24 pb-8 text-lg font-bold sm:m-0'>Whoa, look at your week!</p>
				<div className='no-scrollbar overflow-x-scroll pl-24 sm:p-0' style={{direction: 'rtl'}}>
					<Chart last7Days={last7Days} />
				</div>
			</div>
		</section>
	)
}
