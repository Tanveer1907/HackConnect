import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export function SocketProvider({ children }) {
    const { token, user } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!token || !user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const socketUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        console.log('Connecting to Socket.IO at:', socketUrl);

        // Instantiate singleton socket with JWT in auth handshake
        const newSocket = io(socketUrl, {
            auth: {
                token: token
            },
            transports: ['websocket', 'polling']
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket.IO connection established successfully');
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket.IO connection error:', err.message);
        });

        return () => {
            console.log('Disconnecting socket...');
            newSocket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, user]); // Reconnect if user/token changes (e.g. login/logout)

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}
