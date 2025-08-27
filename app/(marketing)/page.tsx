import Image from 'next/image'
import LoginButton from './LoginButton'

export default function LandingPage() {
	return (
		<section className='mx-32 flex min-h-dvh flex-col items-center justify-center gap-32 text-center'>
			<Image src='/cats/CatSmile.svg' alt='Brand cat smiling' width={128} height={120} className='w-128' />
			<div className='max-w-384 space-y-32'>
				<div className='space-y-12'>
					<h1 className='text-2xl font-bold'>
						A smarter way to learn vocabulary<span className='text-primary-500 dark:text-primary-600'>.</span>
					</h1>
					<p>Create your own cards, track your progress, and never forget the words that matter.</p>
				</div>
				<LoginButton />
			</div>
		</section>
	)
}
