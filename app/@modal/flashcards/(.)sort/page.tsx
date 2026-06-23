'use client'
import {useModalData} from '@/app/ModalDataProvider'
import {faArrowDown, faGripVertical} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import isEqual from 'lodash/isEqual'
import {motion, Reorder} from 'motion/react'
import {useState} from 'react'
import LeftAlignedModal from '../../_components/LeftAlignedModal'
import {initialFlashcardsSortOrder} from './initial'

export type FlashcardsSort = typeof initialFlashcardsSortOrder

const arrowVariants = {
	asc: {
		rotateX: 180,
	},
	desc: {
		rotateX: 0,
	},
}

export default function FlashcardsSortModal() {
	const {setData, getData, clearData} = useModalData()
	const savedSort = getData<FlashcardsSort>('flashcardsSort')
	const [items, setItems] = useState(savedSort || initialFlashcardsSortOrder)

	function handleSubmit(closeModal: () => void) {
		const orderChanged = !isEqual(items, initialFlashcardsSortOrder)
		if (orderChanged) {
			setData<FlashcardsSort>('flashcardsSort', items)
		} else {
			clearData('flashcardsSort')
		}
		closeModal()
	}

	function handleReset() {
		setItems(initialFlashcardsSortOrder)
	}

	const handleKeyboardReorder = (currentIndex: number, direction: 'up' | 'down') => {
		const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

		if (newIndex < 0 || newIndex >= items.length) return

		const reorderedItems = [...items]
		const [movedItem] = reorderedItems.splice(currentIndex, 1)
		reorderedItems.splice(newIndex, 0, movedItem)

		setItems(reorderedItems)
	}

	const toggleDirection = (index: number) => {
		const newItems = [...items]
		newItems[index] = {...newItems[index], direction: newItems[index].direction === 'asc' ? 'desc' : 'asc'}
		setItems(newItems)
	}

	return (
		<LeftAlignedModal
			title='Sort by'
			buttonContent='Change Sort Order'
			mobileScreenCoverage='2/3'
			onReset={handleReset}
			onSubmit={handleSubmit}
			useForm={false}>
			<Reorder.Group
				axis='y'
				values={items}
				onReorder={setItems}
				className='space-y-8 overflow-hidden text-base font-medium'>
				{items.map((item, index) => (
					<Reorder.Item
						key={item.value}
						value={item}
						style={{cursor: 'grab'}}
						tabIndex={0}
						onKeyDown={(event: React.KeyboardEvent<HTMLLIElement>) => {
							if (event.key === 'ArrowUp') {
								event.preventDefault()
								handleKeyboardReorder(index, 'up')
							}
							if (event.key === 'ArrowDown') {
								event.preventDefault()
								handleKeyboardReorder(index, 'down')
							}
						}}
						className='flex items-center justify-between rounded-sm bg-transparent px-8 py-12 focus-visible:bg-transparent pointer-fine:hover:bg-primary-100 dark:pointer-fine:hover:bg-primary-900'>
						<div className='flex items-center'>
							<FontAwesomeIcon icon={faGripVertical} className='text-gray-500 mr-12' />
							{item.label}
						</div>
						<motion.button
							type='button'
							onPointerDown={e => e.stopPropagation()}
							onClick={() => toggleDirection(index)}
							variants={arrowVariants}
							initial={item.direction}
							animate={item.direction}
							transition={{type: 'tween', duration: 0.2, ease: 'easeInOut'}}
							className='cursor-pointer p-[0.125rem] hover:text-primary-500 dark:hover:text-primary-400'>
							<FontAwesomeIcon icon={faArrowDown} />
						</motion.button>
					</Reorder.Item>
				))}
			</Reorder.Group>
		</LeftAlignedModal>
	)
}
