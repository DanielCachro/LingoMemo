'use client'
import type {DictionaryEntry} from '../lib/types'
import {ReactNode, createContext, useContext} from 'react'
export type FlashcardEntry = Pick<DictionaryEntry, 'word' | 'phonetic' | 'audio' | 'source'>

type ContextValue = {data: FlashcardEntry}

const EntryContext = createContext<ContextValue | undefined>(undefined)

export function EntryProvider({data, children}: {data: FlashcardEntry; children: ReactNode}) {
	return <EntryContext.Provider value={{data}}>{children}</EntryContext.Provider>
}

export function useEntry() {
	const ctx = useContext(EntryContext)
	if (!ctx) throw new Error('useEntry must be used inside <EntryProvider />')
	return ctx.data
}
