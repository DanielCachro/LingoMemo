'use client'

import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'
import {useRouter} from 'next/navigation'
import {KeyboardEvent, useState} from 'react'
import Modal, {ModalDisableAnimations} from './Modal'

interface Props {
	heading: string
	children: React.ReactNode
	onConfirm: () => void | Promise<void>
	onCancel?: (handleClose: () => void) => void
	onClose?: () => void
	disableAnimations?: ModalDisableAnimations
}

export default function DeleteItemModal({heading, children, onConfirm, onCancel, onClose, disableAnimations}: Props) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const isDialogMode = !!onClose

	const handleClose = () => {
		if (onClose) {
			onClose()
		} else {
			router.back()
		}
	}

	const handleConfirmClick = async () => {
		try {
			setIsLoading(true)
			await onConfirm()
			handleClose()
		} catch (error) {
			// TODO: Show toast
			console.error('Error during deletion:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Modal
			header='none'
			heading='confirmation modal'
			mobileScreenCoverage='2/3'
			disableAnimations={disableAnimations}
			closingType={isDialogMode ? 'dialogClose' : 'navigateBack'}
			onClose={handleClose}>
			<div className='space-y-16 p-24'>
				<p>{heading}</p>
				<div className='rounded-sm border-2 border-background-200 p-16 dark:border-background-800'>{children}</div>
				<p>Are you sure?</p>

				<div className='space-x-16'>
					<SecondaryButton
						className='w-128'
						type='button'
						disabled={isLoading}
						onClick={handleConfirmClick}
						onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
							if (event.key === 'Enter') {
								event.stopPropagation()
							}
						}}>
						{isLoading ? <span className='animate-pulse'>Deleting...</span> : 'Yes, Delete'}
					</SecondaryButton>

					<PrimaryButton
						className='w-128'
						type='button'
						disabled={isLoading}
						onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
							if (event.key === 'Enter') {
								event.stopPropagation()
							}
						}}
						onClick={() => {
							if (onCancel) {
								onCancel(handleClose)
							} else {
								handleClose()
							}
						}}>
						No
					</PrimaryButton>
				</div>
			</div>
		</Modal>
	)
}
