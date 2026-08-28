import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Product } from '../types';
import { Bot, Send, Sparkles, AlertCircle, RefreshCw, Trash2, HelpCircle } from 'lucide-react';

interface WiseBotPanelProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

export default function WiseBotPanel({ products, onProductSelect }: WiseBotPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I am **WiseBot**, your dedicated AI Shopping Assistant. Ask me anything about specifications, comparison metrics, or choose one of the quick suggestions below!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        "Explain the difference between Apple M3 vs Intel Core i5 simply",
        "Which smartphone has the best battery under ₹40,000?",
        "Explain what an LTPO screen does like I'm five years old",
        "Help me compare Apple iPhone 15 Pro vs Samsung Galaxy S24 Ultra"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-10) // Send last 10 messages for context
        })
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      // Fallback offline reply if server drops
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "My apologies! I encountered a transient communication issue. Please ensure your Express developer server is active on Port 3000.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: "Hello! I am **WiseBot**, your dedicated AI Shopping Assistant. Ask me anything about specifications, comparison metrics, or choose one of the quick suggestions below!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: [
          "Explain the difference between Apple M3 vs Intel Core i5 simply",
          "Which smartphone has the best battery under ₹40,000?",
          "Explain what an LTPO screen does like I'm five years old",
          "Help me compare Apple iPhone 15 Pro vs Samsung Galaxy S24 Ultra"
        ]
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" id="wisebot-chat-container">
      {/* Container Frame */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[650px] transition-colors duration-200">
        {/* Chat Header */}
        <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-800 rounded-xl flex items-center justify-center text-[#6A73E4] dark:text-cyan-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#111827] dark:text-white text-sm flex items-center gap-1.5">
                <span>WiseBot Assistant</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#37D0C0]"></span>
              </h3>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Buying Intelligence Guide</p>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Scrollable Chat Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/40 dark:bg-slate-900/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar circle */}
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                msg.sender === 'user' ? 'bg-[#111827] dark:bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200'
              }`}>
                {msg.sender === 'user' ? 'U' : 'B'}
              </div>

              {/* Message bubble */}
              <div className="space-y-3">
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#111827] dark:bg-indigo-600 text-white border-black dark:border-indigo-500 rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-100 dark:border-slate-700 rounded-tl-none'
                }`}>
                  {/* Parse basic bold syntax in message */}
                  <p className="whitespace-pre-line">
                    {msg.text.split('**').map((part, index) => 
                      index % 2 === 1 ? <strong key={index} className="font-black">{part}</strong> : part
                    )}
                  </p>
                </div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block px-1">{msg.timestamp}</span>

                {/* Suggested Prompts chips */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(p)}
                        className="text-[11px] text-[#111827] dark:text-slate-200 hover:text-white dark:hover:text-slate-900 bg-white dark:bg-slate-800 hover:bg-[#111827] dark:hover:bg-white border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-bold transition-all hover:border-black dark:hover:border-white shadow-sm text-left cursor-pointer"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200">
                B
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Action Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask WiseBot to compare items, decode jargon, or recommend models..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-grow bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-400 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-[#111827] dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-500 text-white p-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
          
          <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-slate-400 font-medium">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>WiseBot compiles realtime answers from neutral parameters.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
