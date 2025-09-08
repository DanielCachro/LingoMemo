import PrimaryButton from '@/components/PrimaryButton'
import Image from 'next/image'

interface Props {
	onBtnClick: () => void
	error?: Error
}

export default function ErrorPage({onBtnClick, error}: Props) {
	return (
		<section className='mx-32 flex min-h-dvh flex-col items-center justify-center gap-24 text-center'>
			<Image src='/cats/CatCry.svg' alt='Brand cat crying' width={120} height={113} priority className='w-128' />
			<div className='max-w-384 space-y-24'>
				<div className='space-y-8'>
					<h1 className='text-2xl font-bold'>Something went wrong!</h1>
					<p>{error?.message ? error.message : 'Unknown error occurred'}.</p>
				</div>

				<PrimaryButton onClick={onBtnClick}>Try again</PrimaryButton>
			</div>
		</section>
	)
}
