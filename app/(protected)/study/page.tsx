import Answer from './Answer'
import Flashcard from './Flashcard'
import Input from './Input'
import ProgressBar from './ProgressBar'

export default function Home() {
	return (
		<section className='flex flex-col items-center px-32'>
			<div className='w-full max-w-full space-y-48 sm:w-512'>
				<ProgressBar />
				<div className='space-y-24'>
					<Flashcard />
					{/* <Input /> */}
					<Answer />
				</div>
			</div>
		</section>
	)
}
