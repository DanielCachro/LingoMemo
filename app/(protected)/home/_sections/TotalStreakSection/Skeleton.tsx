export default function Skeleton() {
	return (
		<div role='status' className='relative flex animate-pulse flex-col items-center justify-center gap-64 pb-48'>
			<div className='relative flex size-128 flex-col items-center justify-center rounded-full bg-skeleton'></div>
			<div className='flex flex-col items-center gap-12'>
				<div className='h-24 w-192 rounded-full bg-skeleton text-2xl font-black sm:text-3xl'></div>
				<div className='h-16 w-256 rounded-full bg-skeleton text-2xl font-black sm:text-3xl'></div>
			</div>
			<div className='flex flex-col items-center gap-12'>
				<div className='h-12 w-256 rounded-full bg-skeleton text-2xl font-black sm:text-3xl'></div>
				<div className='h-32 w-256 rounded-full bg-skeleton text-2xl font-black sm:text-3xl'></div>
			</div>
			<div className='absolute -top-48 right-0 -bottom-48 left-0 -z-50 section-pattern sm:-top-64'></div>
		</div>
	)
}
