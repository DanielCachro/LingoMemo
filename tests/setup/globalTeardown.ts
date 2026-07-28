import fs from 'fs'
import path from 'path'

const ENV_FILE = path.join(__dirname, '../../.env.test.local')

export default async function globalTeardown() {
	const container = global.__DB_CONTAINER__

	if (container) {
		console.log('\n[Jest] Stopping PostgreSQL container...')
		await container.stop()
		console.log('[Jest] Container stopped.')
	}

	if (fs.existsSync(ENV_FILE)) {
		fs.unlinkSync(ENV_FILE)
	}
}
