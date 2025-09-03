import Link from 'next/link'
import AudioIcon from './AudioIcon'
import AudioPlayback from './AudioPlayback'
import type {DictionaryEntry, NotFoundEntry} from './types'

// Header
function Header({entry}: {entry: DictionaryEntry}) {
	return (
		<div className='relative mb-48 w-fit'>
			<h2 className='text-xl font-bold'>{entry.word}</h2>
			<p className='text-sm'>
				<>
					{entry.phonetic}
					{entry.audio.map((audio, index) => (
						<AudioIcon
							className='ml-8 text-background-700 transition-colors duration-200 hover:text-background-500 dark:text-background-400 dark:hover:text-background-200'
							key={index}
							audio={audio}
						/>
					))}
				</>
			</p>

			<div
				aria-hidden='true'
				className='mt-12 block h-[2px] w-full rounded-full bg-primary-500 dark:bg-primary-600'></div>

			<p className='mt-4 text-sm'>
				License:{' '}
				<a
					href={entry.source.license.url}
					target='_blank'
					rel='noopener noreferrer'
					className='text-primary-500 dark:text-primary-600'>
					{entry.source.license.name}
				</a>{' '}
				<span className='text-sm text-background-500 dark:text-background-400'>
					(
					<a href={entry.source.url} target='_blank' rel='noopener noreferrer' className='underline'>
						original source
					</a>
					)
				</span>
			</p>
		</div>
	)
}

// Sense
function Sense({sense}: {sense: DictionaryEntry['senses'][0]}) {
	return (
		<div className='space-y-24'>
			<div className='relative w-fit'>
				<h3 className='text-lg text-primary-500 dark:text-primary-600'>{sense.partOfSpeech}</h3>
				{sense.synonyms.length > 0 && <Synonyms synonyms={sense.synonyms} />}
			</div>
			{sense.definitions.map((definition, index) => (
				<Definition key={index} definition={definition} />
			))}
		</div>
	)
}

// Definition
function Definition({definition}: {definition: DictionaryEntry['senses'][0]['definitions'][0]}) {
	return (
		<div className='space-y-24 rounded-sm border-2 border-background-300 p-16 dark:border-background-700'>
			<p>{definition.definition}</p>
			<Examples examples={definition.examples} />
			{definition.synonyms.length > 0 && <Synonyms synonyms={definition.synonyms} />}
		</div>
	)
}

// Synonyms
function Synonyms({synonyms}: {synonyms: string[]}) {
	return (
		<p className='text-sm'>
			<span className='text-background-600 dark:text-background-500'>synonyms: </span>
			{synonyms.map((synonym, index) => (
				<span key={index} className='text-primary-500 dark:text-primary-600'>
					<Link href={`?search=${synonym}`} className='hover:underline'>
						{synonym}
					</Link>
					{index < synonyms.length - 1 && ', '}
				</span>
			))}
		</p>
	)
}

// Examples
function ExamplesLabel({count}: {count: number}) {
	if (!count) return null
	return <p className='text-primary-500 dark:text-primary-600'>{count === 1 ? 'Example:' : 'Examples:'}</p>
}

function Examples({examples}: {examples: string[]}) {
	if (examples.length > 0) {
		return (
			<div>
				<ExamplesLabel count={examples.length} />
				<ul>
					{examples.map((example, index) => (
						<li key={index} className='text-sm'>
							{example}
						</li>
					))}
				</ul>
			</div>
		)
	}
	return null
}

// Final Dictionary Entry
export default function Entry({entry}: {entry: DictionaryEntry | NotFoundEntry}) {
	return (
		<>
			{!('notFound' in entry) && (
				<>
					<AudioPlayback audio={entry.audio[0]} />
					<Header entry={entry} />
					<div className='space-y-64'>
						{entry.senses.map((sense, index) => (
							<Sense key={index} sense={sense} />
						))}
					</div>
				</>
			)}
			{'notFound' in entry && entry.word && (
				<p>
					Definition for <span className='text-primary-500 dark:text-primary-600'>{entry.word}</span> not found.
				</p>
			)}
		</>
	)
}
