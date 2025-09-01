import Link from 'next/link'
import AudioIcon from './AudioIcon'
import type {DictionaryDefinition, NotFoundDefinition} from './types'
import AudioPlayback from './AudioPlayback'

export function Synonyms({synonyms}: {synonyms: string[]}) {
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

export default function Definition({definition}: {definition: DictionaryDefinition | NotFoundDefinition}) {
	return (
		<>
			{!('notFound' in definition) && (
				<>
					<AudioPlayback audio={definition.audio[0]} />
					<div className='relative mb-48 w-fit'>
						<h2 className='text-xl font-bold'>{definition.word}</h2>
						<p className='text-sm'>
							<>
								{definition.phonetic}
								{definition.audio.map((audio, index) => (
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
					</div>
					<div className='space-y-64'>
						{definition.meanings.map((meaning, index) => (
							<div key={index} className='space-y-24'>
								<div className='relative w-fit'>
									<h3 className='text-lg text-primary-500 dark:text-primary-600'>{meaning.partOfSpeech}</h3>
									{meaning.synonyms.length > 0 && <Synonyms synonyms={meaning.synonyms} />}
								</div>
								{meaning.definitions.map((definition, index) => (
									<div
										key={index}
										className='space-y-24 rounded-sm border-2 border-background-300 p-16 dark:border-background-700'>
										<p>{definition.definition}</p>
										{definition.example && (
											<div>
												<p className='text-primary-500 dark:text-primary-600'>Example:</p>
												<p className='text-sm'>{definition.example}</p>
											</div>
										)}
										{definition.synonyms.length > 0 && <Synonyms synonyms={definition.synonyms} />}
									</div>
								))}
							</div>
						))}
					</div>
				</>
			)}
			{'notFound' in definition && definition.word && (
				<p>
					Definition for <span className='text-primary-500 dark:text-primary-600'>{definition.word}</span> not found.
				</p>
			)}
		</>
	)
}
