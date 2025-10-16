import {faPalette, faUsers} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import LinkTile from './_components/LinkTile'

export default function PreferencesModal() {
	return (
		<ul className='space-y-12'>
			<li>
				<LinkTile
					title='Learning Profile'
					href='preferences/learning-profile'
					icon={<FontAwesomeIcon icon={faUsers} />}
				/>
			</li>
			<li>
				<LinkTile title='Theme' href='preferences/theme' icon={<FontAwesomeIcon icon={faPalette} />} />
			</li>
		</ul>
	)
}
