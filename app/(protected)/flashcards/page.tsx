import Cards from './_components/Cards'
import Heading from './_components/Heading'

export default function FlashcardsPage() {
	return (
		<section className='flex flex-col items-center px-16 page-padding-y sm:items-center'>
			<div className='w-full max-w-768'>
				<Heading />
				<Cards />
			</div>
		</section>
	)
}
