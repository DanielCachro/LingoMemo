import AnimatedNumber from '@/components/AnimatedNumber'
import CurrentWeek from './CurrentWeek'
import GradientIcon from './GradientIcon'
import StreakMessage from './StreakMessage'

// Temporary hardcoded streak count
const streakCount: number = 24

if (streakCount < 0) {
	throw new Error('Streak count cannot be negative')
}

export default function TotalStreak() {
	return (
		<section className='flex flex-col items-center justify-center gap-48 section-pattern py-48 sm:py-64'>
			<div className='bg-background-0 relative flex size-128 flex-col items-center justify-center rounded-full border-2 border-background-200 bg-background-50 dark:border-background-700 dark:bg-background-800'>
				<GradientIcon size={60} />
				<p className='absolute -bottom-24 translate-y-4 bg-gradient-to-b from-background-500 to-background-800 bg-clip-text text-5xl font-black text-transparent dark:from-background-50 dark:to-background-400'>
					<AnimatedNumber targetValue={streakCount} />
				</p>
			</div>
			<div className='text-center'>
				<p className='text-2xl font-black sm:text-3xl dark:text-background-200'>Total Streak</p>
				<StreakMessage streakCount={streakCount} />
			</div>
			<CurrentWeek />
		</section>
	)
}
