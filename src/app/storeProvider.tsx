'use client'

import { Provider } from 'react-redux'
import { makeStore } from '@/store'

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={makeStore}>{children}</Provider>
}