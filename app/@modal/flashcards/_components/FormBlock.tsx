import {cn} from '@/lib/utils/cn'

export default function FormBlock({
	title,
	children,
	className,
}: {
	title: string
	children: React.ReactNode
	className?: string
}) {
	return (
		<div className={cn(`space-y-12`, className)}>
			<p className='text-base font-bold'>{title}</p>
			{children}
		</div>
	)
}
