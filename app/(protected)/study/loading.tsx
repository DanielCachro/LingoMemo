import {Skeleton as StudyClientSkeleton} from './_components/StudyClient'

export default function Loading() {
	return (
		<section className='flex h-full animate-pulse flex-col overflow-hidden'>
			<StudyClientSkeleton />
		</section>
	)
}
