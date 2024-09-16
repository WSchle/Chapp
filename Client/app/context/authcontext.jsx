'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Loading from './loading';

const authContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();

    const [isAuthed, setIsAuthed] = useState(false);

    const isAuthenticated = (token, username) => {
        if (token.length == 0 || username.length == 0) {
            return false;
        }
        return true;
    };

    useEffect(() => {
        var user = localStorage.getItem('username') || '';
        var jwtoken = localStorage.getItem('jwtoken') || '';

        var authed = isAuthenticated(jwtoken, user);
        // not really an authentication, just checking if we have the username and jsonwebtoken
        // real authentication will happen on the server
        setIsAuthed(authed);

        if (!authed) router.push('/login');
    }, []);

    return (
        <authContext.Provider value={isAuthed}>
            {isAuthed ? children : <Loading />}
        </authContext.Provider>
    );
};

export const useAuth = () => useContext(authContext);
