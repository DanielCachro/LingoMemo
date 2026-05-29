import AnimatedNumber from '@/components/AnimatedNumber'
import {getStreakData} from '@/lib/actions/profile/streak'

export default async function TotalStreakAnimated() {
	const {streakCount} = await getStreakData()
	return <AnimatedNumber targetValue={streakCount} />
}
