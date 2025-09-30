import {Skeleton as StudyClientSkeleton} from './_components/StudyClient'

export default function Loading() {
	return (
		<div className='flex h-full animate-pulse flex-col overflow-hidden'>
			<StudyClientSkeleton />
		</div>
	)
}
