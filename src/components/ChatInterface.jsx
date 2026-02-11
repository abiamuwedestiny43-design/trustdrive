import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { MessageSquare, Send, X } from 'lucide-react';
import Button from './common/Button';

const ChatInterface = ({ bookingId, currentUser, onClose, isDriver }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!bookingId) return;

        const q = query(
            collection(db, `bookings/${bookingId}/messages`),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);
            scrollToBottom();
        });

        return () => unsubscribe();
    }, [bookingId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await addDoc(collection(db, `bookings/${bookingId}/messages`), {
                text: newMessage,
                senderId: currentUser.uid || 'driver', // Fallback for driver if no auth object passed perfectly
                senderName: currentUser.name || (isDriver ? 'Driver' : 'Passenger'),
                isDriver: !!isDriver,
                createdAt: serverTimestamp()
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, top: 0,
            background: '#0f172a',
            zIndex: 50,
            display: 'flex', flexDirection: 'column',
            animation: 'slideUp 0.3s ease-out'
        }}>
            {/* Header */}
            <div style={{
                padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.95)'
            }}>
                <div style={{ fontWeight: 'bold', color: 'white', display: 'flex', items: 'center', gap: '0.5rem' }}>
                    <MessageSquare size={18} color="#38bdf8" /> Chat with {isDriver ? 'Passenger' : 'Driver'}
                </div>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem', fontSize: '0.9rem' }}>
                        Start the conversation...
                    </div>
                )}
                {messages.map((msg) => {
                    const isMe = msg.isDriver === isDriver;
                    return (
                        <div key={msg.id} style={{
                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                            maxWidth: '75%',
                            background: isMe ? '#38bdf8' : 'rgba(255,255,255,0.1)',
                            color: isMe ? '#0f172a' : 'white',
                            padding: '0.6rem 1rem',
                            borderRadius: '12px',
                            borderBottomRightRadius: isMe ? '2px' : '12px',
                            borderBottomLeftRadius: !isMe ? '2px' : '12px',
                            fontSize: '0.95rem'
                        }}>
                            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '2px', fontWeight: 'bold' }}>
                                {msg.senderName}
                            </div>
                            {msg.text}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} style={{
                padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.95)'
            }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{
                        flex: 1, padding: '0.75rem', borderRadius: '99px',
                        background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', outline: 'none'
                    }}
                />
                <Button type="submit" variant="primary" style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Send size={18} />
                </Button>
            </form>
        </div>
    );
};

export default ChatInterface;
