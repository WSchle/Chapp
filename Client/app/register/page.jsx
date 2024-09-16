'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';
import { MdCheck, MdError, MdInfo } from 'react-icons/md';
import Link from 'next/link';
/*
    USER_REGEX
    [A-z] = Beginnt mit einem Groß- oder Kleinbuchstaben
    [A-z0-9-_]{3,23} = Nach dem ersten Buchstaben müssen 3-23 Zeichen folgen (Groß-/Kleinbuchstaben/Zahlen/Unterstrich)
*/
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
/*
    PWD_REGEX
    (?=.*[a-z]) = Mindestens einen Kleinbuchstaben
    (?=.*[A-Z]) = Mindestens einen Großbuchstaben
    (?=.*[0-9]) = Mindestens eine Zahl
    (?=.*[!@#$%]) = Mindestens ein Sonderzeichen
    .{8,24} = Insgesamt mindestens 8 und maximal 24 Zeichen
*/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%?]).{8,24}$/;

const Register = () => {
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState('');

    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);

    const [passwordMatch, setPasswordMatch] = useState('');
    const [validPasswordMatch, setValidPasswordMatch] = useState(false);

    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // check if the typed username fits our regex
        setValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        // check if the typed password fits our regex
        setValidPassword(PWD_REGEX.test(password));
        setValidPasswordMatch(password === passwordMatch);
    }, [password, passwordMatch]);

    useEffect(() => {
        // We dont want to show the error when the user changes the text in the textfields
        setErrorMessage('');
    }, [username, password, passwordMatch]);

    async function handleSubmit(event) {
        event.preventDefault(); // We dont want to refresh the page

        const response = await fetch('http://localhost:3030/api/user/register', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
            credentials: 'omit', // telling the server that we send credentials with the request
        });
        if (response.status != 200) {
            setErrorMessage((await response.json()).message);
        } else {
            setUsername('');
            setValidUsername(false);
            setPassword('');
            setValidPassword(false);
            setPasswordMatch('');
            setValidPasswordMatch(false);

            setSuccessMessage('Registration successful');
            setTimeout(() => {
                // Let the user see the success message before redirecting to login
                router.push('/login');
            }, 2000);
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
                <div className={successMessage ? styles.success : styles.notvisible}>
                    <MdCheck size={24} className={styles.successicon} />
                    <p className={styles.successmessage}>{successMessage}</p>
                </div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        className={`${styles.username} ${
                            !username
                                ? ''
                                : validUsername
                                ? styles.validinput
                                : styles.incorrectinput
                        }`}
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
                    <p
                        className={
                            username && !validUsername ? styles.instructions : styles.notvisible
                        }>
                        <MdInfo size={24} className={styles.info} />
                        Your username has to contain 4 to 24 characters.
                        <br />
                        It must begin with a letter but can be followed
                        <br />
                        by Numbers, underscores or hyphens.
                    </p>
                    <input
                        className={`${styles.password} ${
                            !password
                                ? ''
                                : validPassword
                                ? styles.validinput
                                : styles.incorrectinput
                        }`}
                        type='password'
                        id='password'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        placeholder='Password:'
                        required
                    />
                    <p
                        className={
                            password && !validPassword ? styles.instructions : styles.notvisible
                        }>
                        <MdInfo size={24} className={styles.info} />
                        Your password has to contain 8 to 24 characters.
                        <br />
                        Must include at least one of each following:
                        <br />
                        - Uppercase letter
                        <br />
                        - Lowercase letter
                        <br />
                        - Number
                        <br />- Special character (!@#$%)
                    </p>
                    <input
                        className={`${styles.passwordmatch} ${
                            !passwordMatch
                                ? ''
                                : validPasswordMatch
                                ? styles.validinput
                                : styles.incorrectinput
                        }`}
                        type='password'
                        id='passwordmatch'
                        value={passwordMatch}
                        onChange={(e) => {
                            setPasswordMatch(e.target.value);
                        }}
                        placeholder='Repeat password:'
                        required
                    />
                    <p
                        className={
                            password && passwordMatch && !validPasswordMatch
                                ? styles.instructions
                                : styles.notvisible
                        }>
                        <MdInfo size={24} className={styles.info} />
                        The passwords are not matching
                    </p>
                    <button
                        disabled={!validUsername || !validPassword || !validPasswordMatch}
                        type='submit'
                        className={styles.submit}>
                        Register
                    </button>
                    <div className={styles.footer}>
                        <p>already registered?</p>
                        <Link href='/login' className={styles.link}>
                            <p>login here</p>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
