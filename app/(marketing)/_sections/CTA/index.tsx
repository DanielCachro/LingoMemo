'use client'
import PrimaryButton from '@/components/PrimaryButton'
import ctaBackground from '@/public/landingpage-cta-background.jpg'
import Image from 'next/image'

export default function CTASection() {
	const handleAuthRedirect = () => {
		window.location.href = '/auth/signin'
	}

	return (
		<section className='text-white cta-pattern relative py-96'>
			<div className='absolute inset-x-16 inset-y-0 mx-auto max-w-1440 overflow-hidden rounded-xl' aria-hidden='true'>
				<Image
					src={ctaBackground}
					alt='Call to action background'
					fill
					className='object-cover object-center'
					placeholder='blur'
					quality={75}
				/>

				<div className='absolute inset-0 bg-primary-600/80 dark:bg-primary-700/80'></div>
			</div>

			<div className='relative z-10 mx-auto w-fit max-w-1440 px-24 text-center md:px-48'>
				<h2 className='mb-24 text-4xl font-black text-background-100 md:text-5xl'>Ready to boost your vocabulary?</h2>
				<p className='mb-48 text-xl text-primary-100'>
					Join other learners who are already mastering new languages with LingoMemo.
				</p>
				<div className='flex justify-center'>
					<PrimaryButton
						onClick={handleAuthRedirect}
						className='h-64 bg-primary-600 px-48 text-xl transition-transform duration-150 hover:scale-105 dark:bg-primary-600 pointer-fine:hover:bg-primary-600 dark:pointer-fine:hover:bg-primary-600'
						shadowClassName='bg-primary-800 transition-transform duration-150 peer-hover:scale-105 dark:bg-primary-800 pointer-fine:peer-hover:bg-primary-800 pointer-fine:dark:peer-hover:bg-primary-800'>
						Get Started for Free
					</PrimaryButton>
				</div>
			</div>
		</section>
	)
}
