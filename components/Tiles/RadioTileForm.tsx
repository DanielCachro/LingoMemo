'use client'
import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'
import {cn} from '@/lib/utils'
import {ChangeEvent, FormEvent, ReactNode, useId, useState} from 'react'
import RadioTile from './RadioTile'

interface RadioTileFormProps {
	radios: {children: ReactNode; value: string}[]
	initialSelectedRadio: string
	onSubmit: (selectedOption: string) => void
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

export default function RadioTileForm({
	radios,
	initialSelectedRadio,
	onSubmit,
	submitButtonText = 'Submit',
	radioGroupName,
	additionalButtons,
	className,
	radioGroupClassName,
	buttonsGroupClassName,
}: RadioTileFormProps) {
	const [selectedRadio, setSelectedRadio] = useState<string>(initialSelectedRadio)
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
		<form onSubmit={handleSubmit} className={cn('flex h-full flex-col justify-between', className)}>
			{/* -mr-16 and pr-16 to add a gap between the content and the scroll bar */}
			<div className={cn('-mr-16 min-h-0 overflow-y-auto pr-16', radioGroupClassName)}>
				<div className='sm:p-6 flex flex-col space-y-12'>
					{radios.map(radio => (
						<RadioTile
							key={radio.value}
							name={name}
							value={radio.value}
							checked={selectedRadio === radio.value}
							onChange={handleChange}>
							{radio.children}
						</RadioTile>
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
