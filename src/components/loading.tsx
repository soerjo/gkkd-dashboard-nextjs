import React from 'react'
import { Spinner } from './ui/spinner'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

const LodingPage = () => {
    // const theme = useSelector((state: RootState) => state.theme)

    // if (typeof window !== 'undefined') {
    //     const root = window.document.documentElement
    //     root.classList.remove('light', 'dark', 'system')
    //     root.classList.add(theme.isDark)
    // }

    return (
        <div className='w-screen h-screen flex justify-center items-center'>
            <div className="flex items-center gap-3">
                <Spinner size="large" >
                    <span >Loading page...</span>
                </Spinner>
            </div>
        </div>
    )
}

export default LodingPage