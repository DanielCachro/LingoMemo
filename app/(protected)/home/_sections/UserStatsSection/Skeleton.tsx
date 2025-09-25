export default function Skeleton() {
	return (
		<div role='status' className='flex w-full animate-pulse items-center justify-center py-48 lg:w-auto'>
			<div className='mx-24 w-full space-y-24'>
				<div className='h-12 w-full rounded-full bg-background-700 lg:w-192'></div>
				<div className='h-96 w-full rounded-sm bg-background-700 lg:w-256'></div>
			</div>
		</div>
	)
}
