import {
	faBook,
	faBrain,
	faChartLine,
	faMobileScreen,
	faRocket,
	faUser,
	faWindowRestore,
} from '@fortawesome/free-solid-svg-icons'
import FeatureCard from './FeatureCard'

export default function FeaturesSection() {
	return (
		<section id='features' className='bg-background-100 py-96 dark:bg-background-900'>
			<div className='mx-auto max-w-1440 space-y-64 px-24 md:px-48'>
				<div className='text-center'>
					<h2 className='mb-16 text-3xl font-black md:text-4xl'>Everything you need to excel</h2>
					<p className='text-lg text-background-600 dark:text-background-400'>
						Powerful tools designed to make your learning journey smooth and effective.
					</p>
				</div>

				<div className='grid gap-32 md:grid-cols-2 lg:grid-cols-3'>
					<FeatureCard
						icon={faBrain}
						title='Spaced Repetition'
						description='Our algorithm schedules reviews at the perfect time to ensure maximum retention with minimum effort.'
					/>

					<FeatureCard
						icon={faBook}
						title='Built-in Dictionary'
						description='Look up words instantly and turn any dictionary entry into a flashcard with a single click.'
					/>

					<FeatureCard
						icon={faWindowRestore}
						title='Custom Flashcards'
						description='Create fully personalized flashcards tailored to your learning style, topics, or goals.'
					/>

					<FeatureCard
						icon={faUser}
						title='Multiple Learning Profiles'
						description="Learn multiple languages with separate profiles. Create custom ones too - even if they're not related to language learning at all."
					/>

					<FeatureCard
						icon={faChartLine}
						title='Progress Overview'
						description='Track your study data, review history, and overall growth - with a motivating streak count that keeps you coming back.'
					/>

					<FeatureCard
						icon={faMobileScreen}
						title='Mobile Friendly'
						description='Study on the go. LingoMemo is fully responsive and works perfectly on all your devices.'
					/>

					<FeatureCard
						icon={faRocket}
						title='Fast & Fluid'
						description='Enjoy a buttery smooth experience with instant interactions and zero lag.'
					/>
				</div>
			</div>
		</section>
	)
}
