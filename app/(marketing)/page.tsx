import PrimaryButton from '@/components/PrimaryButton'

export default function LandingPage() {
	return (
		<section>
			<h1 className='text-2xl font-bold'>
				A smarter way to learn vocabulary<span className='text-primary-500'>.</span>
			</h1>
			<p>Create your own cards, track your progress, and never forget the words that matter.</p>
			<PrimaryButton content='Sign in with Google' />
		</section>
	)
}
