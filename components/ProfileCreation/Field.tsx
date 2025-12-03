'use client'
import Input from '@/components/Form/Input'
import type {Option} from '@/components/Form/Select'
import Select from '@/components/Form/Select'
import {Field, Label} from '@headlessui/react'

interface SelectFieldProps {
	type: 'select'
	options: Option[]
}

interface TextFieldProps {
	type: 'input'
	onChange?: () => void
}

type Props = {
	name: string
	onFocus?: () => void
	label?: string
	placeholder?: string
	errorMessage?: string
} & (SelectFieldProps | TextFieldProps)

export default function CreateProfileField(props: Props) {
	const {name, onFocus, label, errorMessage} = props

	function renderField() {
		if (props.type === 'select') {
			const {options, placeholder = 'Please choose an option'} = props
			return (
				<Select
					name={name}
					placeholder={placeholder}
					options={options}
					onFocus={onFocus}
					error={errorMessage !== undefined}
					errorMessage={errorMessage}
				/>
			)
		}

		if (props.type === 'input') {
			const {placeholder = 'Please enter a value', onChange} = props
			return (
				<Input
					type='text'
					name={name}
					placeholder={placeholder}
					onFocus={onFocus}
					onChange={onChange}
					error={errorMessage !== undefined}
					errorMessage={errorMessage}
				/>
			)
		}

		return null
	}

	return (
		<Field className='flex flex-col gap-8'>
			{label && <Label className='font-bold'>{label}</Label>}
			{renderField()}
		</Field>
	)
}
