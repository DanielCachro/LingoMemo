import SlabBorder from '@/components/SlabBorder'
import Image from 'next/image'

export default function SetupLayout({children}: {children: React.ReactNode}) {
	return (
		<div className='flex h-dvh items-center justify-center section-pattern p-16'>
			<SlabBorder rounded='xl' borderSize='sm' slabSize='md' className='p-32'>
				<div className='flex items-center gap-8'>
					<Image
						src={`/cats/CatSmile.svg`}
						alt={`Brand cat happy`}
						width={120}
						height={112}
						priority
						className='w-32'
					/>
					<h1 className='text-xl font-bold sm:text-2xl'>Welcome to LingoMemo!</h1>
				</div>

				<p className='mt-4 mb-32 text-lg'>Let&apos;s set up your learning profile to get started.</p>
				<div>{children}</div>
			</SlabBorder>
		</div>
	)
}
