import LinkTile from '@/components/LinkTile'
import {faPalette, faUsers} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import SignoutButton from './SignoutButton'

export default async function PreferencesModal() {
	'use cache'
	return (
		<div className='flex h-full flex-col justify-between gap-24'>
			<ul className='space-y-12'>
				<li>
					<LinkTile
						icon={<FontAwesomeIcon icon={faUsers} />}
						title='Learning Profile'
						href='preferences/learning-profile'
					/>
				</li>
				<li>
					<LinkTile icon={<FontAwesomeIcon icon={faPalette} />} title='Theme' href='preferences/theme' />
				</li>
			</ul>
			<SignoutButton />
		</div>
	)
}
