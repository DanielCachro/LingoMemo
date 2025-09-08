import {faMessage, faMinusCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export default function Flashcard() {
	const buttonStyle = 'hover:cursor-pointer'

	return (
		<div className='flex aspect-4/3 flex-col items-center rounded-sm bg-primary-500 px-32 text-primary-50 shadow-slab-primary-300 dark:bg-primary-600 dark:text-primary-100'>
			<div className='space-x-8 self-end pt-16'>
				<button className={buttonStyle}>
					<FontAwesomeIcon size='sm' icon={faMinusCircle} />
				</button>
				<button className={buttonStyle}>
					<FontAwesomeIcon size='sm' icon={faMessage} />
				</button>
			</div>
			<div className='flex w-full max-w-384 grow flex-col items-center justify-center gap-24 pt-24 pb-48 text-center'>
				<p>
					A perennial woody plant taller and larger than a shrub with a wooden trunk and, at some distance from the
					ground, having leaves and branches.
				</p>
				<p className='w-full justify-self-center rounded-sm bg-primary-400 px-24 py-16 text-sm text-primary-300 dark:bg-primary-500'>
					No comments yet.
				</p>
			</div>
		</div>
	)
}
