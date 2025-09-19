import AnimatedNumber from '@/components/AnimatedNumber'
import {getTotalStreak} from '@/lib/actions/profile/streak'
import CurrentWeek from './CurrentWeek'
import GradientIcon from './GradientIcon'
import StreakMessage from './StreakMessage'

export default async function TotalStreak() {
	const totalStreak = await getTotalStreak()
	return (
		<section className='relative flex flex-col items-center justify-center gap-48 pb-48'>
			<div className='bg-background-0 relative flex size-128 flex-col items-center justify-center rounded-full border-2 border-background-200 bg-background-50 dark:border-background-700 dark:bg-background-800'>
				<GradientIcon size={60} />
				<p className='absolute -bottom-24 translate-y-4 bg-gradient-to-b from-background-500 to-background-800 bg-clip-text text-5xl font-black text-transparent dark:from-background-50 dark:to-background-400'>
					<AnimatedNumber targetValue={totalStreak} />
				</p>
			</div>
			<div className='text-center'>
				<h1 className='text-2xl font-black sm:text-3xl dark:text-background-200'>Total Streak</h1>
				<StreakMessage streakCount={totalStreak} />
			</div>
			<div className='absolute -top-48 right-0 -bottom-48 left-0 -z-50 section-pattern sm:-top-64'></div>
			<CurrentWeek />
		</section>
	)
}
