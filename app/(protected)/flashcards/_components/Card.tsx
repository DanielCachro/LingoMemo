'use client'
import AudioIcon from '@/components/AudioIcon'
import Checkbox from '@/components/Form/Chceckbox'
import {cn} from '@/lib/utils'
import {faChevronDown, faPenToSquare, faTrashCan} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {AnimatePresence, motion, stagger, Variants} from 'motion/react'
import {useState} from 'react'

function DetailsBlock({title, children}: {title: string; children: React.ReactNode}) {
	const variants: Variants = {hidden: {opacity: 0}, show: {opacity: 1}, exit: {opacity: 0}}

	return (
		<motion.div className='space-y-8' variants={variants}>
			<p className='font-bold'>{title}</p>
			{children}
		</motion.div>
	)
}

export default function Card() {
	const [showDetails, setShowDetails] = useState(false)

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
						<p className='font-bold'>manage</p>
						<div className='space-x-4'>
							<AudioIcon audio='https://api.dictionaryapi.dev/media/pronunciations/en/flash-au.mp3' />
							<AudioIcon audio='https://api.dictionaryapi.dev/media/pronunciations/en/flash-au.mp3' />
						</div>
						<p className='text-background-400 dark:text-background-500'>/ˈmænɪdʒ/</p>
					</div>
					<div className='flex items-center gap-8'>
						<div className='space-x-4'>
							<FontAwesomeIcon
								icon={faPenToSquare}
								className='text-background-600 transition-colors duration-150 hover:cursor-pointer hover:text-background-500 dark:text-background-300 dark:hover:text-background-200'
							/>
							<FontAwesomeIcon
								icon={faTrashCan}
								className='text-error-500 transition-colors duration-150 hover:cursor-pointer hover:text-error-400'
							/>
						</div>
						<Checkbox />
					</div>
				</div>
				<p className='text-background-700 dark:text-background-300'>(transitive) To direct or be in charge of.</p>
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
					<motion.div variants={detailsVariants} initial='hidden' animate='show' exit='exit' className='space-y-12'>
						<DetailsBlock title='Note'>
							<p className='rounded-sm border-[1px] border-background-200 bg-background-100 p-16 text-background-700 dark:border-background-700 dark:bg-background-800 dark:text-background-300'>
								The word &quot;seek&quot; is a verb for trying to find, obtain, or achieve something, and as a more
								formal alternative to &quot;look for,&quot; its past tense is &quot;sought,&quot; as in, &quot;they
								sought legal counsel.&quot;
							</p>
						</DetailsBlock>
						<DetailsBlock title='Examples'>
							<ol className='ml-8 list-inside list-disc text-background-700 dark:text-background-300'>
								<li>I seek wisdom.</li>
								<li>He is seeking employment in a new field</li>
								<li>The rescue team will continue to seek for another three days before calling off the search.</li>
							</ol>
						</DetailsBlock>
						<DetailsBlock title='Synonyms'>
							<p className='text-background-700 dark:text-background-300'>look for, search for</p>
						</DetailsBlock>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
