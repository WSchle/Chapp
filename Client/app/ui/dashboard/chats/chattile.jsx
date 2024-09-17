import styles from './chattile.module.css';

import moment from 'moment';

const ChatTile = ({ item, isSelected, onC }) => {
    const otherUser = item.otherUser;
    const lastMessage = item.lastMessage;
    const lastMessageDate = moment(item.lastMessageDate);

    let tempDiff = lastMessageDate.fromNow().split(' '); // Getting how long ago the message was send as array of words
    [tempDiff[0], tempDiff[1], tempDiff[2]] = [tempDiff[2], tempDiff[0], tempDiff[1]]; // English Layout -> German Layout (a month ago -> vor 1 Monat)
    tempDiff = tempDiff.join(' '); // Join array back to string

    const diffReplacements = {
        'minute': 'Minute',
        'minutes': 'Minuten',
        'hour': 'Stunde',
        'hours': 'Stunden',
        'day': 'Tag',
        'days': 'Tagen',
        'month': 'Monat',
        'months': 'Monaten',
        'year': 'Jahr',
        'years': 'Jahren',
    };

    let dateDifference = '';
    Object.keys(diffReplacements).forEach((key) => {
        if (tempDiff.includes(key)) {
            // When a "diffReplacements" key is found in the string, we replace that instance with its german counterpart
            dateDifference = tempDiff.replace(key, diffReplacements[key]);
        }
    });
    dateDifference = dateDifference // Special cases where the message was only one unit ago and static ago->vor change
        .replace(new RegExp(/\b(a)(n?)\b/), '1')
        .replace(new RegExp(/\bago\b/), 'vor');

    return (
        <button onClick={onC} className={styles.button}>
            <div className={`${styles.container} ${isSelected && styles.active}`}>
                <div className={styles.namecontainer}>
                    <p className={styles.namec}>Chat:</p>
                    <p className={styles.name}>{otherUser}</p>
                </div>
                <div className={styles.infocontainer}>
                    <p className={styles.preview}>
                        "{lastMessage.length >= 25 ? lastMessage.slice(0, 25) + '...' : lastMessage}
                        "
                    </p>
                    <p className={styles.date}>{dateDifference}</p>
                </div>
            </div>
        </button>
    );
};

export default ChatTile;
