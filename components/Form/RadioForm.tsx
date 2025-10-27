'use client'
import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'
import {cn} from '@/lib/utils'
import {ChangeEvent, FormEvent, ReactNode, useId, useState} from 'react'
import RadioButton from './RadioButton'

export type RadioOption = {children: ReactNode; value: string}

interface Props {
	options: RadioOption[]
	onSubmit: (selectedOption: string) => void
	initialSelectedRadioValue?: string
	submitButtonText?: ReactNode
	radioGroupName?: string
	additionalButtons?: {
		id: string
		type: 'primary' | 'secondary'
		onClick: () => void
		disabled?: boolean
		children: ReactNode
	}[]
	className?: string
	radioGroupClassName?: string
	buttonsGroupClassName?: string
}

export default function RadioForm({
	options,
	initialSelectedRadioValue,
	onSubmit,
	submitButtonText = 'Submit',
	radioGroupName,
	additionalButtons,
	className,
	radioGroupClassName,
	buttonsGroupClassName,
}: Props) {
	const [selectedRadio, setSelectedRadio] = useState<string>(initialSelectedRadioValue || options[0].value)
	const fallbackId = useId()
	const name = radioGroupName || fallbackId

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSelectedRadio(event.target.value)
	}

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault()
		onSubmit(selectedRadio)
	}

	return (
		<form onSubmit={handleSubmit} className={cn('flex h-full flex-col justify-between space-y-48', className)}>
			{/* -mr-16 and pr-16 to add a gap between the content and the scroll bar */}
			<div className={cn('-mr-16 min-h-0 overflow-y-auto pr-16', radioGroupClassName)}>
				<div className='sm:p-6 flex flex-col space-y-12'>
					{options.map(option => (
						<RadioButton
							key={option.value}
							name={name}
							value={option.value}
							checked={selectedRadio === option.value}
							onChange={handleChange}>
							{option.children}
						</RadioButton>
					))}
				</div>
			</div>
			<div className={cn('flex flex-col space-y-12', buttonsGroupClassName)}>
				{additionalButtons &&
					additionalButtons.map(button =>
						button.type === 'primary' ? (
							<PrimaryButton type='button' key={button.id} onClick={button.onClick} disabled={button.disabled}>
								{button.children}
							</PrimaryButton>
						) : (
							<SecondaryButton type='button' key={button.id} onClick={button.onClick} disabled={button.disabled}>
								{button.children}
							</SecondaryButton>
						),
					)}
				<PrimaryButton type='submit'>{submitButtonText}</PrimaryButton>
			</div>
		</form>
	)
}

export function Skeleton() {
	return (
		<div className='flex h-full flex-col justify-between gap-48'>
			<div className='animate-pulse space-y-12'>
				<div className='h-128 w-full rounded-sm bg-skeleton' />
				<div className='h-128 w-full rounded-sm bg-skeleton' />
			</div>
			<div className='animate-pulse space-y-12'>
				<div className='h-48 w-full rounded-sm bg-skeleton' />
				<div className='h-48 w-full rounded-sm bg-skeleton' />
			</div>
		</div>
	)
}
