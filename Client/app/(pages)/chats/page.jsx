'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { socket } from '@/app/socket';
import styles from './chats.module.css';
import ChatTile from '@/app/ui/dashboard/chats/chattile';
import Loading from '@/app/context/loading';
import ChatMessage from '@/app/ui/dashboard/chats/chatmessage';

const Chat = () => {
    const router = useRouter();
    const [chatList, setChatList] = useState([]);
    const [chatMessages, setChatMessages] = useState(['loading']); // We want to differentiate between loading(not set yet) or empty(no messages yet)
    const [selectedChat, setSelectedChat] = useState('');
    const [error, setError] = useState(false);

    const [messageFieldText, setMessageFieldText] = useState('');

    const getChats = async () => {
        const urlstr = `http://localhost:3030/api/user/get-chats?username=${localStorage.getItem(
            'username'
        )}`;
        const response = await fetch(urlstr, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'BEARER ' + localStorage.getItem('jwtoken'),
            },
        });
        const responsejson = await response.json();

        if (response.status != 200) {
            if (response.status == 401 || response.status == 403) {
                // Token/Username not provided or not valid
                localStorage.clear();
                router.push('/login');
            } else setError(responsejson.msg); // Not used yet, for error alert to client

            return;
        }

        await setChatList(responsejson.chats); // setting the list of all chats we are a receipient of
        await setSelectedChat(responsejson.lastSelectedChatId); // setting the default selected chat to the last we had selected
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // We dont want to refresh the page
        socket.get().emit(
            'chat:message', // message event
            selectedChat, // chatId to send message to
            localStorage.getItem('username'),
            messageFieldText, // message to send
            (response) => {
                if (!response) setError(true); // when response == false the server didnt add/emit the message
            }
        );

        document.getElementById('messagefield').value = '';
    };

    useEffect(() => {
        // Called once on Page load
        function onConnectError(error) {
            if (!socket.get().active) {
                // when socket is not active anymore, force redirect to login
                localStorage.clear(); // clear saved username and token
                router.push('/login');
            }
        }

        socket.init(localStorage.getItem('jwtoken'), onConnectError);

        socket.addListener('message:new', (data) => {
            // Handler for receiving new messages
            setChatMessages((prevMessages) => [
                // Pushing back the new message onto message list
                ...prevMessages,
                {
                    messageID: data.messageId,
                    message: data.message,
                    msgdate: data.date,
                    username: data.username,
                },
            ]);
        });

        getChats(); // Getting all the chatrooms we are a receipient of

        return () => {
            socket.cleanUp(); // Unregister all listeners
        };
    }, []);

    useEffect(() => {
        // Called whenever we select another chat
        if (selectedChat != '' && selectedChat != null)
            // We dont want to emit when no chat is selected
            socket
                .get()
                .emit('chat:join', selectedChat, localStorage.getItem('username'), (response) => {
                    setChatMessages(response); // set local array of all chat messages within the specified(selectedChat) chat room
                });
    }, [selectedChat]);

    return (
        <div className={styles.container}>
            <div className={styles.chatlistcontainer}>
                {chatList.length == 0 ? ( // Show loading circle while list of all chats is loading
                    <Loading />
                ) : (
                    <ul className={styles.chatlist}>
                        {chatList.map((chat) => {
                            // Map all chats into a html ul (unordered list)
                            return (
                                <li key={chat.id}>
                                    <ChatTile
                                        item={chat}
                                        isSelected={chat.id == selectedChat}
                                        onC={(e) => {
                                            // When clicking on a Chat we set the selected chat to the clicked chatId
                                            e.preventDefault();
                                            setSelectedChat(chat.id);
                                        }}
                                        key={chat.id}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {chatMessages[0] == 'loading' ? (
                <div className={`${styles.chatcontainer} ${styles.loading}`}>
                    <Loading />
                </div>
            ) : (
                <div className={styles.chatcontainer}>
                    <div
                        className={`${styles.messages} ${
                            chatMessages.length == 0 ? styles.empty : ''
                        }`}>
                        {chatMessages.length == 0 ? (
                            <p className={styles.nothingfoundtext}>Keine Nachrichten im Chat</p>
                        ) : (
                            <ul className={styles.chatmessages}>
                                {chatMessages.map((messageObj) => {
                                    // Map all chat messages into a html ul (unordered list)
                                    return (
                                        <li
                                            key={messageObj.messageID}
                                            className={styles.newmessage}>
                                            <div key={messageObj.messageID}>
                                                <ChatMessage
                                                    chatData={messageObj}
                                                    isFromSelf={
                                                        messageObj.username ==
                                                        localStorage.getItem('username')
                                                    }
                                                />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                    <div className={styles.inputbar}>
                        <form className={styles.form} onSubmit={handleSubmit} id='inpform'>
                            <input
                                className={`${styles.messagefield} ${error ? styles.error : ''}`}
                                type='text'
                                id='messagefield'
                                name='messagefield'
                                placeholder={error ? 'Fehler beim senden!' : 'Nachricht eingeben'}
                                autoComplete='off'
                                onChange={(e) => {
                                    setError(false); // Unset error when user is typing
                                    setMessageFieldText(e.target.value);
                                }}
                                required
                            />
                            <input
                                className={styles.submit}
                                disabled={!messageFieldText}
                                type='submit'
                            />
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
