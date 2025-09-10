import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'

export default function Buttons() {
	const primaryButtonClassName = 'px-32 py-8'
	const secondaryButtonClassName = 'px-32 py-[0.375rem]'

	return (
		<div className='sticky bottom-0 w-full flex items-center justify-center border-t-2 border-background-200 bg-background-100 py-16 dark:border-background-800 dark:bg-background-900'>
			<menu className='flex gap-24'>
				{false && (
					<>
						<li>
							<SecondaryButton className={secondaryButtonClassName}>Back</SecondaryButton>
						</li>
						<li>
							<PrimaryButton className={primaryButtonClassName}>Check</PrimaryButton>
						</li>
					</>
				)}
				{true && (
					<>
						<li>
							<SecondaryButton className={secondaryButtonClassName}>Bad</SecondaryButton>
						</li>
						<li>
							<PrimaryButton className={primaryButtonClassName}>Good</PrimaryButton>
						</li>
						<li>
							<SecondaryButton className={secondaryButtonClassName}>Easy</SecondaryButton>
						</li>
					</>
				)}
			</menu>
		</div>
	)
}
