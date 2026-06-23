import {Metadata} from 'next'
import InfoPageLayout from '../_components/InfoPageLayout'
import ResetConsentButton from './ResetConsentButton'
import Section from './Section'

export const metadata: Metadata = {
	title: 'Privacy Policy - LingoMemo',
	description: 'Privacy Policy for LingoMemo.',
	alternates: {
		canonical: '/privacy',
	},
}

const config = {
	version: '1.0.0',
	lastUpdated: '2025-11-26',
}

export default function PrivacyPage() {
	return (
		<InfoPageLayout title='Privacy Policy'>
			<div className='space-y-24 text-lg text-background-700 dark:text-background-300'>
				<Section title='1. Introduction'>
					<p>
						Welcome to LingoMemo. We respect your privacy and are committed to protecting your personal data. This
						privacy policy will inform you as to how we look after your personal data when you visit our website and
						tell you about your privacy rights and how the law protects you.
					</p>
				</Section>

				<Section title='2. Information We Collect'>
					<p className='mb-12'>
						We may collect, use, store and transfer different kinds of personal data about you which we have grouped
						together follows:
					</p>
					<ul className='list-inside list-disc space-y-4'>
						<li>
							<strong>Identity Data:</strong> includes username or similar identifier.
						</li>
						<li>
							<strong>Contact Data:</strong> includes email address.
						</li>
						<li>
							<strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type
							and version, time zone setting and location, browser plug-in types and versions, operating system and
							platform and other technology on the devices you use to access this website. We also use cookies and local
							storage technologies to maintain your active session and authentication status (provided by Supabase).
						</li>
						<li>
							<strong>Usage Data:</strong> includes information about how you use our website, products and services
							(e.g. flashcard progress).
						</li>
					</ul>
				</Section>

				<Section title='3. Third-Party Analytics'>
					<p>
						We use third-party analytics services to help us understand how our website is used and to improve our
						services. These services may collect information about your use of the website, such as your IP address, web
						browser, pages viewed, time spent on pages, links clicked and conversion information.
					</p>
					<ul className='space-y-2 mt-4 list-inside list-disc'>
						<li>
							<strong>Vercel Analytics:</strong> We use Vercel Analytics to track page views and visitor numbers.
						</li>
						<li>
							<strong>Vercel Speed Insights:</strong> We use Vercel Speed Insights to analyze the performance of our
							website (e.g., loading times).
						</li>
					</ul>
					<p className='mt-4'>
						These services are only enabled if you have given your consent via our cookie banner. If you would like to
						update your choice, please <ResetConsentButton />
					</p>
				</Section>

				<Section title='4. How We Use Your Personal Data'>
					<p>
						We will only use your personal data when the law allows us to. Most commonly, we will use your personal data
						in the following circumstances:
					</p>
					<ul className='mt-12 list-inside list-disc space-y-4'>
						<li>To register you as a new customer.</li>
						<li>To provide the educational services (flashcards, spaced repetition).</li>
						<li>To manage our relationship with you.</li>
						<li>To improve our website, products/services, marketing or customer relationships.</li>
					</ul>
				</Section>

				<Section title='5. Data Security'>
					<p>
						We have put in place appropriate security measures to prevent your personal data from being accidentally
						lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your
						personal data to those employees, agents, contractors and other third parties who have a business need to
						know.
					</p>
				</Section>

				<Section title='6. Data Retention'>
					<p>
						We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for,
						including for the purposes of satisfying any legal, accounting, or reporting requirements. Generally, we
						retain your data as long as your account is active. If you delete your account, your personal data is
						removed from our databases.
					</p>
				</Section>

				<Section title='7. Your Legal Rights'>
					<p>
						Under certain circumstances, you have rights under data protection laws in relation to your personal data,
						including the right to request access, correction, erasure, restriction, transfer, to object to processing,
						to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
					</p>
				</Section>

				<Section title='8. Third-Party Services'>
					<p className='mb-12'>We use trusted third-party services to operate our application:</p>
					<ul className='list-inside list-disc space-y-4'>
						<li>
							<strong>Supabase:</strong> We use Supabase for authentication and database services. Your data is stored
							securely on their servers.
						</li>
						<li>
							<strong>Hosting Provider:</strong> We use Vercel to host our application. Vercel may collect anonymous
							usage data and server logs (including IP addresses) to ensure service availability and security.
						</li>
						<li>
							<strong>Dictionary APIs:</strong> We use external APIs (Free Dictionary API, DictionaryAPI.dev) to fetch
							word definitions and audio pronunciations.
						</li>
					</ul>
				</Section>

				<Section title='9. Contact Details'>
					<p>
						If you have any questions about this privacy policy or our privacy practices, please contact us at:{' '}
						<span className='italic'>danielcachro@gmail.com</span>.
					</p>
				</Section>

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
