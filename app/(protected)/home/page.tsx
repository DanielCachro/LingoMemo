import FadeInChildren from '@/components/FadeInChildren'
import StudyCtaSection from './_sections/StudyCtaSection'
import TotalStreakSection from './_sections/TotalStreakSection'
import UserStatsSection from './_sections/UserStatsSection'
import WeekChartSection from './_sections/WeekChartSection'

export default function Home() {
	return (
		<div className='py-48 sm:page-padding-y'>
			<TotalStreakSection />
			<WeekChartSection />
			<FadeInChildren delay={1.25} delayStep={0} duration={0.4}>
				<div className='items-end justify-center gap-48 lg:flex'>
					<StudyCtaSection />
					<UserStatsSection />
				</div>
			</FadeInChildren>
		</div>
	)
}
