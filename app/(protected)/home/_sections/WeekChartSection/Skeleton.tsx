function ChartBarSkeleton({className}: {className?: string}) {
	return (
		<div className={`relative w-48 rounded-sm bg-skeleton ${className}`}>
			<div className='absolute -bottom-24 h-8 w-full rounded-full bg-skeleton'></div>
		</div>
	)
}

export default function Skeleton() {
	return (
		<div className='mb-32 animate-pulse flex-col items-center overflow-hidden py-48 min-[26.8rem]:flex'>
			<div className='flex flex-col items-start gap-48'>
				<div className='ml-24 h-12 w-256 rounded-full bg-skeleton pb-8 sm:m-0'></div>
				<div className='flex items-end gap-8 pl-24 sm:p-0'>
					<ChartBarSkeleton className='h-48' />
					<ChartBarSkeleton className='h-24' />
					<ChartBarSkeleton className='h-96' />
					<ChartBarSkeleton className='h-8' />
					<ChartBarSkeleton className='h-64' />
					<ChartBarSkeleton className='h-24' />
					<ChartBarSkeleton className='h-64' />
				</div>
			</div>
		</div>
	)
}
