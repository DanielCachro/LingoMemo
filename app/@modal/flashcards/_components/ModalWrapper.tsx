'use client'
import PrimaryButton from '@/components/PrimaryButton'
import dynamic from 'next/dynamic'
import {FormEvent, ReactNode} from 'react'

const Modal = dynamic(() => import('../../_components/Modal'), {ssr: false})

type ModalWrapperBaseProps = {
	title: string
	buttonContent: ReactNode
	onReset?: () => void
	children: ReactNode
}

type ModalWrapperFormProps = ModalWrapperBaseProps & {
	useForm: true
	onSubmit: (event: FormEvent<HTMLFormElement>, closeModal: () => void) => void
}

type ModalWrapperDivProps = ModalWrapperBaseProps & {
	useForm: false
	onSubmit: (closeModal: () => void) => void
}

type ModalWrapperProps = ModalWrapperFormProps | ModalWrapperDivProps

export default function ModalWrapper(props: ModalWrapperProps) {
	const {title, buttonContent, onReset, children} = props

	return (
		<Modal header='none' heading={title} mobileScreenCoverage='2/3'>
			{closeModal => {
				const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
					if (props.useForm && event) props.onSubmit(event, closeModal)
					else if (!props.useForm) props.onSubmit(closeModal)
				}

				const commonContent = (
					<>
						<div className='flex justify-between sm:mt-16'>
							<h3 className='text-xl font-bold'>{title}</h3>
							{onReset && (
								<button
									type='button'
									onClick={onReset}
									className='cursor-pointer text-primary-500 dark:text-primary-600 pointer-fine:hover:text-primary-400 dark:pointer-fine:hover:text-primary-500'>
									Reset
								</button>
							)}
						</div>

						<div className='-mr-16 flex min-h-0 flex-col space-y-24 overflow-y-auto pr-16 text-xl font-bold'>
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
						{commonContent}
					</form>
				) : (
					<div className='flex h-full flex-col justify-between space-y-16 p-16 pt-0'>{commonContent}</div>
				)
			}}
		</Modal>
	)
}
