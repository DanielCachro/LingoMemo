export default function Section({title, children}: {title: string; children: React.ReactNode}) {
	return (
		<section>
			<h2 className='mb-12 text-2xl font-bold text-background-900 dark:text-background-100'>{title}</h2>
			{children}
		</section>
	)
}
