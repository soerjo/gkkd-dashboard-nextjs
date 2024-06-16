'use client'

import { useDispatch, useSelector } from 'react-redux';
import { AUTH_TOKEN, getAuthCookie } from '@/lib/cookies';
import { useEffect, useState } from 'react';
import { login, logout } from '@/store/slice/auth';
import { useRouter } from 'next/navigation';
import LodingPage from './loading';
import { RootState } from '@/store';
import { setInitialState } from '@/store/slice/theme';

type Props = {
    children?: React.ReactNode;
};

export const AuthWrapper = ({ children }: Props) => {
    const [isTokenExist, setTokenExist] = useState<string | undefined>()
    const theme = useSelector((state: RootState) => state.theme)
    const dispatch = useDispatch();
    const { push } = useRouter();

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

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const root = window.document.documentElement


            // console.log({ themDarkBefore: root.classList.value })
            root.classList.remove('light', 'dark', 'system')

            // console.log({ isDark: theme })
            root.classList.add(theme.isDark)
            // console.log({ themDark: root.classList.value })
        }
    }, [theme])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            dispatch(setInitialState())
        }
    }, [dispatch])

    // const root = window.document.documentElement
    // root.classList.add(theme.isDark)
    return <> {isTokenExist ? children : <LodingPage />} </>
};