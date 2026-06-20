export default function Skeleton() {
	return (
		<div className='animate-pulse' role='status'>
			<span className='sr-only'>Loading dictionary entry...</span>
			<div className='relative mb-48 w-full space-y-24'>
				<div className='space-y-4'>
					<div className='h-8 w-64 rounded-full bg-skeleton'></div>
					<div className='h-8 w-32 rounded-full bg-skeleton'></div>
				</div>
				<div className='h-8 w-full max-w-192 rounded-full bg-skeleton'></div>
			</div>
			<div className='space-y-64 pb-48'>
				<div className='space-y-24'>
					<div className='space-y-8'>
						<div className='h-8 w-48 rounded-full bg-skeleton'></div>
						<div className='h-8 w-full max-w-256 rounded-full bg-skeleton'></div>
					</div>
					<DefinitionSkeleton variant='1' />
					<DefinitionSkeleton variant='3' />
					<DefinitionSkeleton variant='2' />
					<DefinitionSkeleton variant='3' />
					<DefinitionSkeleton variant='2' />
					<DefinitionSkeleton variant='1' />
					<DefinitionSkeleton variant='3' />
				</div>
			</div>
		</div>
	)
}

function DefinitionSkeleton({variant}: {variant: '1' | '2' | '3'}) {
	if (variant === '1') {
		return (
			<div className={`flex w-full flex-col justify-center gap-32 rounded-sm bg-skeleton p-24`}>
				<div className='space-y-8'>
					<div className='h-8 w-full rounded-full bg-skeleton-accent'></div>
					<div className='h-8 w-full max-w-192 rounded-full bg-skeleton-accent'></div>
				</div>
				<div className='space-y-8'>
					<div className='h-8 w-full max-w-48 rounded-full bg-skeleton-accent'></div>
					<div className='h-8 w-full max-w-128 rounded-full bg-skeleton-accent'></div>
				</div>
			</div>
		)
	}
	if (variant === '2') {
		return (
			<div className={`flex w-full flex-col justify-center gap-32 rounded-sm bg-skeleton p-24`}>
				<div className='space-y-8'>
					<div className='h-8 w-full rounded-full bg-skeleton-accent'></div>
				</div>
				<div className='space-y-8'>
					<div className='h-8 w-full max-w-48 rounded-full bg-skeleton-accent'></div>
					<div className='h-8 w-full max-w-192 rounded-full bg-skeleton-accent'></div>
				</div>
			</div>
		)
	}
	if (variant === '3') {
		return (
			<div className={`flex w-full flex-col justify-center gap-32 rounded-sm bg-skeleton p-24`}>
				<div className='space-y-8'>
					<div className='h-8 w-full rounded-full bg-skeleton-accent'></div>
					<div className='h-8 w-full rounded-full bg-skeleton-accent'></div>
					<div className='h-8 w-full max-w-128 rounded-full bg-skeleton-accent'></div>
				</div>
			</div>
		)
	}
}
