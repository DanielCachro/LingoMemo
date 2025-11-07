'use client'
import type {FlashcardsFilter} from '@/app/@modal/flashcards/(.)filter/page'
import {useModalData} from '@/app/ModalDataProvider'
import Cards from './_components/Cards'
import Heading from './_components/Heading'

export default function FlashcardsPage() {
	const {getData} = useModalData()
	const savedFilter = getData<FlashcardsFilter>('flashcardsFilter') || {}

	return (
		<section className='flex flex-col items-center px-16 page-padding-y sm:items-center'>
			<div className='w-full max-w-768'>
				<Heading />
				<Cards filter={savedFilter} />
			</div>
		</section>
	)
}
