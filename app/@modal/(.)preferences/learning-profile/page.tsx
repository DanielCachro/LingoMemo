import {getCurrentUser} from '@/lib/actions/user'
import {languageCodeToName} from '@/lib/utils'
import DeleteProfileButton from './DeleteProfileButton'
import ProfileSelect from './ProfileSelect'

export default async function LearningProfileModal() {
	const user = await getCurrentUser()
	if (!user) {
		throw new Error('User not authenticated. Unable to retrieve user learning profile.')
	}

	const activeLearningProfile = user.activeLearningProfile
	const activeLearningProfileId = user.activeLearningProfileId
	if (!activeLearningProfile || !activeLearningProfileId) throw new Error('No active learning profile found.')

	const learningProfiles = user.learningProfiles

	const radios = learningProfiles.map(profile => {
		let children = <div></div>

		if (profile.sourceLang && profile.targetLang) {
			children = (
				<div className='space-y-24'>
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
					<DeleteProfileButton profileId={profile.id} />
				</div>
			)
		} else if (profile.profileName) {
			children = (
				<div className='space-y-24'>
					<div>
						<p>Self-study:</p>
						<p className='font-bold'>{profile.profileName}</p>
					</div>
					<DeleteProfileButton profileId={profile.id} />
				</div>
			)
		}

		return {
			value: String(profile.id),
			children,
		}
	})

	return <ProfileSelect radios={radios} activeLearningProfileId={String(activeLearningProfileId)} />
}
