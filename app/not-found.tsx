import PrimaryButton from '@/components/PrimaryButton'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
	return (
		<section className='mx-32 flex min-h-dvh flex-col items-center justify-center gap-24 text-center'>
			<Image src='/cats/CatCry.svg' alt='Brand cat crying' width={120} height={113} priority className='w-128' />
			<div className='max-w-384 space-y-16'>
				<div>
					<h1 className='text-2xl font-bold'>Not Found</h1>
					<p>The page you are looking for does not exist.</p>
				</div>
				<Link href='/'>
					<PrimaryButton>Go back to home</PrimaryButton>
				</Link>
			</div>
		</section>
	)
}
