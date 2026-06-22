import AnimatedNumber from '@/components/AnimatedNumber'
import {getStreakData} from '@/lib/queries/profile/streak'

export default async function TotalStreakAnimated() {
	const {streakCount} = await getStreakData()
	return (
		<>
			<span className='sr-only'>Total streak: {streakCount}</span>
			<span aria-hidden='true'>
				<AnimatedNumber targetValue={streakCount} />
			</span>
		</>
	)
}
