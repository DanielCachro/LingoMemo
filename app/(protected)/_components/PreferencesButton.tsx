import PrimaryButton from '@/components/PrimaryButton'
import {faSliders} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export default function PreferencesButton() {
	return (
		<Link href='/preferences' scroll={false}>
			<PrimaryButton>
				<FontAwesomeIcon icon={faSliders} />
			</PrimaryButton>
		</Link>
	)
}
