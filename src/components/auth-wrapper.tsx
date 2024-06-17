'use client'

import { useDispatch, useSelector } from 'react-redux';
import { AUTH_PAYLOAD, AUTH_TOKEN, getAuthCookie } from '@/lib/cookies';
import { useEffect, useState } from 'react';
import { logout, setInitialState } from '@/store/slice/auth';
import { usePathname, useRouter } from 'next/navigation';
import LodingPage from './loading';
import { RootState } from '@/store';
import { UserPayload } from '@/interfaces/loginResponse';

type Props = {
    children?: React.ReactNode;
};

const skipValidationPathName = ["/login"]

export const AuthWrapper = ({ children }: Props) => {
    const [isTokenExist, setTokenExist] = useState<string | undefined>()
    const dispatch = useDispatch();
    const { push } = useRouter();
    const pathname = usePathname()

    const token = getAuthCookie(AUTH_TOKEN)

    useEffect(() => {
        setTokenExist(token)
        if (!token) {
            push('/login');
            dispatch(logout());
        } else {
            dispatch(setInitialState())
        }
    }, [token, push, dispatch]);

    if (skipValidationPathName.includes(pathname)) return children

    return <> {isTokenExist ? children : <LodingPage />} </>
};