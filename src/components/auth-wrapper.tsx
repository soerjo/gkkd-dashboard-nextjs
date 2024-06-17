'use client'

import { useDispatch, useSelector } from 'react-redux';
import { AUTH_TOKEN, getAuthCookie } from '@/lib/cookies';
import { useEffect, useState } from 'react';
import { login, logout } from '@/store/slice/auth';
import { usePathname, useRouter } from 'next/navigation';
import LodingPage from './loading';
import { RootState } from '@/store';
import { setInitialState } from '@/store/slice/theme';

type Props = {
    children?: React.ReactNode;
};

const skipValidationPathName = ["/login"]

export const AuthWrapper = ({ children }: Props) => {
    const [isTokenExist, setTokenExist] = useState<string | undefined>()
    const theme = useSelector((state: RootState) => state.theme)
    const dispatch = useDispatch();
    const { push } = useRouter();
    const pathname = usePathname()
    // const searchParams = useSearchParams()

    const token = getAuthCookie(AUTH_TOKEN)

    useEffect(() => {
        setTokenExist(token)
        if (!token) {
            push('/login');
            dispatch(logout());
        } else {
            const data = JSON.parse(token)
            dispatch(login({ email: data.email, password: data.password }))
        }
    }, [token, push, dispatch]);

    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         const root = window.document.documentElement
    //         root.classList.remove('light', 'dark', 'system')
    //         root.classList.add(theme.isDark)
    //     }
    // }, [theme])

    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         dispatch(setInitialState())
    //     }
    // }, [dispatch])

    if (skipValidationPathName.includes(pathname)) return children

    // console.log({ pathname })
    return <> {isTokenExist ? children : <LodingPage />} </>
    return children
};