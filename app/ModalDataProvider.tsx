'use client'

import {createContext, ReactNode, useCallback, useContext, useState} from 'react'

type ModalData = Record<string, unknown>

interface ModalDataContext {
	data: ModalData
	setData: <T>(key: string, value: T) => void
	getData: <T>(key: string) => T | undefined
	clearData: (key?: string) => void
}

const ModalDataContext = createContext<ModalDataContext | null>(null)

export function ModalDataProvider({children}: {children: ReactNode}) {
	const [data, setDataState] = useState<ModalData>({})

	const setData = useCallback(function setData<T>(key: string, value: T) {
		setDataState(prev => ({...prev, [key]: value}))
	}, [])

	function getData<T>(key: string): T | undefined {
		return data[key] as T | undefined
	}

	const clearData = useCallback(function clearData(key?: string) {
		if (!key) {
			setDataState({})
		} else {
			setDataState(prev => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const {[key]: _, ...rest} = prev
				return rest
			})
		}
	}, [])

	const contextValue: ModalDataContext = {
		data,
		setData,
		getData,
		clearData,
	}

	return <ModalDataContext.Provider value={contextValue}>{children}</ModalDataContext.Provider>
}

export function useModalData() {
	const context = useContext(ModalDataContext)
	if (!context) throw new Error('useModalData must be used within ModalDataProvider')
	return context
}
