import StudyCtaSection from './_sections/StudyCtaSection'
import TotalStreakSection from './_sections/TotalStreakSection'
import UserStatsSection from './_sections/UserStatsSection'
import WeekChartSection from './_sections/WeekChartSection'

export default function Home() {
	return (
		<div className='py-48 sm:page-padding-y'>
			<TotalStreakSection />
			<WeekChartSection />
			<div className='items-end justify-center gap-48 lg:flex'>
				<StudyCtaSection />
				<UserStatsSection />
			</div>
		</div>
	)
}
