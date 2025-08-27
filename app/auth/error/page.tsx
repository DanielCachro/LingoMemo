'use client'

import ErrorPage from '@/components/ErrorPage'
import {useRouter} from 'next/navigation'

export default function ErrorPageWrapper() {
	const router = useRouter()

	return <ErrorPage onBtnClick={() => router.push('/')} />
}
