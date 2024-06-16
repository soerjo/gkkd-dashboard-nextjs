import React from 'react'
import { Spinner } from './ui/spinner'

const LodingPage = () => {
    return (
        <div className='w-screen h-screen flex justify-center items-center'>
            <div className="flex items-center gap-3">
                <Spinner size="large">
                    <span >Loading page...</span>
                </Spinner>
            </div>
        </div>
    )
}

export default LodingPage