import StudyCtaSkeleton from './_sections/StudyCtaSection/Skeleton'
import TotalStreakSectionSkeleton from './_sections/TotalStreakSection/Skeleton'
import UserStatsSkeleton from './_sections/UserStatsSection/Skeleton'
import WeekChartSkeleton from './_sections/WeekChartSection/Skeleton'

export default function Loading() {
	return (
		<div className='py-48 sm:page-padding-y'>
			<TotalStreakSectionSkeleton />
			<WeekChartSkeleton />

			<div className='flex flex-col items-center gap-64 lg:flex-row lg:items-end lg:justify-center'>
				<StudyCtaSkeleton />
				<UserStatsSkeleton />
			</div>
		</div>
	)
}
