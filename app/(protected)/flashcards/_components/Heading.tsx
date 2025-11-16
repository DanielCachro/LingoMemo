'use client'
import PrimaryButton from '@/components/PrimaryButton'
import {faPlus} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useRouter} from 'next/navigation'

export default function Heading() {
	const router = useRouter()
	return (
		<div className='flex flex-col justify-between space-y-16 py-32 md:flex-row'>
			<div>
				<h1 className='font-bold'>Flashcards</h1>
				<p>Manage your collection of flashcards.</p>
			</div>
			<PrimaryButton
				wrapperClassName='h-fit w-fit'
				onClick={() => {
					router.push('flashcards/create')
				}}>
				<FontAwesomeIcon icon={faPlus} /> Create New Flashcard
			</PrimaryButton>
		</div>
	)
}
