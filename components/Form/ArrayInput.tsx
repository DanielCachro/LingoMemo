'use client'
import {cn} from '@/lib/utils'
import {faPlusCircle, faTrashCan} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Textarea as HeadlessTextarea, TextareaProps} from '@headlessui/react'
import {useEffect, useRef, useState} from 'react'
import ErrorMessage from './ErrorMessage'

interface Props extends TextareaProps {
	name: string
	buttonContent?: React.ReactNode
	className?: string
	initialInputs?: string[]
	onInputChange?: (index: number) => void
	onInputRemove?: (index: number) => void
	errorInInput?: {
		index: number
		message?: string
	}[]
}

export default function ArrayInput({
	className,
	name,
	initialInputs = [],
	buttonContent = 'Add New',
	onInputChange,
	onInputRemove,
	errorInInput,
}: Props) {
	const [inputs, setInputs] = useState<string[]>(initialInputs)
	const [errors, setErrors] = useState(errorInInput ?? [])

	function handleAddInput() {
		const updated = [...inputs, '']
		setInputs(updated)
	}

	function handleRemoveInput(index: number) {
		const updatedInputs = inputs.filter((_, i) => i !== index)
		const updatedErrors = errors
			.filter(error => error.index !== index)
			.map(error => ({
				...error,
				index: error.index > index ? error.index - 1 : error.index,
			}))

		setInputs(updatedInputs)
		setErrors(updatedErrors)
		onInputRemove?.(index)
	}

	useEffect(() => {
		setErrors(errorInInput ?? [])
	}, [errorInInput])

	return (
		<div className='space-y-12'>
			<input type='hidden' name={name} value={JSON.stringify(inputs)} />
			{inputs.map((value, index) => {
				const inputError = errors.find(error => error.index === index)
				return (
					<InputItem
						key={index}
						value={value}
						className={className}
						onRemove={() => handleRemoveInput(index)}
						onChange={event => {
							const updated = [...inputs]
							updated[index] = event.target.value
							setInputs(updated)

							if (onInputChange) {
								onInputChange(index)
							}
						}}
						error={!!inputError}
						errorMessage={inputError?.message}
					/>
				)
			})}
			<button
				type='button'
				onClick={handleAddInput}
				className='flex w-full cursor-pointer flex-row items-center gap-8 rounded-sm border border-dashed border-primary-400 bg-primary-50 p-16 text-primary-400 transition-colors duration-100 hover:border-primary-500 hover:bg-primary-100 hover:text-primary-500 dark:border-primary-400 dark:bg-primary-800 dark:text-primary-300 dark:hover:border-primary-300 dark:hover:bg-primary-700 dark:hover:text-primary-200'>
				<FontAwesomeIcon icon={faPlusCircle} />
				{buttonContent}
			</button>
		</div>
	)
}

function InputItem({
	className,
	onRemove,
	error,
	errorMessage,
	...props
}: {
	className?: string
	onRemove?: () => void
	error?: boolean
	errorMessage?: string
} & Omit<Props, 'name' | 'initialInputs'>) {
	const ref = useRef<HTMLTextAreaElement>(null)

	function handleInputResize() {
		const textarea = ref.current
		if (!textarea) return

		// Auto to reduce height when deleting content
		textarea.style.height = 'auto'
		// and then expand to fit content
		textarea.style.height = `${textarea.scrollHeight}px`
	}

	return (
		<div>
			<div
				className={cn(
					'flex items-center space-x-12 rounded-sm border-2 border-background-300 bg-background-50 p-16 text-base placeholder-background-400 placeholder:font-medium focus-within:border-background-400 focus:outline-none dark:border-background-700 dark:bg-background-900 dark:focus-within:border-background-600',
					{
						'border-error-400 dark:border-error-700': error,
					},
					className,
				)}>
				<HeadlessTextarea
					ref={ref}
					onInput={handleInputResize}
					rows={1}
					{...props}
					className='no-scrollbar grow resize-none focus:outline-none'
				/>
				<button type='button' className='h-24 w-24 cursor-pointer'>
					<FontAwesomeIcon
						icon={faTrashCan}
						onClick={onRemove}
						className='text-error-500 hover:cursor-pointer hover:text-error-600'
					/>
				</button>
			</div>
			{errorMessage && <ErrorMessage error={errorMessage} />}
		</div>
	)
}
