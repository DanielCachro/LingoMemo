'use client'
import Input from '@/components/Form/Input'
import {Field as HeadlessField, InputProps, Label} from '@headlessui/react'

type FieldConfig = {
	label: string
	className?: string
	error?: string[]
	onChange: (value: string) => void
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

function ErrorMessage({error}: {error?: string[]}) {
	if (!error?.length) return null
	return <p className='mt-8 text-sm text-error-500'>{error[0]}</p>
}

function Field({label, error, onChange, ...rest}: FieldConfig) {
	return (
		<HeadlessField className='w-full [@media(min-width:410px)]:w-1/2'>
			<Label className='sr-only'>{label}</Label>
			<Input {...rest} onChange={e => onChange(e.target.value)} error={!!error} />
			{error && <ErrorMessage error={error} />}
		</HeadlessField>
	)
}
