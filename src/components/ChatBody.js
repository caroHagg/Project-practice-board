import React from 'react';
import { useState, useEffect } from 'react'
import { io } from "socket.io-client";
import Board from './Board'
const server_url = 'http://localhost:4000/'

const socket = io(server_url);


function ChatBody() {
    const styleBoard = {
        border: '2px',
        borderColor: 'black'
    }
    console.log(socket)
    const [roomId, setRoom] = useState('');
    const [userName, setUsername] = useState('');
    const [message, setSendMessage] = useState('');
    const [messageReceived, setMessageReceived] = useState([]);

    const handleJoin = (e) => {
        e.preventDefault();
        if (roomId !== '') {
            socket.emit("join-room", roomId)
        }
    };
    const sendMessage = (e) => {
        e.preventDefault()
        if (message !== '') {
            const messageData = {
                room: roomId,
                sender: userName,
                message: message
            };
            socket.emit("send-message", messageData);
            setMessageReceived((list) => [...list, messageData]);
            setSendMessage('');
        }
    };

    useEffect(() => {
        socket.on('receive-message', (data) => {
            setMessageReceived((list) => [...list, data]);
        });
    }, [socket])

    return (
        <div className='row'>
            <div className='col-lg-6'>
                <div style={styleBoard}>
                    <Board socket={socket} />

                </div>

            </div>

            <div className='col-lg-6'>
                <input
                    type="text"
                    placeholder='userName'
                    name='userName'
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }} />
                <input
                    type="text"
                    placeholder='room name'
                    name='roomId'
                    value={roomId}
                    onChange={(e) => {
                        setRoom(e.target.value)
                    }} />
                <button onClick={handleJoin} >Join</button>
                <input
                    type="text"
                    name='message'
                    value={message}
                    placeholder='message'
                    onChange={(e) => {
                        setSendMessage(e.target.value)
                    }} />
                <button type='submit' onClick={sendMessage}>send</button>
                <h1>Message: </h1>
                {messageReceived.map((item) => {
                    return (
                        <div key={item.sender} id={userName === item.sender ? 'sender' : 'receiver'}>
                            <div>{item.message}</div>
                            <p>--{item.sender}</p>
                        </div>

                    )


                })}

            </div>
        </div>




    );
}




export default ChatBody

