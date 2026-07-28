import '@testing-library/jest-dom'
import {TextDecoder, TextEncoder} from 'util'

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
