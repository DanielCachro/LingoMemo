'use client'
import {faRightFromBracket} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useRouter} from 'next/navigation'
import {useState} from 'react'
import ConfirmActionModal from '../_components/ConfirmActionModal'

export default function SignoutButton() {
	const [showDialog, setShowDialog] = useState(false)
	const router = useRouter()
	return (
		<div>
			<button
				onClick={() => setShowDialog(true)}
				className='mt-8 flex w-full cursor-pointer items-center justify-end gap-8 duration-150 hover:text-error-600'>
				<FontAwesomeIcon icon={faRightFromBracket} />
				Log out
			</button>
			{showDialog && (
				<ConfirmActionModal
					heading='You are about to log out'
					confirmButtonText='Log Out'
					confirmButtonTextPending='Signing Out...'
					onConfirm={() => router.push('/auth/signout')}
					onClose={() => setShowDialog(false)}>
					Do you want to proceed?
				</ConfirmActionModal>
			)}
		</div>
	)
}
