'use client'
import AudioIcon from '@/components/AudioIcon'
import Checkbox from '@/components/Form/Chceckbox'
import Tooltip from '@/components/Tooltip'
import {Prisma} from '@/lib/generated/prisma/browser'
import {cn} from '@/lib/utils/cn'
import {faChevronDown, faPenToSquare, faTrashCan} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {DateTime} from 'luxon'
import {motion, stagger, useAnimation, Variants} from 'motion/react'
import Link from 'next/link'
import {useEffect, useRef, useState} from 'react'

function DetailsBlock({title, children}: {title: string; children: React.ReactNode}) {
	const variants: Variants = {hidden: {opacity: 0}, show: {opacity: 1}, exit: {opacity: 0}}

	return (
		<motion.div className='w-full space-y-4' variants={variants}>
			<p className='font-bold'>{title}</p>
			<div className='w-full'>{children}</div>
		</motion.div>
	)
}

interface CardProps {
	flashcard: Prisma.FlashcardGetPayload<{include: {answer: true}}>
	isSelected: boolean
	onSelectionChange: (checked: boolean) => void
}

export default function Card({flashcard, isSelected, onSelectionChange}: CardProps) {
	const [showDetails, setShowDetails] = useState(false)
	const controls = useAnimation()
	const currentVariantRef = useRef('initial')

	const detailsVariants: Variants = {
		hidden: {
			height: 0,
			opacity: 0,
		},
		show: {
			height: 'auto',
			opacity: 1,
			transition: {
				delayChildren: stagger(0.2),
				ease: 'circOut',
				duration: 0.3,
			},
		},
		exit: {
			height: 0,
			opacity: 0,
			transition: {
				when: 'afterChildren',
				ease: 'circOut',
				delayChildren: stagger(0.1, {from: 'last'}),
				duration: 0.3,
			},
		},
	}

	useEffect(() => {
		if (showDetails) {
			currentVariantRef.current = 'show'
			controls.start('show')
		} else {
			currentVariantRef.current = 'exit'
			controls.start('exit')
		}
	}, [showDetails, controls])

	useEffect(() => {
		if (currentVariantRef.current === 'show') {
			// Ensure that data is visible when while updating flashcard we add a new DetailsBlock (initial opacity:0).
			// This forces 'show' variant to be applied to every DetailsBlock when data changes.
			controls.set('show')
		}
	}, [flashcard, controls])

	return (
		<div className='rounded-sm border-2 border-background-300 bg-background-50 p-16 dark:border-background-700 dark:bg-background-900'>
			<div className='space-y-12'>
				<div className='flex justify-between gap-8'>
					<div className='flex min-w-0 flex-1 flex-wrap items-baseline gap-x-12 gap-y-4'>
						<p className='font-bold break-all whitespace-pre-wrap' aria-label='Flashcard answer'>
							{flashcard.answer.text}
						</p>

						<div className='flex flex-wrap items-center gap-4'>
							{flashcard.answer.audio.map((audio, index) => (
								<div key={index} className='shrink-0'>
									<AudioIcon audio={audio} />
								</div>
							))}

							<p
								className='wrap-break-word break-all whitespace-pre-wrap text-background-400 dark:text-background-500'
								aria-label='Flashcard phonetic'>
								{flashcard.answer.phonetic}
							</p>
						</div>
					</div>
					<div className='ml-8 flex shrink-0 items-center gap-4 self-start'>
						<Link href={`/flashcards/edit/${flashcard.id}`} scroll={false} aria-label='Edit flashcard'>
							<FontAwesomeIcon
								icon={faPenToSquare}
								className='text-background-600 transition-colors duration-150 hover:cursor-pointer hover:text-background-500 dark:text-background-300 dark:hover:text-background-200'
							/>
						</Link>
						<Link
							href={`/flashcards/delete/${flashcard.id}?question=${encodeURIComponent(flashcard.question)}&answer=${encodeURIComponent(flashcard.answer.text)}`}
							scroll={false}
							aria-label='Delete flashcard'>
							<FontAwesomeIcon
								icon={faTrashCan}
								className='text-error-500 transition-colors duration-150 hover:cursor-pointer hover:text-error-600'
							/>
						</Link>

						<Checkbox
							className='ml-4'
							checked={isSelected}
							onChange={onSelectionChange}
							aria-label='Select flashcard for bulk delete'
						/>
					</div>
				</div>

				<p
					className='w-full wrap-break-word whitespace-pre-wrap text-background-700 dark:text-background-300'
					aria-label='Flashcard question'>
					{flashcard.question}
				</p>

				<div aria-hidden='true' className='h-px rounded-full bg-background-300 dark:bg-background-700' />

				<button
					className={cn(
						'flex w-full justify-between text-background-600 hover:cursor-pointer hover:text-background-500 dark:text-background-300 dark:hover:text-background-200',
						{'text-primary-500 hover:text-primary-400 dark:text-primary-600 dark:hover:text-primary-500': showDetails},
					)}
					onClick={() => {
						setShowDetails(prev => !prev)
					}}>
					<p>{showDetails ? 'Hide details' : 'View details'}</p>
					<motion.span initial={false} animate={{rotate: showDetails ? -180 : 0}} transition={{duration: 0.15}}>
						<FontAwesomeIcon icon={faChevronDown} />
					</motion.span>
				</button>
			</div>

			<motion.div variants={detailsVariants} initial='hidden' animate={controls} className='overflow-hidden'>
				<div className='space-y-16 pt-16'>
					<DetailsBlock title='Note'>
						<p className='border-px w-full rounded-sm border-background-200 bg-background-100 p-16 wrap-break-word whitespace-pre-wrap text-background-700 dark:border-background-700 dark:bg-background-800 dark:text-background-300'>
							{flashcard.note || 'No additional notes for this flashcard.'}
						</p>
					</DetailsBlock>
					{flashcard.examples.length > 0 && (
						<DetailsBlock title='Examples'>
							<ol className='ml-24 list-disc wrap-break-word text-background-700 dark:text-background-300'>
								{flashcard.examples.map((example, index) => (
									<li key={index} className='w-full'>
										<span className='inline'>{example}</span>
									</li>
								))}
							</ol>
						</DetailsBlock>
					)}
					{flashcard.synonyms.length > 0 && (
						<DetailsBlock title='Synonyms'>
							<p className='break-all whitespace-pre-wrap text-background-700 dark:text-background-300'>
								{flashcard.synonyms.map((synonym, index) => (
									<span
										key={`${synonym.slice(0, 10).trim()}-${index}`}
										className='inline-block text-primary-500 dark:text-primary-600'>
										<Link href={`dictionary?search=${synonym}`} className='wrap-break-word hover:underline'>
											{synonym}
										</Link>
										{index < flashcard.synonyms.length - 1 && <span className='mr-[3px]'>,</span>}
									</span>
								))}
							</p>
						</DetailsBlock>
					)}
					<DetailsBlock title='Other'>
						<div className='wrap-break-word'>
							<div className='flex gap-4'>
								<p>
									<span className='text-background-500 dark:text-background-400'>eFactor:</span> {flashcard.eFactor}
								</p>
								<Tooltip ariaLabel='eFactor information'>
									eFactor shows how easy a card is for you and lets the app decide how quickly to extend the time
									between its reviews: higher eFactor = rarer reviews, lower eFactor = more frequent reviews.
								</Tooltip>
							</div>
							<p>
								<span className='text-background-500 dark:text-background-400'>Created At: </span>
								{DateTime.fromJSDate(new Date(flashcard.createdAt)).setLocale('en').toLocaleString(DateTime.DATE_MED)}
							</p>
							<p>
								<span className='text-background-500 dark:text-background-400'>Next Review: </span>
								{DateTime.max(
									flashcard.nextReview ? DateTime.fromJSDate(new Date(flashcard.nextReview)) : DateTime.now(),
									DateTime.now(),
								)
									.setLocale('en')
									.toLocaleString(DateTime.DATE_MED)}
							</p>
						</div>
					</DetailsBlock>
				</div>
			</motion.div>
		</div>
	)
}
