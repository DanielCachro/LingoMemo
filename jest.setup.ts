import '@testing-library/jest-dom'
import fs from 'fs'
import path from 'path'
import {TextDecoder, TextEncoder} from 'util'

// -----------------------------------------------------------------------------
// Environment Variables Override
// -----------------------------------------------------------------------------
// Overrides the default DATABASE_URL and DIRECT_URL loaded by Jest from standard .env files.
// This ensures that the Prisma Client in the test worker process connects to the
// isolated PostgreSQL container created in globalSetup.ts, preventing the real
// database from being accidentally modified or truncated during tests.
const ENV_FILE_PATH = path.join(__dirname, '.env.test.local')

if (fs.existsSync(ENV_FILE_PATH)) {
	const fileContents = fs.readFileSync(ENV_FILE_PATH, 'utf-8')

	const dbMatch = fileContents.match(/DATABASE_URL="(.*)"/)
	const directMatch = fileContents.match(/DIRECT_URL="(.*)"/)

	if (dbMatch && dbMatch[1]) {
		process.env.DATABASE_URL = dbMatch[1]
	}

	if (directMatch && directMatch[1]) {
		process.env.DIRECT_URL = directMatch[1]
	}
}

// -----------------------------------------------------------------------------
// Node.js Polyfills
// -----------------------------------------------------------------------------
// JSDOM lacks these globals which are required by Prisma and other libraries
Object.assign(global, {TextEncoder, TextDecoder})

// -----------------------------------------------------------------------------
// Browser/DOM Mocks
// -----------------------------------------------------------------------------
// JSDOM does not implement IntersectionObserver (used for animations)
class MockIntersectionObserver {
	observe = jest.fn()
	disconnect = jest.fn()
	unobserve = jest.fn()
}

if (typeof window !== 'undefined') {
	Object.defineProperty(window, 'IntersectionObserver', {
		writable: true,
		configurable: true,
		value: MockIntersectionObserver,
	})
}

Object.defineProperty(global, 'IntersectionObserver', {
	writable: true,
	configurable: true,
	value: MockIntersectionObserver,
})
