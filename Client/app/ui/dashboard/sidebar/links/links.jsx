'use client';
import Link from 'next/link';

import styles from './links.module.css';
import { usePathname } from 'next/navigation';

const MenuLink = ({ item, disabled }) => {
    const pathName = usePathname();
    return (
        <Link
            href={item.path}
            className={`${styles.container} ${pathName === item.path && styles.active} ${
                disabled && styles.disabled
            }`}>
            {item.icon}
            {item.title}
        </Link>
    );
};

export default MenuLink;
