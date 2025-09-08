import AudioIcon from '@/components/AudioIcon'
import AudioPlayback from '@/components/AudioPlayback'

export default function Answer() {
	return (
		<div className='space-y-24 rounded-sm bg-primary-500 p-24 text-primary-50 dark:bg-primary-600 dark:text-primary-100'>
			<AudioPlayback audio='https://ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp' />
			<div className='flex gap-16'>
				<p className='space-x-8'>
					<span>tree</span>
					<span>
						<AudioIcon audio='https://ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3' />
					</span>
				</p>
				<p>/tɹiː/</p>
			</div>
			<ol className='list-inside list-paren space-y-4'>
				<li className='space-x-8'>Hyperion is the tallest living tree in the world.</li>
				<li className='space-x-8'>Birds have a nest in a tree in the garden.</li>
			</ol>
		</div>
	)
}
