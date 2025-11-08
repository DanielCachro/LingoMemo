'use client'
import {useModalData} from '@/app/ModalDataProvider'
import PrimaryButton from '@/components/PrimaryButton'
import {faGripVertical} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Reorder} from 'motion/react'
import dynamic from 'next/dynamic'
import {useState} from 'react'

const Modal = dynamic(() => import('../../_components/Modal'), {ssr: false})

const initialItems = [
	{value: 'nextReviewDate', label: 'Next Review Date'},
	{value: 'createdAt', label: 'Creation Date'},
	{value: 'question', label: 'Question'},
	{value: 'answer', label: 'Answer'},
	{value: 'efactor', label: 'eFactor'},
]

export type FlashcardsSort = typeof initialItems

export default function FlashcardsSortModal() {
	const {setData, getData, clearData} = useModalData()
	const savedSort = getData<FlashcardsSort>('flashcardsSort')
	const [items, setItems] = useState(savedSort || initialItems)

	function handleSubmit(closeModal: () => void) {
		const orderChanged =
			JSON.stringify(items.map(item => item.value)) !== JSON.stringify(initialItems.map(item => item.value))
		if (orderChanged) {
			setData<FlashcardsSort>('flashcardsSort', items)
		} else {
			clearData('flashcardsSort')
		}
		closeModal()
	}

	function handleReset() {
		setItems(initialItems)
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
		<Modal header='none' heading='Sort' mobileScreenCoverage='2/3'>
			{closeModal => {
				return (
					<div className='flex h-full flex-col justify-between space-y-16 p-16 pt-0'>
						<div className='flex justify-between sm:mt-16'>
							<h3 className='text-xl font-bold'>Sort by</h3>
							<button
								onClick={handleReset}
								className='cursor-pointer text-primary-500 pointer-fine:hover:text-primary-400'>
								Reset
							</button>
						</div>
						<div className='-mr-16 flex min-h-0 flex-col space-y-24 pr-16 text-xl font-bold'>
							<Reorder.Group
								axis='y'
								values={items}
								onReorder={setItems}
								className='space-y-8 overflow-hidden pt-16 text-base font-medium'>
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
										className='rounded-sm bg-transparent px-8 py-12 focus-visible:bg-transparent pointer-fine:hover:bg-primary-100'>
										<>
											<FontAwesomeIcon icon={faGripVertical} className='text-gray-500 mr-12' />
											{item.label}
										</>
									</Reorder.Item>
								))}
							</Reorder.Group>
						</div>
						<PrimaryButton onClick={() => handleSubmit(closeModal)}>Change Sort Order</PrimaryButton>
					</div>
				)
			}}
		</Modal>
	)
}
