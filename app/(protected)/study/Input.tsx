export default function Input() {
	return (
		<input
			type='text'
			placeholder='Type your answer...'
			enterKeyHint='enter'
			className='w-full rounded-sm bg-primary-500 p-12 text-primary-50 ring-primary-300 placeholder:text-primary-300 focus:ring-2 focus:outline-none sm:py-16 dark:bg-primary-600 dark:text-primary-100 dark:ring-primary-400 dark:placeholder:text-primary-400'
		/>
	)
}
