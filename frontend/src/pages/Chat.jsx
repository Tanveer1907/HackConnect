import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getChatHistory, getMyChats, getAllUsers } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-hot-toast';

export default function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [currentRoom, setCurrentRoom] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Start new chat modal state
    const [showUserModal, setShowUserModal] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [userSearch, setUserSearch] = useState('');

    const messagesEndRef = useRef(null);
    const { user: currentUser } = useAuth();
    const socket = useSocket();
    const currentRoomRef = useRef(currentRoom);

    useEffect(() => {
        currentRoomRef.current = currentRoom;
    }, [currentRoom]);

    const fetchChats = useCallback(async () => {
        try {
            const res = await getMyChats();
            setChats(res.data);
            if (res.data.length > 0 && !currentRoomRef.current) {
                setCurrentRoom(res.data[0].roomId);
            }
            // Join all active rooms so we receive messages for all of them
            res.data.forEach(chat => {
                if (socket) {
                    socket.emit('join_room', { roomId: chat.roomId });
                }
            });
        } catch (err) {
            console.error('Failed to fetch sidebar chats', err);
        }
    }, [socket]);

    // Periodically re-fetch chats to pick up new conversations and join their rooms
    useEffect(() => {
        const interval = setInterval(() => {
            if (socket?.connected) {
                fetchChats();
            }
        }, 20000); // Check for new conversations every 20 seconds
        return () => clearInterval(interval);
    }, [fetchChats, socket]);

    useEffect(() => {
        if (!socket || !currentUser) return; // Wait until loaded

        // Fetch chats immediately if connected
        fetchChats();

        const handleReceiveMessage = (newMessage) => {
            // Always update messages if the message belongs to the currently open room
            if (newMessage.roomId === currentRoomRef.current) {
                setMessages((prev) => {
                    const exists = prev.some(m => m._id === newMessage._id);
                    if (exists) return prev;
                    return [...prev, newMessage];
                });
                scrollToBottom();
            }
            
            // Update the sidebar in real-time
            setChats(prevChats => {
                const existingChatIndex = prevChats.findIndex(c => c.roomId === newMessage.roomId);
                let newChats = [...prevChats];
                if (existingChatIndex >= 0) {
                    newChats[existingChatIndex] = {
                        ...newChats[existingChatIndex],
                        latestMessage: newMessage
                    };
                } else {
                    // New conversation started — re-fetch to join the new room
                    fetchChats();
                    return prevChats;
                }
                // Sort by newest
                return newChats.sort((a, b) => new Date(b.latestMessage?.createdAt || 0) - new Date(a.latestMessage?.createdAt || 0));
            });
        };

        const handleConnect = () => {
            console.log('Connected to socket server (from Chat)');
            fetchChats();
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('connect', handleConnect);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('connect', handleConnect);
        };
    }, [socket, currentUser, fetchChats]);

    useEffect(() => {
        if (!currentRoom) return;

        // Mark as seen when entering a room
        localStorage.setItem('lastChatVisit', Date.now().toString());

        const fetchHistory = async () => {
            try {
                const res = await getChatHistory(currentRoom);
                setMessages(res.data);
                scrollToBottom();
            } catch (err) {
                console.error('Failed to fetch chat history', err);
            }
        };
        fetchHistory();
    }, [currentRoom]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !currentRoom) return;

        const messageData = {
            roomId: currentRoom,
            senderId: currentUser._id || currentUser.id,
            text: message
        };

        if (socket) {
            socket.emit('send_message', messageData);
        }
        setMessage('');
    };

    const handleStartNewChat = async () => {
        try {
            const res = await getAllUsers();
            // Filter out current user from selection list
            const currentUserId = currentUser._id || currentUser.id;
            const filteredUsers = res.data.filter(u => u._id !== currentUserId && u.id !== currentUserId);
            setUsersList(filteredUsers);
            setShowUserModal(true);
        } catch (err) {
            console.error('Failed to load user list', err);
            toast.error("Failed to load user list");
        }
    };

    const selectUserForChat = (otherUser) => {
        const currentUserId = currentUser._id || currentUser.id;
        const otherUserId = otherUser._id || otherUser.id;
        
        // Construct roomId deterministically
        const ids = [currentUserId, otherUserId].sort();
        const newRoomId = `${ids[0]}-${ids[1]}`;
        
        setCurrentRoom(newRoomId);
        
        // Temporarily insert placeholder in chats sidebar if it doesn't exist
        const exists = chats.some(c => c.roomId === newRoomId);
        if (!exists) {
            setChats(prev => [
                {
                    roomId: newRoomId,
                    otherUser: otherUser,
                    latestMessage: null
                },
                ...prev
            ]);
        }
        
        if (socket) {
            socket.emit('join_room', { roomId: newRoomId });
        }
        
        setShowUserModal(false);
    };

    if (!currentUser) {
        return (
            <div className="flex-1 flex justify-center items-center bg-slate-50 dark:bg-[#0f172a] text-slate-500 min-h-0">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Filter sidebar chats by search query
    const filteredChats = chats.filter(chat => {
        const otherUser = chat.otherUser || {};
        const name = (otherUser.name || otherUser.username || otherUser.email || '').toLowerCase();
        return name.includes(searchQuery.toLowerCase());
    });

    // Filter users list in start new chat modal
    const filteredModalUsers = usersList.filter(user => {
        const name = (user.name || user.username || user.email || '').toLowerCase();
        return name.includes(userSearch.toLowerCase());
    });

    const activeChat = chats.find(c => c.roomId === currentRoom);
    const activeOtherUser = activeChat?.otherUser || {};
    const activeChatName = activeOtherUser.name || activeOtherUser.username || activeOtherUser.email || 'Chat Room';

    return (
        <div className="flex-1 flex overflow-hidden bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-300 font-sans min-h-0">
            
            {/* COLUMN 1: Main Sidebar */}
            <div className="hidden lg:flex flex-col w-[260px] bg-slate-100 dark:bg-[#111827] border-r border-gray-200 dark:border-white/5 pt-6 pb-4 px-4 shrink-0 transition-colors duration-300">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-white/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-white shrink-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                    </div>
                    <div>
                        <h2 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight">ChatSphere</h2>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Premium Messaging</p>
                    </div>
                </div>

                {/* New Chat Button */}
                <button 
                    onClick={handleStartNewChat}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 mb-6 transition-all shadow-[0_4px_15px_rgba(37,99,235,0.3)] cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    Start New Chat
                </button>

                {/* Navigation */}
                <nav className="flex-1 space-y-1">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white rounded-xl font-medium shadow-sm border border-gray-200 dark:border-white/5">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                        All Chats
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 rounded-xl font-medium transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        Unread
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 rounded-xl font-medium transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        Groups
                    </a>
                </nav>

                {/* Bottom Profile info */}
                <div className="mt-auto space-y-2">
                    <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/5 rounded-xl shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 shrink-0">
                            {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {currentUser.name || currentUser.username || 'My Profile'}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Online</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* COLUMN 2: Chat List */}
            <div className="flex flex-col w-[320px] bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-white/5 shrink-0 transition-colors duration-300">
                {/* Search */}
                <div className="p-4 border-b border-gray-200 dark:border-white/5">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        </div>
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-800/50 border border-transparent dark:border-white/5 text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                            placeholder="Search chats..."
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
                    {filteredChats.length === 0 && (
                        <div className="p-4 text-center text-sm text-slate-500">No matching conversations.</div>
                    )}
                    {filteredChats.map(chat => {
                        const otherUser = chat.otherUser || {};
                        const name = otherUser.name || otherUser.username || otherUser.email || 'Anonymous';
                        const initial = name ? name.charAt(0) : '?';
                        const time = chat.latestMessage?.createdAt 
                            ? new Date(chat.latestMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                            : '';
                        const isActive = currentRoom === chat.roomId;

                        return (
                            <div key={chat.roomId} 
                                 onClick={() => setCurrentRoom(chat.roomId)}
                                 className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors group ${isActive ? 'bg-slate-100 dark:bg-white/5' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-lg font-bold text-blue-600 dark:text-blue-400 border-2 border-transparent group-hover:border-white dark:group-hover:border-[#1e293b] shadow-sm">
                                        {initial}
                                    </div>
                                    {isActive && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-100 dark:border-[#1e293b] rounded-full"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className={`text-sm font-bold truncate transition-colors ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                                            {name}
                                        </h3>
                                        <span className="text-xs text-slate-400 dark:text-slate-500">{time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{chat.latestMessage?.text || 'No messages yet'}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* COLUMN 3: Main Chat Window */}
            <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0f172a] relative transition-colors duration-300">
                {currentRoom ? (
                    <>
                        {/* Header */}
                        <div className="h-[76px] px-6 border-b border-gray-200 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md z-10 sticky top-0">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-base font-bold text-blue-600 dark:text-blue-400">
                                        {activeChatName.charAt(0)}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#0f172a] rounded-full"></div>
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900 dark:text-white text-base">
                                        {activeChatName}
                                    </h2>
                                    <p className="text-[12px] text-blue-600 dark:text-blue-400 font-medium">Online</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {messages.length === 0 ? (
                                <div className="text-center py-20 text-slate-400 dark:text-slate-500">
                                    No messages in this chat. Type a message below to start the conversation!
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-center my-6">
                                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">Today</span>
                                    </div>
                                    {messages.map((msg, index) => {
                                        const senderId = msg.sender?._id || msg.sender;
                                        const currentUserId = currentUser._id || currentUser.id;
                                        const isMe = senderId === currentUserId;
                                        
                                        return isMe ? (
                                            <div key={msg._id || index} className="flex justify-end max-w-[80%] ml-auto">
                                                <div className="flex flex-col items-end">
                                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-[20px] rounded-br-sm p-4 text-[14px] shadow-[0_4px_15px_rgba(59,130,246,0.2)] leading-relaxed break-words">
                                                        {msg.text}
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 mr-1 font-medium">
                                                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div key={msg._id || index} className="flex items-end gap-3 max-w-[80%]">
                                                <div className="w-8 h-8 rounded-full mb-1 bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-200 uppercase shrink-0">
                                                    {msg.sender?.name?.charAt(0) || msg.sender?.username?.charAt(0) || '?'}
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <div className="bg-white dark:bg-slate-800/80 border border-gray-200 dark:border-white/5 rounded-[20px] rounded-bl-sm p-4 text-[14px] text-slate-700 dark:text-slate-200 shadow-sm leading-relaxed break-words">
                                                        {msg.text}
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 ml-1 font-medium">
                                                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-t border-gray-200 dark:border-white/5 sticky bottom-0 z-10">
                            <div className="flex items-center gap-3">
                                <form onSubmit={sendMessage} className="flex-1 relative flex gap-3">
                                    <div className="flex-1 relative">
                                        <input 
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="w-full bg-slate-100 dark:bg-[#1e293b]/80 border border-transparent dark:border-white/5 rounded-full pl-5 pr-12 py-3 text-[14px] text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner"
                                        />
                                    </div>

                                    <button type="submit" className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:-translate-y-0.5 transition-all">
                                        <svg className="w-5 h-5 transform -rotate-45 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-slate-400 dark:text-slate-500 p-6 text-center">
                        <span className="text-6xl mb-4">💬</span>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Welcome to ChatSphere</h2>
                        <p className="max-w-md text-sm">Select an active conversation from the sidebar or click "Start New Chat" to find developers in your system.</p>
                    </div>
                )}
            </div>

            {/* COLUMN 4: Right Detail Sidebar */}
            {currentRoom && activeOtherUser.name && (
                <div className="hidden xl:flex flex-col w-[300px] bg-white dark:bg-[#1e293b] border-l border-gray-200 dark:border-white/5 py-8 px-6 shrink-0 transition-colors duration-300">
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-4">
                            <div className="w-24 h-24 rounded-[1.5rem] bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-4xl font-bold text-blue-600 dark:text-blue-400 border-4 border-slate-50 dark:border-[#0f172a] shadow-lg">
                                {activeChatName.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-slate-50 dark:border-[#0f172a] rounded-full"></div>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center">{activeChatName}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center truncate w-full">{activeOtherUser.email}</p>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Common Projects</h3>
                        <div className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 p-3 rounded-xl border border-gray-200 dark:border-white/5 cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
                            <div className="w-10 h-10 bg-[#0f172a] rounded-lg flex items-center justify-center text-purple-400 shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-0.5">Hackathon Collaboration</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Active Room</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* START NEW CHAT MODAL */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-gray-150 dark:bg-slate-900 dark:border-white/10 animate-scaleUp">
                        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <div>
                                <h2 className="font-extrabold text-slate-900 text-lg leading-none mb-1 dark:text-white">Start a Conversation</h2>
                                <p className="text-xs text-slate-500 font-semibold dark:text-slate-400">Search and message users registered on HackConnect</p>
                            </div>
                            <button 
                                onClick={() => setShowUserModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-350 text-slate-500 font-bold flex items-center justify-center transition-colors dark:bg-white/10 dark:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Modal Search Bar */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                </div>
                                <input 
                                    type="text" 
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-slate-800/50 border border-transparent dark:border-white/5 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                                    placeholder="Search by name, skill, or email..."
                                />
                            </div>

                            {/* User List scroll container */}
                            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                                {filteredModalUsers.length === 0 ? (
                                    <div className="text-center py-10 text-xs text-slate-500">No other users found.</div>
                                ) : (
                                    filteredModalUsers.map(user => {
                                        const name = user.name || user.username || user.email || 'Anonymous';
                                        const initial = name.charAt(0);
                                        return (
                                            <div 
                                                key={user._id || user.id} 
                                                onClick={() => selectUserForChat(user)}
                                                className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 shrink-0">
                                                    {initial}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{name}</p>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                                </div>
                                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline">Message</span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
