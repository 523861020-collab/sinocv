'use client';

import { useState, useRef, useEffect } from 'react';

const WELCOME =
  "Hi! I'm the AI assistant of XINYUNTONG CHINA 👋\nI'll help match you with the right truck or machine.\n\nTo start — which country are you from?";

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: WELCOME },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const sessionIdRef = useRef(
    'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionIdRef.current, history, message: text }),
      });
      const data = await resp.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || '...' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, network error. Please try again.' },
      ]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat with AI assistant"
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '24px',
          zIndex: 45,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: '#f59e0b',
          color: '#000',
          fontSize: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        }}
      >
        💬
      </button>

      {/* 聊天窗口 */}
      {open && (
        <div
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '92px',
            zIndex: 45,
            width: '360px',
            height: '480px',
            display: 'flex',
            flexDirection: 'column',
            background: '#0d0d0d',
            border: '1px solid #222',
            borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}
        >
          {/* 头部 */}
          <div
            style={{
              padding: '12px 16px',
              background: '#f59e0b',
              color: '#000',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>💬 XINYUNTONG Assistant</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#000',
                fontSize: '18px',
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* 消息区 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    background: m.role === 'user' ? '#f59e0b' : '#1a1a1a',
                    color: m.role === 'user' ? '#000' : '#fff',
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                ● ● ●
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 输入区 */}
          <div style={{ display: 'flex', borderTop: '1px solid #222', padding: '8px' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send();
              }}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #333',
                background: '#000',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              onClick={send}
              disabled={loading}
              style={{
                marginLeft: '8px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: '#f59e0b',
                color: '#000',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
