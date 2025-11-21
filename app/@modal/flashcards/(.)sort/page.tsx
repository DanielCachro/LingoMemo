'use client'
import {useModalData} from '@/app/ModalDataProvider'
import {faGripVertical} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import _ from 'lodash'
import {Reorder} from 'motion/react'
import {useState} from 'react'
import LeftAlignedModal from '../../_components/LeftAlignedModal'
import {initialFlashcardsSortOrder} from './initial'

export type FlashcardsSort = typeof initialFlashcardsSortOrder

// TODO: Add asc/desc toggle for each field
export default function FlashcardsSortModal() {
	const {setData, getData, clearData} = useModalData()
	const savedSort = getData<FlashcardsSort>('flashcardsSort')
	const [items, setItems] = useState(savedSort || initialFlashcardsSortOrder)

	function handleSubmit(closeModal: () => void) {
		const orderChanged = !_.isEqual(items, initialFlashcardsSortOrder)
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
						className='rounded-sm bg-transparent px-8 py-12 focus-visible:bg-transparent pointer-fine:hover:bg-primary-100 dark:pointer-fine:hover:bg-primary-900'>
						<>
							<FontAwesomeIcon icon={faGripVertical} className='text-gray-500 mr-12' />
							{item.label}
						</>
					</Reorder.Item>
				))}
			</Reorder.Group>
		</LeftAlignedModal>
	)
}
