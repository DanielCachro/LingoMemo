'use client'
import AnimatedNumber from '@/components/AnimatedNumber'
import {useStreak} from '@/hooks/useStreak'
export default function TotalStreakAnimated() {
	const {data} = useStreak()
	const targetValue = data?.streakCount ?? 0
	return <AnimatedNumber targetValue={targetValue} />
}
