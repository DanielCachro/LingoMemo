export default function FormSection({title, children}: {title: string; children: React.ReactNode}) {
	return (
		<div className='space-y-16'>
			<div className='relative'>
				<h3 className='font-bold text-primary-500 dark:text-primary-600'>{title}</h3>
				<div className='absolute h-px w-full bg-background-200 dark:bg-background-800' aria-hidden='true'></div>
			</div>
			{children}
		</div>
	)
}
