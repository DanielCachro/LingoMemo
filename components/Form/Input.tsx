import {Input as HeadlessInput, InputProps} from '@headlessui/react'

export default function Input({...props}: InputProps) {
	return <HeadlessInput {...props} />
}
