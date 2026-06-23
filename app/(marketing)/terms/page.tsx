import {Metadata} from 'next'
import InfoPageLayout from '../_components/InfoPageLayout'

export const metadata: Metadata = {
	title: 'Terms - LingoMemo',
	description: 'Legal notice and disclaimer for LingoMemo.',
	alternates: {
		canonical: '/terms',
	},
}

const config = {
	version: '1.0.0',
	lastUpdated: '2025-11-26',
}

export default function TermsPage() {
	return (
		<InfoPageLayout title='Legal Notice & Disclaimer'>
			<div className='space-y-24 text-lg text-background-700 dark:text-background-300'>
				<section>
					<h2 className='mb-12 text-2xl font-bold'>1. &quot;AS IS&quot; Provision</h2>
					<p>
						LingoMemo is provided &quot;AS IS&quot;, without warranty of any kind, express or implied, including but not
						limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no
						event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in
						an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use
						or other dealings in the software.
					</p>
				</section>

				<section>
					<h2 className='mb-12 text-2xl font-bold text-background-900 dark:text-background-100'>
						2. Limitation of Liability
					</h2>
					<p>
						We do not guarantee that the application will function without errors or interruptions. We are not
						responsible for any loss of data, service downtime, or any other issues that may arise from the use of this
						application. Users are encouraged to maintain their own backups of any critical data.
					</p>
				</section>

				<section>
					<h2 className='mb-12 text-2xl font-bold text-background-900 dark:text-background-100'>
						3. Non-Commercial / Private Project
					</h2>
					<p>
						This is a private, non-commercial project developed for educational and personal use. It is not a commercial
						product and is maintained by an individual developer.
					</p>
				</section>

				<section>
					<p className='text-sm text-background-500'>
						Last updated:{' '}
						{new Date(config.lastUpdated).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}
					</p>
				</section>
			</div>
		</InfoPageLayout>
	)
}
