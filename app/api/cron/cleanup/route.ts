import {prisma} from '@/prisma/client'
import {DateTime} from 'luxon'
import {NextResponse} from 'next/server'

// This route is intended to be called by a cron job to clean logs older than three months.
export async function GET() {
	try {
		const threeMonthsAgo = DateTime.now().minus({months: 3}).toJSDate()

		const deletedReviewLogs = await prisma.flashcardReviewLog.deleteMany({
			where: {
				reviewedAt: {
					lt: threeMonthsAgo,
				},
			},
		})

		const deletedStudyLogs = await prisma.studyCompletionLog.deleteMany({
			where: {
				completedAt: {
					lt: threeMonthsAgo,
				},
			},
		})

		return NextResponse.json({
			message: 'Cleanup successful',
			deletedReviewLogs: deletedReviewLogs.count,
			deletedStudyLogs: deletedStudyLogs.count,
			cutoffDate: threeMonthsAgo.toISOString(),
		})
	} catch (error) {
		console.error('Cleanup failed:', error)
		return NextResponse.json({error: 'Internal Server Error'}, {status: 500})
	}
}
