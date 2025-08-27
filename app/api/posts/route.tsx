import {prisma} from '@/prisma/client'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(request: NextRequest) {
	

	const newPost = await prisma.post.create({
		data: {
			title: 'New Post',
			content: 'This is a new post.',
		},
	})

	return NextResponse.json(newPost, {status: 201})
}
