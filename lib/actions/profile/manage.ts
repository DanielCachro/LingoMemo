'use server'
import {getCurrentUser, setActiveLearningProfile} from '@/lib/actions/user'
import {prisma} from '@/prisma/client'
import type {RevalidationConfig} from '@/types/revalidate'
import {Prisma, SourceLanguages, TargetLanguages} from '@prisma/client'
import {revalidatePath} from 'next/cache'
import {z} from 'zod'

// Delete learning profile

export async function deleteLearningProfile(profileId: number, config: RevalidationConfig = {revalidateAfter: false}) {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated')

	const activeLearningProfile = user.activeLearningProfile
	const activeLearningProfileId = user.activeLearningProfileId

	if (!activeLearningProfile || !activeLearningProfileId) throw new Error('No active learning profile found.')

	if (activeLearningProfileId === profileId) {
		if (user.learningProfiles.length === 1) {
			throw new Error('Cannot delete the only learning profile.')
		}
		const newActiveProfile = user.learningProfiles.find(profile => profile.id !== profileId)
		if (!newActiveProfile) {
			throw new Error('No alternative learning profile found to set as active.')
		}

		await setActiveLearningProfile(newActiveProfile.id, {
			revalidateAfter: true,
			pathToRevalidate: '/home',
			type: 'layout',
		})
	}

	await prisma.learningProfile.delete({
		where: {
			id: profileId,
			userId: user.id,
		},
	})

	if (config.revalidateAfter) {
		revalidatePath(config.pathToRevalidate)
	}
}

// Create learning profile

const createLanguageProfileSchema = z.object({
	type: z.literal('language'),
	sourceLang: z.enum(SourceLanguages),
	targetLang: z.enum(TargetLanguages),
})
type CreateLanguageProfile = z.infer<typeof createLanguageProfileSchema>

const createSelfStudyProfileSchema = z.object({
	type: z.literal('self-study'),
	profileName: z.string().min(2).max(50),
})
type CreateSelfStudyProfile = z.infer<typeof createSelfStudyProfileSchema>

interface CreateLearningProfileError {
	message: string
	location: 'sourceLang' | 'targetLang' | 'profileName' | 'form'
}

export async function createLearningProfile(
	params: CreateLanguageProfile | CreateSelfStudyProfile,
	config: RevalidationConfig = {revalidateAfter: false},
): Promise<{errors: CreateLearningProfileError[]} | void> {
	const user = await getCurrentUser()
	if (!user) throw new Error('User not authenticated')

	try {
		let createData: Record<string, unknown>

		if (params.type === 'language') {
			const {sourceLang, targetLang} = params

			const errors: CreateLearningProfileError[] = []
			if (!sourceLang) errors.push({message: 'Source language is required.', location: 'sourceLang'})
			if (!targetLang) errors.push({message: 'Target language is required.', location: 'targetLang'})
			if (errors.length > 0) {
				return {errors}
			}

			const validation = createLanguageProfileSchema.safeParse(params)
			if (!validation.success) {
				return {
					errors: [
						{message: 'Validation error, at least one of the selected languages is incorrect.', location: 'form'},
					],
				}
			}

			createData = {
				userId: user.id,
				sourceLang,
				targetLang,
			}
		} else {
			const {profileName} = params
			if (!profileName) return {errors: [{message: 'Profile name is required.', location: 'profileName'}]}

			const validation = createSelfStudyProfileSchema.safeParse(params)
			if (!validation.success) {
				return {errors: [{message: 'Please enter a valid name between 2 and 50 characters.', location: 'profileName'}]}
			}

			createData = {
				userId: user.id,
				profileName,
			}
		}

		await prisma.learningProfile.create({data: createData})

		if (config.revalidateAfter) {
			revalidatePath(config.pathToRevalidate)
		}
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
			return {errors: [{message: 'Learning profile already exists.', location: 'form'}]}
		}
		throw new Error((error as Error).message)
	}
}
