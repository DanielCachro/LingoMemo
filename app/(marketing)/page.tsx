import {Metadata} from 'next'
import CTASection from './_sections/CTA'
import FeaturesSection from './_sections/Features'
import HeroSection from './_sections/Hero'
import HowItWorksSection from './_sections/HowItWorks'

export const metadata: Metadata = {
	title: 'LingoMemo - Master any language effortlessly',
	description:
		'The smarter way to learn vocabulary. Create custom flashcards, track your progress, and let our spaced repetition algorithm handle the rest.',
	alternates: {
		canonical: '/',
	},
}

export default function LandingPage() {
	return (
		<div className='min-h-screen bg-background-100 dark:bg-background-900'>
			<HeroSection />
			<FeaturesSection />
			<HowItWorksSection />
			<CTASection />
		</div>
	)
}
