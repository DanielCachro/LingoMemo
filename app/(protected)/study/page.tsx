import {getStudyData} from '@/lib/queries/study'
import type {Viewport} from 'next'
import StudyClient from './_components/StudyClient'


// Added `interactiveWidget: 'resizes-content'` to ensure the layout viewport
// resizes when the on-screen keyboard appears on mobile devices (e.g. Android Chrome).
// Since Chromium 108, the keyboard no longer resizes the layout viewport by default.
// This prevents fixed or bottom-aligned elements (like action buttons) from being
// hidden behind the keyboard by making `dvh`/`vh` units reflect the visible area.
export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	interactiveWidget: 'resizes-content',
}

export default async function StudyPage() {
	const {flashcard, doneToday, toReviewToday} = await getStudyData()

	return (
		<section className='flex h-full flex-col overflow-hidden'>
			<StudyClient initialFlashcard={flashcard} initialDone={doneToday} toReviewToday={toReviewToday} />
		</section>
	)
}
