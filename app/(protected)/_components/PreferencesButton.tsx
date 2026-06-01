'use client'
import PrimaryButton from '@/components/PrimaryButton'
import {faSliders} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useRouter} from 'next/navigation'

export default function PreferencesButton() {
	const router = useRouter()
	return (
		<PrimaryButton onClick={() => router.push('/preferences')}>
			<FontAwesomeIcon icon={faSliders} />
		</PrimaryButton>
	)
}
