import Answer from './Answer'
import Buttons from './Buttons'
import Flashcard from './Flashcard'
import Input from './Input'
import ProgressBar from './ProgressBar'

export default function Home() {
	return (
		<section className='flex h-full flex-col overflow-hidden'>
			<div className='flex h-full flex-col items-center overflow-y-auto page-padding-x page-padding-y'>
				<div className='max-w-full space-y-48 sm:w-512'>
					<ProgressBar />
					<div className='space-y-24'>
						<Flashcard />
						{/* <Input /> */}
						<Answer />
					</div>
				</div>
			</div>
			<Buttons />
		</section>
	)
}
