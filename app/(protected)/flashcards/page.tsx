import Cards from './_components/Cards'
import Heading from './_components/Heading'

export default function FlashcardsPage() {
	return (
		<section className='flex min-h-full flex-col items-center px-16 page-padding-y sm:items-center'>
			<div className='flex w-full max-w-768 grow flex-col'>
				<Heading />
				<Cards />
			</div>
		</section>
	)
}
