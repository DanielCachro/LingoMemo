import PrimaryButton from '@/components/PrimaryButton'
import {faSliders} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export default function PreferencesButton() {
	return (
		<PrimaryButton href='/preferences' scroll={false} aria-label='Preferences' title='Preferences'>
			<FontAwesomeIcon icon={faSliders} />
		</PrimaryButton>
	)
}
