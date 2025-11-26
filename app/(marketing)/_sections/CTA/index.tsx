'use client'
import PrimaryButton from '@/components/PrimaryButton'
import {useRouter} from 'next/navigation'

export default function CTASection() {
	const router = useRouter()
	return (
		<section className='text-white cta-pattern py-96'>
			<div className='relative z-10 mx-auto w-fit max-w-1440 px-24 text-center md:px-48'>
				<h2 className='mb-24 text-4xl font-black text-background-100 md:text-5xl'>Ready to boost your vocabulary?</h2>
				<p className='mb-48 text-xl text-primary-100'>
					Join other learners who are already mastering new languages with LingoMemo.
				</p>
				<div className='flex justify-center'>
					<PrimaryButton
						onClick={() => router.push('auth/signin')}
						className='h-64 bg-primary-600 px-48 text-xl dark:bg-primary-600 pointer-fine:hover:bg-primary-700 dark:pointer-fine:hover:bg-primary-800'
						shadowClassName='bg-primary-800 dark:bg-primary-800 pointer-fine:peer-hover:bg-primary-900'>
						Get Started for Free
					</PrimaryButton>
				</div>
			</div>
		</section>
	)
}
