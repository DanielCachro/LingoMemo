import PrimaryButton from '@/components/PrimaryButton'
import {faGoogle} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Image from 'next/image'

export default function LandingPage() {
	return (
		<section className='mx-32 flex min-h-dvh flex-col items-center justify-center gap-32 text-center'>
			<Image src='/cats/CatSmile.svg' alt='Brand cat smiling' width={128} height={120} className='w-128' />
			<div className='max-w-384 space-y-24'>
				<h1 className='text-2xl font-bold'>
					A smarter way to learn vocabulary<span className='text-primary-500 dark:text-primary-600'>.</span>
				</h1>
				<p>Create your own cards, track your progress, and never forget the words that matter.</p>
				<PrimaryButton
					content={
						<>
							<FontAwesomeIcon icon={faGoogle} size='lg' className='mr-12' />
							Sign in with Google
						</>
					}
				/>
			</div>
		</section>
	)
}
