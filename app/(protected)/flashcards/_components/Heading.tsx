import PrimaryButton from '@/components/PrimaryButton'
import {faPlus} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export default function Heading() {
	return (
		<div className='flex flex-col justify-between space-y-16 py-32 md:flex-row'>
			<div>
				<h1 className='font-bold'>Flashcards</h1>
				<p>Manage your collection of flashcards.</p>
			</div>
			<Link href='flashcards/create' scroll={false}>
				<PrimaryButton wrapperClassName='h-fit w-fit'>
					<FontAwesomeIcon icon={faPlus} /> Create New Flashcard
				</PrimaryButton>
			</Link>
		</div>
	)
}
