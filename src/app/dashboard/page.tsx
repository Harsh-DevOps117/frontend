'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './dashboard.css';
import ArtifactViewer from '../../components/ArtifactViewer';

interface Message {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  artifacts?: string | null;
  sources?: string[] | null;
}

interface Artifact {
  type: 'html' | 'markdown';
  content: string;
}

interface ChatSession {
  id: number;
  title: string;
  created_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionList, setSessionList] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    const fetchInitialData = async () => {
      try {
        const response = await fetch('https://oogway-78sy.onrender.com/api/v1/chat/sessions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success && data.sessions.length > 0) {
          setSessionList(data.sessions);
          setSessionId(data.sessions[0].id);
          fetchMessages(data.sessions[0].id, token);
        } else {
          createNewSession(token);
        }
      } catch (err) {
        console.error("Failed to fetch sessions", err);
      }
    };
    
    fetchInitialData();
  }, [router]);

  const fetchMessages = async (id: number, token: string) => {
    try {
      const msgResponse = await fetch(`https://oogway-78sy.onrender.com/api/v1/chat/sessions/${id}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const msgData = await msgResponse.json();
      if (msgData.success && msgData.messages.length > 0) {
         setMessages(msgData.messages);
      } else {
         setMessages([{ role: 'assistant', content: "Hello! I am The Lenny Growth Assistant. How can I help you extract insights from Lenny's Podcast today or write a Ship 30 essay?" }]);
      }
      setActiveArtifact(null);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const createNewSession = async (tokenOverride?: string) => {
    const token = tokenOverride || localStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await fetch('https://oogway-78sy.onrender.com/api/v1/chat/sessions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSessionId(data.session.id);
        setSessionList(prev => [data.session, ...prev]);
        setMessages([{ role: 'assistant', content: "Hello! I am The Lenny Growth Assistant. How can I help you extract insights from Lenny's Podcast today or write a Ship 30 essay?" }]);
        setActiveArtifact(null);
      }
    } catch (err) {
      console.error("Failed to create session", err);
    }
  };

  const handleSelectSession = (id: number) => {
    if (id === sessionId) return;
    const token = localStorage.getItem('access_token');
    if (token) {
      setSessionId(id);
      fetchMessages(id, token);
    }
    setIsSidebarOpen(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || loading) return;
    
    const currentInput = input;
    const token = localStorage.getItem('access_token');
    
    setMessages(prev => [...prev, { role: 'user', content: currentInput }]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await fetch(`https://oogway-78sy.onrender.com/api/v1/chat/sessions/${sessionId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: currentInput })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const aiMsg = data.data;
        setMessages(prev => [...prev, aiMsg]);
        
        if (aiMsg.session_title) {
          setSessionList(prev => prev.map(s => 
            s.id === sessionId ? { ...s, title: aiMsg.session_title } : s
          ));
        }
        
        if (aiMsg.artifacts) {
          setActiveArtifact({
            type: 'html',
            content: aiMsg.artifacts
          });
        }
      } else {
        throw new Error("Failed to get response");
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the backend.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-split-container">
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <aside className={`chat-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="btn btn-primary new-chat-btn" onClick={() => { createNewSession(); setIsSidebarOpen(false); }}>
            + New Chat
          </button>
        </div>
        <div className="session-list">
          {sessionList.map((session) => (
            <div 
              key={session.id} 
              className={`session-item ${session.id === sessionId ? 'active' : ''}`}
              onClick={() => handleSelectSession(session.id)}
            >
              {session.title && session.title !== "New Chat" ? session.title : `Chat #${session.id}`}
            </div>
          ))}
        </div>
      </aside>

      <div className={`chat-panel ${activeArtifact ? 'with-artifact' : ''}`}>
        <div className="chat-header">
          <button className="btn btn-outline mobile-sidebar-toggle" onClick={() => setIsSidebarOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <button className="btn btn-outline print-btn" onClick={() => window.print()}>
            Print Chat
          </button>
        </div>
        <div className="messages-container">
          {messages.map((m, i) => (
            <div key={i} className={`message-wrapper ${m.role}`}>
              <div className="message-bubble">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.content}
                </ReactMarkdown>
                {m.sources && m.sources.length > 0 && (
                  <div className="sources-container mt-2 text-xs opacity-75">
                    <strong>Sources:</strong>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {m.sources.map((s, idx) => (
                        <span key={idx} className="source-badge px-2 py-1 bg-gray-200 text-gray-800 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="chat-input-wrapper">
          <form className="chat-input-container" onSubmit={handleSend}>
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Ask about product growth or request an essay..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary chat-submit">Send</button>
          </form>
        </div>
      </div>
      
      {activeArtifact && (
        <div className="artifact-panel">
          <ArtifactViewer artifact={activeArtifact} onClose={() => setActiveArtifact(null)} />
        </div>
      )}
    </div>
  );
}
