'use client'
import {cn} from '@/lib/utils'
import {faPlus, faXmark} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Input as HeadlessInput, InputProps} from '@headlessui/react'
import {useEffect, useState} from 'react'
import ErrorMessage from './ErrorMessage'

interface Props extends InputProps {
	name: string
	className?: string
	initialTags?: string[]
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	onTagRemove?: (index: number) => void
	errorInTag?: {
		index: number
		message?: string
	}[]
}

export default function TagInput({
	className,
	name,
	initialTags = [],
	onChange,
	onTagRemove,
	errorInTag,
	...props
}: Props) {
	const [inputValue, setInputValue] = useState('')
	const [tags, setTags] = useState<string[]>(Array.from(new Set(initialTags)))
	const [errors, setErrors] = useState(errorInTag ?? [])
	function handleAddTag() {
		const trimmed = inputValue.trim()
		if (!trimmed) return
		const updated = Array.from(new Set([...tags, trimmed]))
		setTags(updated)
		setInputValue('')
	}

	function handleRemoveTag(index: number) {
		const updated = tags.filter((_, i) => i !== index)
		const updatedErrors = errors
			.filter(error => error.index !== index)
			.map(error => ({
				...error,
				index: error.index > index ? error.index - 1 : error.index,
			}))

		setTags(updated)
		setErrors(updatedErrors)
		onTagRemove?.(index)
	}

	function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleAddTag()
		}
	}

	useEffect(() => {
		setErrors(errorInTag ?? [])
	}, [errorInTag])

	return (
		<div>
			<div className='space-y-16'>
				<input type='hidden' name={name} value={JSON.stringify(tags)} />

				<div className='flex flex-wrap gap-8'>
					{tags.map((tag, index) => {
						const tagError = errors.find(error => error.index === index)
						return <Tag key={tag} tag={tag} onRemove={() => handleRemoveTag(index)} error={!!tagError} />
					})}
				</div>
				<div
					className={cn(
						'flex space-x-12 rounded-sm border-2 border-background-300 bg-background-50 px-16 py-16 text-base placeholder-background-400 placeholder:font-medium focus-within:border-background-400 focus:outline-none dark:border-background-700 dark:bg-background-900 dark:focus-within:border-background-600',
						className,
					)}>
					<HeadlessInput
						{...props}
						value={inputValue}
						onChange={e => {
							setInputValue(e.target.value)
							onChange?.(e)
						}}
						className='grow focus:outline-none'
						onKeyDown={handleEnter}
					/>
					<button
						type='button'
						onClick={handleAddTag}
						className='h-24 w-24 cursor-pointer rounded-sm bg-primary-100 text-primary-500 hover:text-primary-400 dark:bg-primary-600 dark:text-primary-200 dark:hover:text-primary-100'>
						<FontAwesomeIcon size='sm' icon={faPlus} />
					</button>
				</div>
			</div>
			{(() => {
				const message = errors.find(error => error.message)?.message
				return message ? <ErrorMessage error={message} /> : null
			})()}
		</div>
	)
}

function Tag({tag, onRemove, error}: {tag: string; onRemove: () => void; error: boolean}) {
	return (
		<div>
			<div
				className={cn(
					'flex gap-8 rounded-full bg-primary-100 px-12 py-8 text-primary-500 dark:bg-primary-600 dark:text-primary-100',
					{
						'bg-error-200 text-error-600 ring ring-error-600 dark:bg-error-600 dark:text-error-100 dark:ring-transparent':
							error,
					},
				)}>
				{tag}
				<button
					type='button'
					className={cn('cursor-pointer hover:text-primary-400 dark:hover:text-primary-200', {
						'hover:text-error-500 dark:hover:text-error-200': error,
					})}
					onClick={onRemove}>
					<FontAwesomeIcon size='sm' icon={faXmark} />
				</button>
			</div>
		</div>
	)
}
