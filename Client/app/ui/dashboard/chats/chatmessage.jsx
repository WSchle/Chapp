import moment from 'moment';
import Image from 'next/image';
import styles from './chatmessage.module.css';
import { useEffect } from 'react';

const ChatMessage = ({ chatData, isFromSelf }) => {
    const lastMessageDate = moment(chatData.msgdate);

    return (
        <div
            className={`${styles.message} ${
                isFromSelf ? styles.rightmessage : styles.leftmessage
            }`}>
            <div className={styles.user}>
                <Image
                    className={styles.userImage}
                    src='/noavatar.png'
                    alt=''
                    width='50'
                    height='50'
                />
                <p>{chatData.username}</p>
                <p className={styles.date}>{lastMessageDate.format('D.M.YYYY')}</p>
                <p className={styles.date}>{lastMessageDate.format('H:mm')}</p>
            </div>
            <div className={styles.data}>
                <p>{chatData.message}</p>
            </div>
        </div>
    );
};

export default ChatMessage;
