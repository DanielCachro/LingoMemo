'use client'

import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'
import {useRouter} from 'next/navigation'
import {KeyboardEvent, useState} from 'react'
import {toast} from 'react-toastify'
import Modal, {ModalDisableAnimations, ModalSkeleton} from './Modal'

interface Props {
	heading: string
	children: React.ReactNode
	confirmButtonText?: string
	confirmButtonTextPending?: string
	cancelButtonText?: string
	onConfirm: () => void | Promise<void>
	onCancel?: (handleClose: () => void) => void
	onClose?: () => void
	disableAnimations?: ModalDisableAnimations
}

export default function ConfirmActionModal({
	heading,
	children,
	confirmButtonText = 'Yes',
	confirmButtonTextPending = 'Processing...',
	cancelButtonText = 'No',
	onConfirm,
	onCancel,
	onClose,
	disableAnimations,
}: Props) {
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
			toast.error('An error occurred while deleting the item.')
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
				<div className='max-h-[15rem] max-w-full overflow-y-auto rounded-sm border-2 border-background-200 p-16 wrap-break-word dark:border-background-800'>
					{children}
				</div>
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
						{isLoading ? <span className='animate-pulse'>{confirmButtonTextPending}</span> : confirmButtonText}
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
						{cancelButtonText}
					</PrimaryButton>
				</div>
			</div>
		</Modal>
	)
}

export function Skeleton({heading, disableAnimations}: {heading: string; disableAnimations?: ModalDisableAnimations}) {
	return (
		<ModalSkeleton mobileScreenCoverage='2/3' disableAnimations={disableAnimations}>
			<div className='animate-pulse space-y-16 p-24'>
				<p>{heading}</p>

				<div className='max-h-[15rem] w-full overflow-y-auto rounded-sm border-2 border-background-200 p-16 dark:border-background-800'>
					<div className='space-y-12'>
						<div className='h-16 w-3/4 rounded-full bg-skeleton' />
						<div className='h-16 w-full rounded-full bg-skeleton' />
						<div className='h-16 w-5/6 rounded-full bg-skeleton' />
					</div>
				</div>

				<p>Are you sure?</p>

				<div className='flex space-x-16'>
					<div className='h-48 w-128 shrink-0 rounded-md bg-skeleton opacity-50' />
					<div className='h-48 w-128 shrink-0 rounded-md bg-skeleton opacity-50' />
				</div>
			</div>
		</ModalSkeleton>
	)
}
