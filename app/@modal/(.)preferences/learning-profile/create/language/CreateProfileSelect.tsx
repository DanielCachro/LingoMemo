'use client'
import type {Option} from '@/components/Form/Select'
import Select from '@/components/Form/Select'
import {Field, Label} from '@headlessui/react'

interface Props {
	options: Option[]
	name: string
	onFocus: () => void
	label?: string
	placeholder?: string
	errorMessage?: string
}

export default function CreateProfileSelect({
	options,
	name,
	onFocus,
	label,
	placeholder = 'Please choose a language',
	errorMessage,
}: Props) {
	return (
		<Field className='flex flex-col gap-8'>
			{label && <Label className='font-bold'>{label}</Label>}
			<Select
				name={name}
				placeholder={placeholder}
				options={options}
				onFocus={onFocus}
				error={errorMessage !== undefined}
			/>
			{errorMessage && <p className='text-sm text-error-500'>{errorMessage}</p>}
		</Field>
	)
}
