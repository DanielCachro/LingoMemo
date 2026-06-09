import LinkTile from '@/components/LinkTile'
import {faLanguage, faSignature} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export default async function CreateLearningProfileModal() {
	'use cache'
	return (
		<div className='space-y-12'>
			<h2 className='font-bold'>I want to create:</h2>
			<LinkTile
				icon={<FontAwesomeIcon icon={faLanguage} />}
				title='Language Profile'
				href='/preferences/learning-profile/create/language'
				prefetch={true}
			/>
			<LinkTile
				icon={<FontAwesomeIcon icon={faSignature} />}
				title='Self-Study Profile'
				href='/preferences/learning-profile/create/self-study'
				prefetch={true}
			/>
		</div>
	)
}
