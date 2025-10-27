import {getCurrentUser} from '@/lib/actions/user'
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

	return (
		<ProfileSelect
			// Using key to force remount when removing profile
			// This ensures that the initialSelectedRadio is properly set
			key={`profile-select-${learningProfiles.map(profile => profile.id).join('&')}`}
			learningProfiles={learningProfiles}
			activeLearningProfileId={String(activeLearningProfileId)}
		/>
	)
}
