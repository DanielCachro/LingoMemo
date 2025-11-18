'use client'
import {cn} from '@/lib/utils'
import {faPlusCircle, faTrashCan} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Textarea as HeadlessTextarea, TextareaProps} from '@headlessui/react'
import {useRef, useState} from 'react'

interface Props extends TextareaProps {
	name: string
	className?: string
	errorInIndexes?: number[]
	initialInputs?: string[]
}

export default function Arrayfield({errorInIndexes, className, name, initialInputs = []}: Props) {
	const [inputs, setInputs] = useState<string[]>(initialInputs)

	function handleAddInput() {
		const updated = [...inputs, '']
		setInputs(updated)
	}

	function handleRemoveInput(index: number) {
		const updated = inputs.filter((_, i) => i !== index)
		setInputs(updated)
	}

	return (
		<div className='space-y-12'>
			<input type='hidden' name={name} value={JSON.stringify(inputs.filter(Boolean))} />
			{inputs.map((value, index) => (
				<InputItem
					key={index}
					value={value}
					error={errorInIndexes?.includes(index)}
					className={className}
					onRemove={() => handleRemoveInput(index)}
					onChange={event => {
						const updated = [...inputs]
						updated[index] = event.target.value
						setInputs(updated)
					}}
				/>
			))}
			<button
				type='button'
				onClick={handleAddInput}
				className='flex w-full cursor-pointer flex-row items-center gap-8 rounded-sm border border-dashed border-primary-400 bg-primary-50 p-16 text-primary-400 transition-colors duration-100 hover:border-primary-500 hover:bg-primary-100 hover:text-primary-500'>
				<FontAwesomeIcon icon={faPlusCircle} />
				Add New Example
			</button>
		</div>
	)
}

function InputItem({
	error,
	className,
	onRemove,
	...props
}: {
	error?: boolean
	className?: string
	onRemove?: () => void
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
	)
}
