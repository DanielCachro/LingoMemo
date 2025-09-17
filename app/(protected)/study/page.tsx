import {getStudyData} from '@/lib/actions/study'
import StudyClient from './_components/StudyClient'

export default async function StudyPage() {
	const {flashcard, doneToday, toReviewToday} = await getStudyData()

	return (
		<section className='flex h-full flex-col overflow-hidden'>
			<StudyClient initialFlashcard={flashcard} initialDone={doneToday} toReviewToday={toReviewToday} />
		</section>
	)
}
