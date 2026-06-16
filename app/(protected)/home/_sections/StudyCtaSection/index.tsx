import {getStudyData} from '@/lib/queries/study'
import AnimatedCards from './AnimatedCards'
import StudyStatus from './StudyStatus'

export default async function StudyCtaSection() {
	const {flashcard, toReviewToday, doneToday} = await getStudyData()

	return (
		<section className='flex items-center justify-center py-48'>
			{flashcard ? (
				<AnimatedCards frontCardText={flashcard.question} />
			) : toReviewToday === 0 ? (
				<StudyStatus status='empty' />
			) : doneToday > 0 ? (
				<StudyStatus status='done' />
			) : null}
		</section>
	)
}
