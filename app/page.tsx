import AnimatedNumber from '@/components/AnimatedNumber'
import TotalStreak from './TotalStreak'

export default function Home() {
	return (
		<>
			<TotalStreak />
			<AnimatedNumber initialValue={40} maxValue={100} whileInView once />
		</>
	)
}
