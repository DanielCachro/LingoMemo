import FadeInChildren from '@/components/FadeInChildren'
import {Metadata} from 'next'
import StudyCtaSection from './_sections/StudyCtaSection'
import TotalStreakSection from './_sections/TotalStreakSection'
import UserStatsSection from './_sections/UserStatsSection'
import WeekChartSection from './_sections/WeekChartSection'

export const metadata: Metadata = {
	title: 'Home - LingoMemo',
	description: 'Check your stats, streaks, and progress on LingoMemo.',
}

export default function Home() {
	return (
		<div className='py-48 sm:page-padding-y'>
			<TotalStreakSection />
			<WeekChartSection />
			<FadeInChildren delay={1.25} delayStep={0} duration={0.4}>
				<div className='items-end justify-center lg:flex'>
					<StudyCtaSection />
					<UserStatsSection />
				</div>
			</FadeInChildren>
		</div>
	)
}
