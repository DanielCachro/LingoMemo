'use client'
import PrimaryButton from '@/components/PrimaryButton'
import {Fieldset, Legend} from '@headlessui/react'
import dynamic from 'next/dynamic'
import {FormEvent, ReactNode} from 'react'
import {ModalDisableAnimations} from './Modal'

const Modal = dynamic(() => import('./Modal'), {ssr: false})

type MobileScreenCoverage = React.ComponentProps<typeof Modal>['mobileScreenCoverage']

type BaseProps = {
	title: string
	subtitleContent?: ReactNode
	buttonContent?: ReactNode
	mobileScreenCoverage?: MobileScreenCoverage
	onReset?: () => void
	children: ReactNode
	disableAnimations?: ModalDisableAnimations
	modalCloseRef?: React.RefObject<(() => void) | null>
}

type FormProps = BaseProps & {
	useForm: true
	onSubmit: (event: FormEvent<HTMLFormElement>, closeModal: () => void) => void
}

type DivProps = BaseProps & {
	useForm: false
	onSubmit: (closeModal: () => void) => void
}

type Props = FormProps | DivProps

export default function LeftAlignedModal(props: Props) {
	const {
		title,
		subtitleContent,
		buttonContent,
		mobileScreenCoverage = '9/10',
		onReset,
		children,
		disableAnimations,
		modalCloseRef,
	} = props

	return (
		<Modal
			className='overflow-hidden'
			header='none'
			heading={title}
			mobileScreenCoverage={mobileScreenCoverage}
			disableAnimations={disableAnimations}>
			{closeModal => {
				if (modalCloseRef) {
					modalCloseRef.current = closeModal
				}

				const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
					if (props.useForm && event) props.onSubmit(event, closeModal)
					else if (!props.useForm) props.onSubmit(closeModal)
				}

				const commonContent = (
					<>
						<div className='flex justify-between sm:mt-16'>
							<div>
								<h2 className='text-xl font-bold'>{title}</h2>
								{subtitleContent}
							</div>
							{onReset && (
								<button
									type='button'
									onClick={onReset}
									className='cursor-pointer text-primary-500 dark:text-primary-600 pointer-fine:hover:text-primary-400 dark:pointer-fine:hover:text-primary-500'>
									Reset
								</button>
							)}
						</div>

						<div className='-mr-16 flex h-full min-h-0 flex-col justify-start space-y-24 overflow-y-auto pr-16'>
							{children}
						</div>

						<PrimaryButton
							type={props.useForm ? 'submit' : 'button'}
							onClick={props.useForm ? undefined : () => handleSubmit()}>
							{buttonContent}
						</PrimaryButton>
					</>
				)

				return props.useForm ? (
					<form className='flex h-full flex-col justify-between space-y-16 p-16 pt-0' onSubmit={handleSubmit}>
						<Fieldset className='flex min-h-0 w-full min-w-0 flex-col space-y-24'>
							<Legend className='sr-only'>{title}</Legend>
							{commonContent}
						</Fieldset>
					</form>
				) : (
					<div className='flex h-full flex-col justify-between space-y-16 p-16 pt-0'>{commonContent}</div>
				)
			}}
		</Modal>
	)
}
