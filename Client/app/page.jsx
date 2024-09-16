'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from './context/loading';

const Homepage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/chats');
        // Redirecting to Chats. When user wasnt logged in yet he will then be redirected to login
    }, []);

    return <Loading />;
};

export default Homepage;
