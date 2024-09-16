import Image from 'next/image';
import styles from './friendcard.module.css';
import { MdChat, MdDelete } from 'react-icons/md';
import { Tooltip } from '@nextui-org/tooltip';

const FriendCard = ({ data }) => {
    return (
        <div className={styles.container}>
            <div className={styles.user}>
                <Image
                    className={styles.userImage}
                    src='/noavatar.png'
                    alt=''
                    width='50'
                    height='50'
                />
                <p className={styles.name}>{data.user}</p>
            </div>
            <div className={styles.buttons}>
                <button className={styles.openchat}>
                    <MdChat size={25} />
                </button>
                <button className={styles.unfriend}>
                    <MdDelete size={25} />
                </button>
            </div>
        </div>
    );
};

export default FriendCard;
