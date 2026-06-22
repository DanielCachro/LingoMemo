import {PROTECTED_PATHS} from '@/lib/constants/protectedPaths'
import type {MetadataRoute} from 'next'

export default function robots(): MetadataRoute.Robots {
	const staticAssetsToIgnore = ['/cats/', '/sounds/', '/docs/']
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: [...PROTECTED_PATHS, '/auth/', '/api/', ...staticAssetsToIgnore],
		},
	}
}
