'use client'

import PrimaryButton from '@/components/PrimaryButton'
import {faGoogle} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useRouter} from 'next/navigation'

export default function LoginButton() {
	const router = useRouter()

	return (
		<PrimaryButton onClick={() => router.push('/auth/signin')}>
			<FontAwesomeIcon icon={faGoogle} size='lg' className='mr-12' />
			Sign in with Google
		</PrimaryButton>
	)
}
