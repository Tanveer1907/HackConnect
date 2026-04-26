import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { getChatHistory, getMyChats, getUserProfile } from '../services/api';

export default function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [currentRoom, setCurrentRoom] = useState('');
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserProfile();
                setCurrentUser(res.data);
            } catch (err) {
                console.error('Failed to load user profile', err);
            }
        };
        fetchUser();
    }, []);

    const currentRoomRef = useRef(currentRoom);

    useEffect(() => {
        currentRoomRef.current = currentRoom;
    }, [currentRoom]);

    const fetchChats = async () => {
        try {
            const res = await getMyChats();
            setChats(res.data);
            if (res.data.length > 0 && !currentRoomRef.current) {
                setCurrentRoom(res.data[0].roomId);
            }
            // Join all active rooms so we receive messages for all of them
            res.data.forEach(chat => {
                if (socketRef.current) {
                    socketRef.current.emit('join_room', { roomId: chat.roomId });
                }
            });
        } catch (err) {
            console.error('Failed to fetch sidebar chats', err);
        }
    };

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');

        socketRef.current.on('connect', () => {
            console.log('Connected to socket server');
            fetchChats();
        });

        socketRef.current.on('receive_message', (newMessage) => {
            // Update messages panel if the message belongs to the currently open room
            if (newMessage.roomId === currentRoomRef.current) {
                setMessages((prev) => [...prev, newMessage]);
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
                    // New conversation started
                    fetchChats();
                    return prevChats;
                }
                // Sort by newest
                return newChats.sort((a, b) => new Date(b.latestMessage?.createdAt || 0) - new Date(a.latestMessage?.createdAt || 0));
            });
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!currentRoom) return;

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
            senderId: currentUser._id,
            text: message
        };

        socketRef.current.emit('send_message', messageData);
        setMessage('');
    };

    if (!currentUser) {
        return (
            <div className="flex-1 flex justify-center items-center bg-slate-50 dark:bg-[#0f172a] text-slate-500 min-h-0">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

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
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 mb-6 transition-all shadow-[0_4px_15px_rgba(37,99,235,0.3)]">
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
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 rounded-xl font-medium transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
                        Archived
                    </a>
                </nav>

                {/* Bottom Settings & Profile */}
                <div className="mt-auto space-y-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 rounded-xl font-medium transition-colors mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        Settings
                    </a>
                    <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/5 rounded-xl shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 shrink-0">
                            {currentUser.name ? currentUser.name.charAt(0) : (currentUser.username ? currentUser.username.charAt(0) : 'M')}
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
            <div className="hidden md:flex flex-col w-[320px] bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-white/5 shrink-0 transition-colors duration-300">
                {/* Search */}
                <div className="p-4 border-b border-gray-200 dark:border-white/5">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        </div>
                        <input 
                            type="text" 
                            className="w-full bg-slate-100 dark:bg-slate-800/50 border border-transparent dark:border-white/5 text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                            placeholder="Search HackConnect..."
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
                    {chats.length === 0 && (
                        <div className="p-4 text-center text-sm text-slate-500">No active chats. Wait for an invite!</div>
                    )}
                    {chats.map(chat => {
                        const otherUser = chat.otherUser || {};
                        const name = otherUser.profile ? `${otherUser.profile.firstName} ${otherUser.profile.lastName}` : otherUser.username;
                        const initial = name ? name.charAt(0) : '?';
                        const time = new Date(chat.latestMessage?.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
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
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{chat.latestMessage?.text}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* COLUMN 3: Main Chat Window */}
            <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0f172a] relative transition-colors duration-300">
                {/* Header */}
                <div className="h-[76px] px-6 border-b border-gray-200 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-base font-bold text-blue-600 dark:text-blue-400">
                                {chats.find(c => c.roomId === currentRoom)?.otherUser?.profile?.firstName?.charAt(0) || '?'}
                            </div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#0f172a] rounded-full"></div>
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 dark:text-white text-base">
                                {(() => {
                                    const u = chats.find(c => c.roomId === currentRoom)?.otherUser;
                                    return u ? (u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : u.username) : 'Select a Chat';
                                })()}
                            </h2>
                            <p className="text-[12px] text-blue-600 dark:text-blue-400 font-medium">Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg></button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg></button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="flex justify-center my-6">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">Today</span>
                    </div>

                    {messages.map((msg, index) => {
                        const isMe = msg.sender?._id === currentUser._id || msg.sender === currentUser._id;
                        
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
                                    {msg.sender?.profile?.firstName?.charAt(0) || msg.sender?.username?.charAt(0) || '?'}
                                </div>
                                <div className="bg-white dark:bg-slate-800/80 border border-gray-200 dark:border-white/5 rounded-[20px] rounded-bl-sm p-4 text-[14px] text-slate-700 dark:text-slate-200 shadow-sm leading-relaxed break-words">
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-t border-gray-200 dark:border-white/5 sticky bottom-0 z-10">
                    <div className="flex items-center gap-3">
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2">
                            <svg className="w-5 h-5 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                        </button>
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        </button>
                        
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
            </div>

            {/* COLUMN 4: Right Detail Sidebar */}
            <div className="hidden xl:flex flex-col w-[300px] bg-white dark:bg-[#1e293b] border-l border-gray-200 dark:border-white/5 py-8 px-6 shrink-0 transition-colors duration-300">
                {currentRoom && chats.find(c => c.roomId === currentRoom)?.otherUser ? (() => {
                    const other = chats.find(c => c.roomId === currentRoom).otherUser;
                    const name = other.name || other.username || 'User';
                    return (
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative mb-4">
                                <div className="w-24 h-24 rounded-[1.5rem] bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-4xl font-bold text-blue-600 dark:text-blue-400 border-4 border-slate-50 dark:border-[#0f172a] shadow-lg">
                                    {name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-slate-50 dark:border-[#0f172a] rounded-full"></div>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{name}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">@{other.username || 'user'}</p>
                        </div>
                    );
                })() : (
                    <div className="flex flex-col items-center mb-8 text-center text-slate-500">
                        <p>Select a chat to view details</p>
                    </div>
                )}

                <div className="mb-8">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Media & Links</h3>
                    <div className="flex gap-3">
                        <div className="w-16 h-20 bg-slate-200 dark:bg-slate-700/50 rounded-xl flex flex-col justify-end p-2 border border-transparent dark:border-white/5 cursor-pointer hover:border-slate-300 dark:hover:border-white/20 transition-all relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                             {/* Mock graph image */}
                             <div className="absolute inset-0 opacity-40 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1)_76%,transparent_77%,transparent)] bg-[length:20px_20px] dark:opacity-20"></div>
                             <div className="relative z-20 flex justify-between items-end gap-0.5 h-6">
                                <div className="w-1.5 bg-blue-400 rounded-t-sm h-[40%]"></div>
                                <div className="w-1.5 bg-blue-500 rounded-t-sm h-[70%]"></div>
                                <div className="w-1.5 bg-yellow-400 rounded-t-sm h-[90%]"></div>
                                <div className="w-1.5 bg-blue-300 rounded-t-sm h-[50%]"></div>
                             </div>
                        </div>
                        <div className="w-16 h-20 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center border border-gray-200 dark:border-white/5 cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-slate-500 dark:text-slate-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                        </div>
                    </div>
                </div>

                <div className="mb-auto">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Common Projects</h3>
                    <div className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 p-3 rounded-xl border border-gray-200 dark:border-white/5 cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
                        <div className="w-10 h-10 bg-[#0f172a] rounded-lg flex items-center justify-center text-purple-400 shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-0.5">FinTrack Core</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Shared Project</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mt-8">
                    <button className="w-full py-3 px-4 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                        Block User
                    </button>
                    <button className="w-full py-3 px-4 border border-gray-300 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        Report Issue
                    </button>
                </div>
            </div>
        </div>
    );
}
