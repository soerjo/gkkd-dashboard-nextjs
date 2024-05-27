'use client'

import { useDispatch } from 'react-redux';
import { AUTH_TOKEN, getAuthCookie } from '@/lib/cookies';
import { useEffect } from 'react';
import { logout } from '@/store/slice/auth';
import { useRouter } from 'next/navigation';

type Props = {
    children?: React.ReactNode;
};

export const AuthWrapper = ({ children }: Props) => {
    const dispatch = useDispatch();
    const { push } = useRouter();

    const token = getAuthCookie(AUTH_TOKEN)

    useEffect(() => {
        if (!token) {
            push('/login');
            dispatch(logout());
        }
    }, [token, push, dispatch]);

    // if (token) return children

    // return (<p>loading...</p>)

    return children
};