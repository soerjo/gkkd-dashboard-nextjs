'use client'

import { Button } from '@/components/custom/button'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NotFoundError() {
    const { push, back } = useRouter();

    useEffect(() => { setTimeout(() => push('/'), 5000); }, [push])

    return (
        <div className='h-svh'>
            <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                <h1 className='text-[7rem] font-bold leading-tight'>404</h1>
                <span className='font-medium'>Oops! Page Not Found!</span>
                <p className='text-center text-muted-foreground'>
                    It seems like the page you&apos;re looking for <br />
                    does not exist or might have been removed.
                </p>
                <div className='mt-6 flex gap-4'>
                    <Button variant='outline' onClick={() => back()}>
                        Go Back
                    </Button>
                    <Button onClick={() => push('/')}>Back to Home</Button>
                </div>
            </div>
        </div>
    )
}
