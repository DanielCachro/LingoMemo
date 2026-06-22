'use client'
import {cn} from '@/lib/utils/cn'
import {faChevronDown} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from '@headlessui/react'
import {useState} from 'react'
import ErrorMessage from './HeadlessErrorMessage'

export type Option = {
	value: string
	label: string
	disabled?: boolean
}

interface SelectProps {
	options: Option[]
	name: string
	placeholder?: string
	onFocus?: () => void
	error?: boolean
	errorMessage?: string
}

export default function Select({
	options,
	name,
	placeholder = 'Please select...',
	onFocus,
	error,
	errorMessage,
}: SelectProps) {
	const [selectedOption, setSelectedOption] = useState<Option | null>(null)

	return (
		<div>
			<div className='relative w-full'>
				<Listbox name={name} value={selectedOption} onChange={setSelectedOption}>
					<ListboxButton
						onFocus={onFocus}
						className={cn(
							'flex w-full items-center rounded-sm border-2 border-background-300 p-16 text-left hover:cursor-pointer dark:border-background-700',
							{
								'border-error-400 dark:border-error-700': error,
							},
						)}>
						{({open}) => (
							<>
								{selectedOption ? (
									selectedOption.label
								) : (
									<span className='dark:text-background-500'>{placeholder}</span>
								)}
								<FontAwesomeIcon
									className={`ml-auto transition-transform duration-100 ${open ? '-rotate-180' : ''}`}
									icon={faChevronDown}
								/>
							</>
						)}
					</ListboxButton>
					<ListboxOptions className='border-gray-200 absolute z-50 mt-4 max-h-192 w-full overflow-auto rounded-sm border-2 border-background-300 bg-background-100 shadow-lg dark:border-background-700 dark:bg-background-900'>
						{options.map(option => (
							<ListboxOption
								key={option.value}
								value={option}
								disabled={option.disabled}
								className='cursor-pointer px-16 py-12 select-none disabled:opacity-50 data-focus:bg-background-200 data-selected:bg-background-200 dark:data-focus:bg-background-800 dark:data-selected:bg-background-800'>
								{option.label}
							</ListboxOption>
						))}
					</ListboxOptions>
				</Listbox>
			</div>
			{errorMessage && <ErrorMessage error={errorMessage} />}
		</div>
	)
}
