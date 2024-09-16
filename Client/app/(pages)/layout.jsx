import Sidebar from '@/app/ui/dashboard/sidebar/sidebar';
import Navbar from '@/app/ui/dashboard/navbar/navbar';
import styles from '../ui/dashboard/dashboard.module.css';

import { AuthProvider } from '../context/authcontext';

const Layout = ({ children }) => {
    return (
        <AuthProvider>
            <div className={styles.container}>
                <>
                    <div className={styles.menu}>
                        <Sidebar />
                    </div>
                    <div className={styles.contentcontainer}>
                        <Navbar />
                        <div className={styles.content}>{children}</div>
                    </div>
                </>
            </div>
        </AuthProvider>
    );
};

export default Layout;
