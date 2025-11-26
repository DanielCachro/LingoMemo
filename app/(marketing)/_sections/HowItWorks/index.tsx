import StepCard from './StepCard'

export default function HowItWorksSection() {
	return (
		<section className='section-pattern py-96'>
			<div className='mx-auto max-w-1440 px-24 md:px-48'>
				<div className='mb-64 text-center'>
					<h2 className='mb-16 text-3xl font-black md:text-4xl'>How it works</h2>
					<p className='text-lg text-background-600 dark:text-background-400'>Three simple steps to fluency.</p>
				</div>

				<div className='grid gap-48 md:grid-cols-3'>
					<StepCard
						number='01'
						title='Create'
						description='Turn any dictionary entry into a card with a single click or build your own flashcards from scratch.'
					/>
					<StepCard
						number='02'
						title='Study'
						description='Review your cards daily using our smart spaced repetition system designed to maximize retention with less effort.'
					/>
					<StepCard
						number='03'
						title='Master'
						description='Watch your vocabulary grow rapidly and stay motivated by keeping your learning streak alive.'
					/>
				</div>
			</div>
		</section>
	)
}
