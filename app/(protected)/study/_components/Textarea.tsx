import React from 'react'

export default function Textarea({
	ref,
	...props
}: React.InputHTMLAttributes<HTMLTextAreaElement> & {ref?: React.Ref<HTMLTextAreaElement>}) {
	return (
		<textarea
			{...props}
			ref={ref}
			autoComplete='off'
			spellCheck={false}
			rows={1}
			placeholder='Type your answer...'
			className='w-full rounded-sm bg-primary-500 p-12 text-primary-50 ring-primary-300 placeholder:text-primary-300 focus:ring-2 focus:outline-none sm:py-16 dark:bg-primary-600 dark:text-primary-100 dark:ring-primary-400 dark:placeholder:text-primary-400'
		/>
	)
}

export function Skeleton() {
	return <div role='status' className='h-48 w-full animate-pulse rounded-sm bg-skeleton'></div>
}
