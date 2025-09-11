import {getStudyData} from './actions'
import Answer from './Answer'
import Buttons from './Buttons'
import Flashcard from './Flashcard'
import FlashcardsDone from './FlashcardsDone'
import Input from './Input'
import ProgressBar from './ProgressBar'

export default async function StudyPage() {
	const {flashcard, doneToday, toReviewToday} = await getStudyData()

	return (
		<section className='flex h-full flex-col overflow-hidden'>
			<>
				<div className='flex h-full flex-col items-center overflow-y-auto page-padding-x page-padding-y'>
					<div className='max-w-full space-y-48 sm:w-512'>
						<ProgressBar value={doneToday} max={toReviewToday} />
						{flashcard && (
							<div className='space-y-24'>
								<Flashcard flashcard={flashcard} />
								<Input />
								{/* <Answer /> */}
							</div>
						)}
						{!flashcard && <FlashcardsDone />}
					</div>
				</div>
				{flashcard && <Buttons flashcardId={flashcard.id} />}
			</>
		</section>
	)
}
