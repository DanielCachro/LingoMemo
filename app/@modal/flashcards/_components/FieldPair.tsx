'use client'
import Input from '@/components/Form/Input'
import {Field as HeadlessField, InputProps, Label} from '@headlessui/react'

type FieldConfig = {
	label: string
	className?: string
	onChange: (value: string) => void
	error?: boolean
	errorMessage?: string
} & Omit<InputProps, 'onChange' | 'error' | 'label' | 'className'>

type FieldPairProps = {
	firstField: FieldConfig
	secondField: FieldConfig
}

export default function FieldPair({firstField, secondField}: FieldPairProps) {
	return (
		<div className='flex w-full flex-wrap gap-12 [@media(min-width:410px)]:flex-nowrap'>
			<Field {...firstField} />
			<Field {...secondField} />
		</div>
	)
}

function Field({label, error, errorMessage, onChange, ...rest}: FieldConfig) {
	return (
		<HeadlessField className='w-full [@media(min-width:410px)]:w-1/2'>
			<Label className='sr-only'>{label}</Label>
			<Input {...rest} onChange={e => onChange(e.target.value)} error={error} errorMessage={errorMessage} />
		</HeadlessField>
	)
}
