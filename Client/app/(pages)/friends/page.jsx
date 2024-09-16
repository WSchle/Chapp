'use client';
import FriendCard from '@/app/ui/dashboard/friends/friendcard';
import styles from './friends.module.css';

import { useRouter } from 'next/navigation';
import { useState, useContext, useEffect } from 'react';

const gFriendList = [
    {
        users: [{ name: 'Andrew Andrewson' }, { name: 'Max Mustermann' }, { name: 'Jürgen Jürgenson' }],
    },
];

const Friends = () => {
    const router = useRouter();
    const [toSearch, setToSearch] = useState('');
    var friendList = {};

    return (
        <div className={styles.container}>
            <div className={styles.search}>
                <input
                    type='text'
                    placeholder='Suchen...'
                    className={styles.input}
                    onChange={(e) => {
                        setToSearch(e.target.value);
                    }}
                />
            </div>

            <div className={styles.clip}>
                <ul className={styles.friendslist}>
                    {gFriendList[0].users.map((item) => {
                        if (toSearch == '' || (toSearch != '' && item.name.toLowerCase().startsWith(toSearch))) {
                            return (
                                <li key={item.name}>
                                    <FriendCard data={{ user: item.name }} className={styles.friendcard} />
                                </li>
                            );
                        }
                    })}
                </ul>
            </div>
            <p className={styles.noitems}>No friends found!</p>
        </div>
    );
};

export default Friends;
