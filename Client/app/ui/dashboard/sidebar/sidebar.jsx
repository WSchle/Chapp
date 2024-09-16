'use client';
import styles from './sidebar.module.css';
import MenuLink from './links/links';

import { MdChat, MdPeople, MdSettings } from 'react-icons/md';
import Image from 'next/image';
import Link from 'next/link';

const menuItems = [
    {
        title: 'Pages',
        list: [
            {
                title: 'Chats',
                path: '/chats',
                icon: <MdChat />,
            },
            {
                title: 'Freunde',
                path: '/friends',
                icon: <MdPeople />,
            },
            {
                title: 'Einstellungen',
                path: '/settings',
                icon: <MdSettings />,
            },
        ],
    },
];

const Sidebar = () => {
    return (
        <div className={styles.container}>
            <Link href='/settings'>
                <div className={styles.user}>
                    <Image
                        className={styles.userImage}
                        src='/noavatar.png'
                        alt=''
                        width='50'
                        height='50'
                    />
                    {localStorage.getItem('username') == null ? (
                        <Loading />
                    ) : (
                        <span className={styles.username}>{localStorage.getItem('username')}</span>
                    )}
                </div>
            </Link>

            <ul className={styles.pages}>
                {menuItems[0].list.map((item) => (
                    <li key={item.title}>
                        <MenuLink
                            item={item}
                            key={item.title}
                            disabled={item.path == '/settings'}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
