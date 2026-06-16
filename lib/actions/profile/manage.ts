'use server'
import {setActiveLearningProfile} from '@/lib/actions/user'
import {SourceLanguages, TargetLanguages} from '@/lib/generated/prisma/browser'
import {Prisma} from '@/lib/generated/prisma/client'
import {getCurrentUser} from '@/lib/queries/user'
import {prisma} from '@/prisma/client'
import type {RevalidationConfig} from '@/types/revalidate'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'
import {z} from 'zod'

// Delete learning profile

export async function deleteLearningProfile(profileId: number, config: RevalidationConfig = {revalidateAfter: false}) {
	const user = await getCurrentUser()
	if (!user) return {success: false, error: 'User not authenticated'}

	const activeLearningProfile = user.activeLearningProfile
	const activeLearningProfileId = user.activeLearningProfileId

	if (!activeLearningProfile || !activeLearningProfileId)
		return {success: false, error: 'No active learning profile found.'}

	try {
		if (activeLearningProfileId === profileId) {
			if (user.learningProfiles.length === 1) {
				return {success: false, error: 'Cannot delete the only learning profile.'}
			}
			const newActiveProfile = user.learningProfiles.find(profile => profile.id !== profileId)
			if (!newActiveProfile) {
				return {success: false, error: 'No alternative learning profile found to set as active.'}
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
	} catch (error) {
		console.error('Error deleting profile:', error)
		return {success: false, error: 'Failed to delete profile. Please try again.'}
	}

	if (config.revalidateAfter) {
		revalidatePath(config.pathToRevalidate)
	}

	return {success: true}
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
	config: RevalidationConfig & {redirectTo?: string} = {revalidateAfter: false},
): Promise<{success: boolean; errors?: CreateLearningProfileError[]; error?: string}> {
	const user = await getCurrentUser()
	if (!user) return {success: false, error: 'User not authenticated'}

	try {
		let createData: Record<string, unknown>

		if (params.type === 'language') {
			const {sourceLang, targetLang} = params

			const errors: CreateLearningProfileError[] = []
			if (!sourceLang) errors.push({message: 'Source language is required.', location: 'sourceLang'})
			if (!targetLang) errors.push({message: 'Target language is required.', location: 'targetLang'})
			if (errors.length > 0) {
				return {success: false, errors}
			}

			const validation = createLanguageProfileSchema.safeParse(params)
			if (!validation.success) {
				return {
					success: false,
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
			if (!profileName)
				return {success: false, errors: [{message: 'Profile name is required.', location: 'profileName'}]}

			const validation = createSelfStudyProfileSchema.safeParse(params)
			if (!validation.success) {
				return {
					success: false,
					errors: [{message: 'Please enter a valid name between 2 and 50 characters.', location: 'profileName'}],
				}
			}

			createData = {
				userId: user.id,
				profileName,
			}
		}

		const newProfile = await prisma.learningProfile.create({data: createData})
		if (!user.activeLearningProfileId) {
			await prisma.user.update({
				where: {id: user.id},
				data: {activeLearningProfileId: newProfile.id},
			})
		}
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
			return {success: false, errors: [{message: 'Learning profile already exists.', location: 'form'}]}
		}
		console.error('Error creating profile:', error)
		return {success: false, error: 'Failed to create profile. Please try again.'}
	}

	if (config.revalidateAfter) {
		revalidatePath(config.pathToRevalidate, config.type)
	}

	if (config.redirectTo) {
		redirect(config.redirectTo)
	}

	return {success: true}
}
