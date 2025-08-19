import StudyCtaSection from './StudyCtaSection'
import TotalStreakSection from './TotalStreakSection'
import UserStatsSection from './UserStatsSection'
import WeekChartSection from './WeekChartSection'

export default function Home() {
	return (
		<>
			<TotalStreakSection />
			<WeekChartSection />
			<div className='items-end justify-center gap-48 lg:flex'>
				<StudyCtaSection />
				<UserStatsSection />
			</div>
		</>
	)
}
