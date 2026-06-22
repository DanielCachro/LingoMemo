import {faTrashCan, faXmark} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {AnimatePresence, motion} from 'motion/react'

interface Props {
	visible: boolean
	numberOfSelectedItems: number
	onDelete: () => void
	onClear: () => void
}

export default function BulkSelectFloatingButton({visible, numberOfSelectedItems, onDelete, onClear}: Props) {
	return (
		<>
			<div role='status' className='sr-only'>
				{numberOfSelectedItems > 0 ? `${numberOfSelectedItems} flashcards selected for bulk delete` : ''}
			</div>
			<AnimatePresence>
				{visible && (
					<motion.div
						role='toolbar'
						aria-label='Bulk delete'
						initial={{opacity: 0, y: 50}}
						animate={{opacity: 1, y: 0}}
						exit={{opacity: 0, y: 50}}
						className='fixed bottom-96 left-1/2 z-40 flex -translate-x-1/2 items-center gap-16 rounded-sm bg-primary-500 p-16 text-primary-50 shadow-lg sm:right-64 sm:bottom-32 sm:left-auto sm:translate-0 dark:bg-primary-600'>
						<div className='space-x-8 whitespace-nowrap'>
							<button
								onClick={onClear}
								aria-label='Clear selection'
								className='cursor-pointer text-primary-50 hover:text-primary-200'>
								<FontAwesomeIcon icon={faXmark} />
							</button>
							<span>{numberOfSelectedItems} selected</span>
						</div>

						<div aria-hidden='true' className='relative w-px self-stretch bg-primary-300 dark:bg-primary-400' />

						<button
							onClick={onDelete}
							className='cursor-pointer space-x-8 rounded-sm bg-error-600 px-12 py-8 whitespace-nowrap transition-colors duration-150 hover:bg-error-500'>
							<FontAwesomeIcon icon={faTrashCan} />
							<span>Delete</span>
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}
