import SearchBar from '@/components/SearchBar'
import {faFilter, faUpDown} from '@fortawesome/free-solid-svg-icons'
import Card from './Card'
import SearchOptionsLinkButton from './SearchOptionsLinkButton'

export default function Cards() {
	return (
		<div className='space-y-16'>
			<div className='flex gap-4'>
				<SearchBar
					className='grow [&_button]:pl-12 [&_input]:py-12 [&_input]:pr-12'
					placeholder='Search flashcards...'
				/>
				<SearchOptionsLinkButton href='/flashcards/sort' icon={faUpDown} />
				<SearchOptionsLinkButton href='/flashcards/filter' icon={faFilter} />
			</div>
			<Card />
		</div>
	)
}
