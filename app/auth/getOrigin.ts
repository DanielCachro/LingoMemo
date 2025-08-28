import {NextRequest} from 'next/server'

export default function getOrigin(request: NextRequest) {
	const forwardedHost = request.headers.get('x-forwarded-host')
	const isLocalEnv = process.env.NODE_ENV === 'development'
	const protocol = isLocalEnv ? request.headers.get('x-forwarded-proto') : 'https'
	const origin = forwardedHost ? `${protocol}://${forwardedHost}` : request.nextUrl.origin

	return origin
}
