'use client'
import AudioIcon from '@/components/AudioIcon'
import Checkbox from '@/components/Form/Chceckbox'
import {cn} from '@/lib/utils'
import {faChevronDown, faPenToSquare, faTrashCan} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Prisma} from '@prisma/client'
import {DateTime} from 'luxon'
import {AnimatePresence, motion, stagger, Variants} from 'motion/react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useState} from 'react'

function DetailsBlock({title, children}: {title: string; children: React.ReactNode}) {
	const variants: Variants = {hidden: {opacity: 0}, show: {opacity: 1}, exit: {opacity: 0}}

	return (
		<motion.div className='space-y-4' variants={variants}>
			<p className='font-bold'>{title}</p>
			<div>{children}</div>
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
	const router = useRouter()

	const detailsVariants: Variants = {
		hidden: {
			height: 0,
			paddingTop: 12,
		},
		show: {
			height: 'auto',
			transition: {
				delayChildren: stagger(0.2),
				ease: 'circOut',
				duration: 0.3,
			},
		},
		exit: {
			height: 0,
			paddingTop: 0,
			transition: {
				when: 'afterChildren',
				ease: 'circOut',
				delayChildren: stagger(0.1, {from: 'last'}),
				duration: 0.3,
			},
		},
	}

	return (
		<div className='rounded-sm border-2 border-background-300 bg-background-50 p-16 dark:border-background-700 dark:bg-background-900'>
			<div className='space-y-12'>
				<div className='flex justify-between'>
					<div className='flex gap-12'>
						<p className='font-bold'>{flashcard.answer.text}</p>
						{flashcard.answer.audio.map((audio, index) => (
							<div key={index} className='space-x-4'>
								<AudioIcon audio={audio} />
							</div>
						))}
						<p className='text-background-400 dark:text-background-500'>{flashcard.answer.phonetic}</p>
					</div>
					<div className='ml-16 flex items-center gap-4 self-start'>
						<button
							onClick={() => {
								router.push(`/flashcards/edit/${flashcard.id}`)
							}}>
							<FontAwesomeIcon
								icon={faPenToSquare}
								className='text-background-600 transition-colors duration-150 hover:cursor-pointer hover:text-background-500 dark:text-background-300 dark:hover:text-background-200'
							/>
						</button>
						<button
							onClick={() => {
								router.push(
									`/flashcards/delete/${flashcard.id}?question=${encodeURIComponent(flashcard.question)}&answer=${encodeURIComponent(flashcard.answer.text)}`,
								)
							}}>
							<FontAwesomeIcon
								icon={faTrashCan}
								className='text-error-500 transition-colors duration-150 hover:cursor-pointer hover:text-error-600'
							/>
						</button>

						<Checkbox className='ml-4' checked={isSelected} onChange={onSelectionChange} />
					</div>
				</div>
				<p className='text-background-700 dark:text-background-300'>{flashcard.question}</p>
				<div aria-hidden='true' className='h-[1px] rounded-full bg-background-300 dark:bg-background-700' />
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
			<AnimatePresence>
				{showDetails && (
					<motion.div variants={detailsVariants} initial='hidden' animate='show' exit='exit' className='space-y-16'>
						<DetailsBlock title='Note'>
							<p className='rounded-sm border-[1px] border-background-200 bg-background-100 p-16 text-background-700 dark:border-background-700 dark:bg-background-800 dark:text-background-300'>
								{flashcard.note || 'No additional notes for this flashcard.'}
							</p>
						</DetailsBlock>
						{flashcard.examples.length > 0 && (
							<DetailsBlock title='Examples'>
								<ol className='ml-24 list-disc text-background-700 dark:text-background-300'>
									{flashcard.examples.map((example, index) => (
										<li key={index}>{example}</li>
									))}
								</ol>
							</DetailsBlock>
						)}
						{flashcard.synonyms.length > 0 && (
							<DetailsBlock title='Synonyms'>
								<p className='text-background-700 dark:text-background-300'>
									{flashcard.synonyms.map((synonym, index) => (
										<span
											key={`${synonym.slice(0, 10).trim()}-${index}`}
											className='text-primary-500 dark:text-primary-600'>
											<Link href={`dictionary?search=${synonym}`} className='hover:underline'>
												{synonym}
											</Link>
											{index < flashcard.synonyms.length - 1 && ', '}
										</span>
									))}
								</p>
							</DetailsBlock>
						)}
						<DetailsBlock title='Other'>
							<p>
								<span className='text-background-500 dark:text-background-400'>eFactor:</span> {flashcard.eFactor}
							</p>
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
						</DetailsBlock>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
