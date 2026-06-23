import LinkTile from '@/components/LinkTile'
import {faLanguage, faSignature} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Setup - LingoMemo',
	description: 'Setup your language or self-study profile to get started with LingoMemo.',
}

export default function SetupPage() {
	return (
		<div className='space-y-12'>
			<LinkTile icon={<FontAwesomeIcon icon={faLanguage} />} title='Language Profile' href='/setup/profile/language' />
			<LinkTile
				icon={<FontAwesomeIcon icon={faSignature} />}
				title='Self-Study Profile'
				href='/setup/profile/self-study'
			/>
		</div>
	)
}
