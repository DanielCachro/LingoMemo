import {getCurrentUser} from '@/lib/actions/user'
import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'
import {NextResponse} from 'next/server'

export async function POST() {
	const user = await getCurrentUser()
	if (!user) return NextResponse.json({message: 'User not authenticated.'}, {status: 401})

	const activeLearningProfile = user.activeLearningProfile
	const activeLearningProfileId = user.activeLearningProfileId

	if (!activeLearningProfile || !activeLearningProfileId)
		return NextResponse.json({message: 'No active learning profile for user.'}, {status: 500})

	const startOfTodayUTC = DateTime.now().setZone('UTC').startOf('day')

	const lastUpdated = activeLearningProfile.streakLastUpdated
		? DateTime.fromJSDate(activeLearningProfile.streakLastUpdated).setZone('UTC').startOf('day')
		: null

	if (lastUpdated && startOfTodayUTC.diff(lastUpdated, 'days').days >= 2) {
		try {
			const updatedProfile = await prisma.learningProfile.update({
				where: {
					id: activeLearningProfileId,
				},
				data: {
					streakCount: 0,
					streakLastUpdated: DateTime.now().setZone('UTC').toJSDate(),
				},
			})
			console.log(`Streak is broken. Resetting streak for profile ID: ${activeLearningProfileId}`)

			return NextResponse.json({message: 'Streak reset successfully!', data: updatedProfile}, {status: 200})
		} catch (error) {
			console.error('Error updating streak:', error)
			return NextResponse.json({error: (error as Error).message || 'Unknown error'}, {status: 500})
		}
	}
	console.log(`Streak is not broken. No update needed for profile ID: ${activeLearningProfileId}`)
	return NextResponse.json({message: 'Streak is not broken. No update needed.'}, {status: 200})
}
