import {StartedTestContainer} from 'testcontainers'

declare global {
	var __DB_CONTAINER__: StartedTestContainer | undefined
}

export {}
