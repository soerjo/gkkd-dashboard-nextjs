'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_TOKEN, getAuthCookie } from '@/lib/cookies';
import { UserAuthForm } from './_components/user-auth-form';

export default function SignIn() {
    const { push } = useRouter()
    const token = getAuthCookie(AUTH_TOKEN)

    useEffect(() => {
        if (token) push('/');
    }, [token, push]);


    return (
        <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
            <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
                <div className={`absolute inset-0 bg-zinc-800`} />
                <svg width="731" height="745" viewBox="0 0 731 745" fill="none" xmlns="http://www.w3.org/2000/svg"
                    className='h-[200px] w-[200px] relative m-auto'
                >
                    <path fillRule="evenodd" clipRule="evenodd" d="M313.006 333.076H204.488L204.501 333.1L0 651.987H50.0851L227.011 376.099L262.659 444.193L129.404 651.982H179.489L285.169 487.192L318.927 551.676L254.601 651.982H304.686L341.437 594.674L371.438 651.982H479.956L401.183 501.511L410.377 487.173L496.656 651.982H605.174L470.123 394.01L479.317 379.673L621.874 651.982H730.391L563.441 333.076H509.2H459.115H454.923L456.807 336.674L447.613 351.011L438.223 333.076H384.003H333.918H329.706L331.599 336.692L322.405 351.029L313.006 333.076ZM354.109 379.691L387.867 444.175L378.673 458.512L344.915 394.028L354.109 379.691Z" fill="white" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M450.78 0L450.78 147.186L651.126 147.186V302.551H450.78V318.766H400.407V253.206H600.753V196.53L400.407 196.53L400.407 49.3445H334.202L334.202 196.53L125.52 196.53V253.206H334.202V318.766H283.83V302.551H75.1475V147.186L283.83 147.186L283.83 0H450.78ZM283.829 667.888L283.829 744.115H450.78V667.888H400.407V694.771H334.202V667.888H283.829Z" fill="white" />
                </svg>

            </div>
            <div className='lg:p-8'>
                <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
                    <div className='flex flex-col space-y-2 text-left'>
                        <h1 className='text-2xl font-semibold tracking-tight mb-4'>Login</h1>
                    </div>
                    <UserAuthForm />
                </div>
            </div>
        </div>
    )
}
