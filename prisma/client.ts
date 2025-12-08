import {PrismaClient} from '@/lib/generated/prisma/client'
import {PrismaPg} from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {prisma: PrismaClient}

const prismaClientSingleton = () => {
	const adapter = new PrismaPg({
		connectionString: process.env.DATABASE_URL,
		max: 10,
		connectionTimeoutMillis: 5000,
		idleTimeoutMillis: 20000,
	})

	return new PrismaClient({adapter})
}

export const prisma = globalForPrisma.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
