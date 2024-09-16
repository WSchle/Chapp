'use client';
import { usePathname, useRouter } from 'next/navigation';
import styles from './navbar.module.css';
import { MdLogout, MdNotifications, MdSettings } from 'react-icons/md';

const Navbar = () => {
    const pathName = usePathname();
    const router = useRouter();

    function handleSettingsClick() {
        // Settings not yet implemented
        router.push('/settings');
    }

    function handleNotificationsClick() {
        // Notifications not yet implemented
        router.push('/settings');
    }

    async function handleLogoutClick() {
        localStorage.clear();
        router.push('/login');
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>{pathName.split('/').pop()}</div>
            <div className={styles.menu}>
                <div className={styles.icons}>
                    <button className={styles.notifications}>
                        <MdNotifications size={25} />
                    </button>
                    <button className={styles.settings} disabled={true}>
                        <MdSettings size={25} />
                    </button>
                    <button className={styles.logout} onClick={handleLogoutClick}>
                        <MdLogout size={25} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
