'use client';
import { useEffect, useState, useContext } from 'react';
import styles from './login.module.css';
import { useRouter } from 'next/navigation';
import { MdError } from 'react-icons/md';
import Link from 'next/link';
import cookieCutter from 'cookie-cutter';

const Login = () => {
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState('');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // We dont want to show the error when the user changes the text in the textfields
        setErrorMessage('');
    }, [username, password]);

    async function handleSubmit(event) {
        event.preventDefault();

        const response = await fetch('http://localhost:3030/api/user/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password }),
            credentials: 'omit',
        });
        const responsejson = await response.json();
        if (response.status != 200) {
            setUsername('');
            setPassword('');
            setErrorMessage(responsejson.message);
        } else {
            localStorage.setItem('username', username);
            localStorage.setItem('jwtoken', responsejson.jwtoken);
            // setting local storage items to later send with the request to server
            router.push('/chats');
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.formcontainer}>
                <div className={styles.header}>
                    <h1>Chapp</h1>
                    <h4>a simple chat app</h4>
                </div>
                <div className={errorMessage ? styles.error : styles.notvisible}>
                    <MdError size={24} className={styles.erroricon} />
                    <p className={styles.errormessage}>{errorMessage}</p>
                </div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        className={styles.username}
                        type='text'
                        id='username'
                        value={username}
                        autoComplete='off'
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                        placeholder='Username:'
                        required
                    />
                    <input
                        className={styles.password}
                        type='password'
                        id='password'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        placeholder='Password:'
                        required
                    />
                    <button
                        disabled={!username || !password || errorMessage}
                        type='submit'
                        className={styles.submit}>
                        Login
                    </button>
                    <div className={styles.footer}>
                        <p>not yet registered?</p>
                        <Link href='/register' className={styles.link}>
                            <p>register here</p>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
