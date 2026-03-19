"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: number;
  username: string;
  avatar_url: string;
  content: string;
  rank_title: string;
  created_at: string;
  user_id: number; 
}



export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [newPost, setNewPost] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem('arcade_user');
        if (saved) setUser(JSON.parse(saved));
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
        } catch (e) {
        console.error("POSTS_FETCH_FAILURE");
        } finally {
        setLoading(false);
        }
    };

    const handleDelete = async (postId: number) => {
        if (!user) return;
        
        if (!confirm("Are you sure?")) return;

        const res = await fetch('/api/posts', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
            postId: postId, 
            userId: user.id 
            }),
        });

        if (res.ok) {
            setPosts(posts.filter(p => p.id !== postId));
        } else {
            alert("ACCESS_DENIED: UNAUTHORIZED_DELETION");
        }
        };

    const sendTransmission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.trim() || !user) return;

        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
            userId: user.id, 
            content: newPost 
            }),
        });

        if (res.ok) {
            setNewPost(""); 
            fetchPosts();   
        }
        };

    return (
        <main className="min-h-screen bg-[#1a1b26] text-[#c0caf5] p-8 font-mono">
        <div className="max-w-3xl mx-auto space-y-8">
            <Navbar />

            <div className="flex justify-between items-end border-b border-[#24283b] pb-4">
            <h1 className="text-2xl font-black text-[#7aa2f7] uppercase italic tracking-tighter">
                Community Posts
            </h1>
            <span className="text-[10px] text-[#565f89] mb-1">
                Don't be rude
            </span>
            </div>

            {user ? (
    <section className="bg-[#1f2335] border border-[#7aa2f7] p-6 rounded-lg shadow-[0_0_20px_rgba(122,162,247,0.05)] mb-10">
        <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#7aa2f7] text-[10px] font-bold uppercase tracking-[0.3em]">
            Initiate_Broadcast // User: {user.username}
        </h2>
        <span className="text-[9px] text-[#565f89] animate-pulse">UPLINK_READY</span>
        </div>

        <form onSubmit={sendTransmission} className="space-y-4">
        <textarea 
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Type your thoughts here... (Max 100 chars)"
            className="w-full bg-[#16161e] border border-[#414868] p-4 rounded text-sm text-[#c0caf5] focus:outline-none focus:ring-1 focus:ring-[#bb9af7] transition-all resize-none h-28 font-sans"
            maxLength={100}
        />
        
        <div className="flex justify-between items-center">
            <span className={`text-[10px] font-mono ${newPost.length > 450 ? 'text-[#f7768e]' : 'text-[#565f89]'}`}>
            CHARS: {newPost.length}/100
            </span>
            <button 
            type="submit"
            disabled={!newPost.trim()}
            className="bg-[#7aa2f7] text-[#1a1b26] px-8 py-2 rounded text-[10px] font-black uppercase hover:bg-[#b4f9f8] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
            Send_Transmission
                </button>
        </div>
        </form>
            </section>
            ) : (
            <div className="bg-[#16161e] border border-dashed border-[#414868] p-6 text-center rounded-lg mb-10">
                <Link href="/register" className="text-[#7aa2f7] text-xs hover:underline uppercase">
                Connect_Player_To_Access_Global_Comms
                </Link>
            </div>
            )}

            <div className="space-y-6">
            {loading ? (
                <div className="text-[#565f89] animate-pulse uppercase text-xs">Syncing...</div>
            ) : posts.length > 0 ? (
                posts.map((post) => (
                <div key={post.id} className="group bg-[#1f2335] border border-[#24283b] p-5 rounded-lg hover:border-[#414868] transition-all relative">
                    <div className="flex items-center gap-4 mb-4">
                    <img 
                        src={`/sprites/${post.avatar_url || 'tux.png'}`} 
                        className="w-10 h-10 rounded border border-[#414868] bg-[#16161e]" 
                        alt="pilot" 
                    />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                        <span className="text-[#9ece6a] text-sm font-bold uppercase">{post.username}</span>
                        <span className="text-[#bb9af7] text-[10px] bg-[#bb9af7]/10 px-2 py-0.5 rounded border border-[#bb9af7]/20 uppercase">
                            {post.rank_title}
                        </span>
                        </div>
                        <span className="text-[#565f89] text-[10px] mt-1 italic">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </span>
                    </div>
                    </div>

                    <p className="text-[#c0caf5] text-sm leading-relaxed font-sans pl-2 border-l-2 border-[#414868]">
                    {post.content}
                    </p>

                    <CommentSection postId={post.id} currentUser={user} />

                    {(user?.is_admin || user?.id === post.user_id) && (
                    <button 
                        onClick={() => handleDelete(post.id)}
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-[#f7768e] text-[9px] font-bold uppercase transition-opacity hover:underline"
                    >
                        [Delete_Log]
                    </button>
                    )}
                </div>
                ))
            ) : (
                <div className="bg-[#16161e] border border-dashed border-[#414868] p-12 text-center rounded-lg">
                <p className="text-[#565f89] text-xs uppercase tracking-[0.2em]">Silence in this sector. Be the first to broadcast.</p>
                </div>
            )}
            </div>
        </div>
        </main>
    );
}

function CommentSection({ postId, currentUser }: { postId: number, currentUser: any }) {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then(res => res.json())
      .then(data => setComments(data));
  }, [postId]);

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ postId, userId: currentUser.id, content: text }),
    });

    if (res.ok) {
      const newC = await res.json();
      setComments([...comments, { ...newC, username: currentUser.username, avatar_url: currentUser.avatar_url }]);
      setText("");
    }
  };

  return (
    <div className="mt-4 ml-6 border-l-2 border-[#24283b] pl-4 space-y-3">
      {comments.map(c => (
        <div key={c.id} className="text-[11px] bg-[#16161e]/50 p-2 rounded">
          <span className="text-[#7aa2f7] font-bold uppercase mr-2">{c.username}:</span>
          <span className="text-[#c0caf5]">{c.content}</span>
        </div>
      ))}
      
      {currentUser && (
        <form onSubmit={postComment} className="flex gap-2 mt-2">
          <input 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a reply..."
            className="flex-1 bg-transparent border-b border-[#414868] text-[10px] focus:outline-none focus:border-[#bb9af7] py-1"
          />
          <button type="submit" className="text-[#9ece6a] text-[10px] font-bold uppercase">[SUBMIT]</button>
        </form>
      )}
    </div>
  );
}