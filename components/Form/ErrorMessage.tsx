export default function ErrorMessage({error}: {error: string[] | string}) {
	if (!error || (Array.isArray(error) && error.length === 0)) {
		return null
	}
	return <p className='mt-8 text-sm text-error-500'>{Array.isArray(error) ? error[0] : error}</p>
}
