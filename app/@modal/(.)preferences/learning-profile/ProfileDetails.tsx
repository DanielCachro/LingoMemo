import {languageCodeToName} from '@/lib/utils'
import {LearningProfile} from '@prisma/client'

export default function ProfileDetails({profile}: {profile: LearningProfile}) {
	if (profile.sourceLang && profile.targetLang) {
		return (
			<div>
				<p className='font-bold'>Language:</p>
				<p>
					Source:{' '}
					<span className='font-bold'>{`${languageCodeToName(profile.sourceLang)} (${profile.sourceLang})`}</span>
				</p>
				<p>
					Target:{' '}
					<span className='font-bold'>{`${languageCodeToName(profile.targetLang)} (${profile.targetLang})`}</span>
				</p>
			</div>
		)
	}

	if (profile.profileName) {
		return (
			<div>
				<p>Self-study:</p>
				<p className='overflow-auto font-bold'>{profile.profileName}</p>
			</div>
		)
	}

	return null
}
