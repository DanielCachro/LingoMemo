import {Skeleton as SearchBarSkeleton} from '@/components/SearchBar'

export default function Loading() {
	return (
		<div className='flex h-full w-full animate-pulse flex-col items-center px-16 page-padding-y' role='status'>
			<span className='sr-only'>Loading dictionary view...</span>
			<div className={'flex h-full w-full max-w-640 flex-col'}>
				<SearchBarSkeleton />
				<div className='flex grow flex-col items-center justify-center space-y-32'>
					<div className='h-128 w-128 rounded-full bg-skeleton'></div>
					<div className='space-y-8'>
						<div className='h-8 w-192 rounded-full bg-skeleton'></div>
						<div className='h-8 w-128 rounded-full bg-skeleton'></div>
					</div>
				</div>
			</div>
		</div>
	)
}
