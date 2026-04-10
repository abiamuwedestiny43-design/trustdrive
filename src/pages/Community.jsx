import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { MessageSquare, ThumbsUp, Share2, User, Send, Bell } from 'lucide-react';
import Layout from '../components/Layout';

const Community = () => {
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: "Tunde Ola",
            role: "Driver",
            time: "2h ago",
            content: "Lagos traffic is light today around Ikeja! Good time to catch some rides. 🚗💨",
            likes: 24,
            comments: 5
        },
        {
            id: 2,
            author: "Sarah J.",
            role: "Rider",
            time: "4h ago",
            content: "Just had the best ride experience in Abuja. Professional driver and very clean car. Thanks TrustDrive! ✨",
            likes: 42,
            comments: 8
        },
        {
            id: 3,
            author: "Chioma Uzor",
            role: "Driver",
            time: "1d ago",
            content: "Anyone around Lekki? Looking for a car wash recommendation that opens late. 🧼",
            likes: 12,
            comments: 15
        }
    ]);

    const [newPost, setNewPost] = useState('');

    const handlePostSubmit = (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;
        
        const post = {
            id: Date.now(),
            author: "You",
            role: "Member",
            time: "Just now",
            content: newPost,
            likes: 0,
            comments: 0
        };
        
        setPosts([post, ...posts]);
        setNewPost('');
    };

    return (
        <Layout>
            <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem', maxWidth: '800px' }}>
                <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', marginBottom: '0.5rem' }}>
                        TrustDrive <span style={{ color: 'var(--primary)' }}>Community</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Connect with fellow riders and drivers across Nigeria.
                    </p>
                </header>

                {/* Create Post */}
                <Card glass style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <form onSubmit={handlePostSubmit}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <User size={24} />
                            </div>
                            <textarea
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="What's happening in your city?"
                                style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    color: 'white',
                                    fontSize: '1rem',
                                    resize: 'none',
                                    minHeight: '80px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="submit" variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem' }}>
                                <Send size={18} /> Post
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* Feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {posts.map(post => (
                        <Card key={post.id} glass style={{ padding: '1.5rem', animation: 'scaleIn 0.3s ease-out' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: post.role === 'Driver' ? 'rgba(30, 203, 115, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: post.role === 'Driver' ? 'var(--primary)' : '#38bdf8'
                                    }}>
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: 'white' }}>{post.author}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            {post.role} • {post.time}
                                        </div>
                                    </div>
                                </div>
                                <Button variant="secondary" style={{ padding: '0.25rem' }}>
                                    <Bell size={18} />
                                </Button>
                            </div>

                            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                {post.content}
                            </p>

                            <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <ThumbsUp size={18} /> {post.likes}
                                </button>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <MessageSquare size={18} /> {post.comments}
                                </button>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Share2 size={18} /> Share
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Community;
