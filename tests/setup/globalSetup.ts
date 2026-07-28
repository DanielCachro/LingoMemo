import {PostgreSqlContainer} from '@testcontainers/postgresql'
import {execSync} from 'child_process'
import fs from 'fs'
import path from 'path'

const ENV_FILE = path.join(__dirname, '../../.env.test.local')

export default async function globalSetup() {
	console.log('\n[Jest] Starting PostgreSQL container...')
	const container = await new PostgreSqlContainer('postgres:15-alpine').start()

	const uri = container.getConnectionUri()

	fs.writeFileSync(ENV_FILE, `DATABASE_URL="${uri}"\n`)
	global.__DB_CONTAINER__ = container

	console.log('[Jest] Pushing Prisma schema...')
	execSync('npx prisma db push --accept-data-loss', {
		env: {...process.env, DATABASE_URL: uri},
		stdio: 'ignore', // Suppress output for cleaner logs
	})

	console.log('[Jest] Database is ready!')
}
