'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "👋 Hello sir! I'm Liam from XINYUNTONG. May I know which country you're from and what type of vehicle you're looking for?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [whatsappCollected, setWhatsappCollected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: text }], visitor: true })
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        if (data.whatsappTagged) setWhatsappCollected(true);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, connection issue. Please WhatsApp us directly: +86 19103781257' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-amber-500 px-5 py-3 font-semibold text-black shadow-lg hover:bg-amber-400 transition-all"
      >
        <span className="text-xl">💬</span>
        <span className="hidden md:inline">Chat with us</span>
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-50 flex h-[500px] w-[380px] max-w-[90vw] flex-col rounded-2xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gray-800 px-4 py-3 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-sm font-bold">L</div>
                <div>
                  <div className="text-white text-sm font-semibold">Liam · XINYUNTONG</div>
                  <div className="text-green-400 text-xs">🟢 Online</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-lg">✕</button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-amber-500 text-black rounded-br-md'
                      : 'bg-gray-800 text-gray-200 rounded-bl-md'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 text-gray-400 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm">
                    <span className="animate-pulse">Typing...</span>
                  </div>
                </div>
              )}
              {whatsappCollected && (
                <div className="text-center pt-2">
                  <a href="https://wa.me/8619103781257" target="_blank"
                    className="inline-block rounded-full bg-green-500 px-5 py-2 text-sm font-semibold text-white hover:bg-green-400 transition-all">
                    💬 Continue on WhatsApp →
                  </a>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2 border-t border-gray-700 p-3">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
              />
              <button type="submit" disabled={loading || !input.trim()}
                className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-50 transition-all">
                ➤
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
