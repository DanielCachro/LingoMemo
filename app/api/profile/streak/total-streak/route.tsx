import {getCurrentUser} from '@/lib/actions/user'
import {prisma} from '@/prisma/client'
import {NextResponse} from 'next/server'

export async function GET() {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated')

	const activeLearningProfileId = user.activeLearningProfileId
	if (!activeLearningProfileId) throw new Error('No active learning profile for user')

	try {
		const streak = await prisma.learningProfile.findUnique({
			where: {
				id: activeLearningProfileId,
			},
			select: {
				streakCount: true,
			},
		})
		const streakCount = streak?.streakCount || 0
		return NextResponse.json({streakCount})
	} catch (error) {
		console.error('Error fetching streak:', error)
		return NextResponse.json({error: 'Error fetching streak.'}, {status: 500})
	}
}
