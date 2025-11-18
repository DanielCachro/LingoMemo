'use client'
import {cn} from '@/lib/utils'
import {faPlus, faXmark} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Input as HeadlessInput, InputProps} from '@headlessui/react'
import {useState} from 'react'

interface Props extends InputProps {
	name: string
	className?: string
	error?: boolean
	initialTags?: string[]
}

export default function TagField({error, className, name, initialTags = [], ...props}: Props) {
	const [inputValue, setInputValue] = useState('')
	const [tags, setTags] = useState<string[]>(Array.from(new Set(initialTags)))

	function handleAddTag() {
		const trimmed = inputValue.trim()
		if (!trimmed) return
		const updated = Array.from(new Set([...tags, trimmed]))
		setTags(updated)
		setInputValue('')
	}

	function handleRemoveTag(tagToRemove: string) {
		const updated = tags.filter(tag => tag !== tagToRemove)
		setTags(updated)
	}

	function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleAddTag()
		}
	}

	return (
		<div className='space-y-16'>
			<input type='hidden' name={name} value={JSON.stringify(tags)} />

			<div className='flex flex-wrap gap-8'>
				{tags.map(tag => (
					<Tag key={tag} tag={tag} onRemove={handleRemoveTag} />
				))}
			</div>
			<div
				className={cn(
					'flex space-x-12 rounded-sm border-2 border-background-300 bg-background-50 px-16 py-16 text-base placeholder-background-400 placeholder:font-medium focus-within:border-background-400 focus:outline-none dark:border-background-700 dark:bg-background-900 dark:focus-within:border-background-600',
					{
						'border-error-400 dark:border-error-700': error,
					},
					className,
				)}>
				<HeadlessInput
					{...props}
					value={inputValue}
					onChange={e => setInputValue(e.target.value)}
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
	)
}

function Tag({tag, onRemove}: {tag: string; onRemove: (tag: string) => void}) {
	return (
		<div className='flex gap-8 rounded-full bg-primary-100 px-12 py-8 text-primary-500 dark:bg-primary-600 dark:text-primary-100'>
			{tag}
			<button
				type='button'
				className='cursor-pointer hover:text-primary-400 dark:hover:text-primary-200'
				onClick={() => onRemove(tag)}>
				<FontAwesomeIcon size='sm' icon={faXmark} />
			</button>
		</div>
	)
}
