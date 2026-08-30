import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChatMessage, Product } from '../types';
import { 
  Bot, Send, Sparkles, AlertCircle, RefreshCw, Trash2, HelpCircle, 
  Mic, MicOff, Volume2, VolumeX, Copy, Check, Scale, Bookmark, 
  ArrowRight, Sliders, Zap, Award, ThumbsUp, Pin, Download, Search,
  Cpu, Battery, Monitor, ShieldCheck, ChevronRight
} from 'lucide-react';
import { SafeProductImage } from './SafeProductImage';
import { WiseBookmarkIcon } from './WiseBookmarkIcon';

interface WiseBotPanelProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onAddToCompare?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  favorites?: Product[];
}

interface ExtendedChatMessage extends ChatMessage {
  pinned?: boolean;
  mentionedProducts?: Product[];
  actionType?: 'comparison' | 'budget' | 'jargon' | 'specs';
}

export default function WiseBotPanel({
  products,
  onProductSelect,
  onAddToCompare,
  onToggleFavorite,
  favorites = []
}: WiseBotPanelProps) {
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    {
      id: 'welcome-init',
      sender: 'bot',
      text: "👋 Welcome to **WiseBot AI** — your dedicated tech analyst and hardware intelligence companion.\n\nI can analyze raw specifications, calculate price-to-performance ratios in **Indian Rupees (₹)**, benchmark cooling systems, decode tech jargon, and recommend the exact best model for your budget.\n\nSelect a preset mode below or ask me any hardware question!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        "⚖️ Compare Apple MacBook Air M3 vs Lenovo ThinkPad E14",
        "📱 Best flagship smartphone under ₹75,000 for battery life",
        "🎧 Sony WH-1000XM5 vs Bose QuietComfort Ultra ANC comparison",
        "💡 Explain LTPO AMOLED vs standard OLED display simply",
        "🔋 Which phone gives 10+ hours Screen-on-Time (SOT)?"
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'advisor' | 'compare' | 'budget' | 'jargon' | 'thermal'>('advisor');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [activeAudioMsgId, setActiveAudioMsgId] = useState<string | null>(null);
  const [budgetSliderVal, setBudgetSliderVal] = useState<number>(60000);
  const [searchFilter, setSearchFilter] = useState<string>('');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Find products mentioned in text
  const extractMentionedProducts = (text: string): Product[] => {
    const textLower = text.toLowerCase();
    return products.filter((p) => {
      const nameMatch = textLower.includes(p.name.toLowerCase());
      const brandModelMatch = textLower.includes(p.brand.toLowerCase()) && p.name.toLowerCase().split(' ').some(part => part.length > 3 && textLower.includes(part));
      return nameMatch || brandModelMatch;
    }).slice(0, 3);
  };

  // Comprehensive Local Tech Intelligence Fallback Engine
  const generateIntelligentLocalResponse = (query: string): { text: string; productsFound: Product[] } => {
    const q = query.toLowerCase();
    let text = '';
    let productsFound: Product[] = [];

    // Comparison Query
    if (q.includes('vs') || q.includes('compare') || q.includes('difference between')) {
      const matching = products.filter(p => q.includes(p.name.toLowerCase()) || q.includes(p.brand.toLowerCase()));
      productsFound = matching.slice(0, 3);

      if (productsFound.length >= 2) {
        const p1 = productsFound[0];
        const p2 = productsFound[1];
        text = `### ⚖️ Side-by-Side Comparison: **${p1.name}** vs **${p2.name}**\n\n` +
          `• **Pricing & Value**: ${p1.name} (₹${p1.price.toLocaleString('en-IN')}) vs ${p2.name} (₹${p2.price.toLocaleString('en-IN')}). Delta is ₹${Math.abs(p1.price - p2.price).toLocaleString('en-IN')}.\n` +
          `• **WiseScore**: **${p1.name}** scores **${p1.aiScore}/100** | **${p2.name}** scores **${p2.aiScore}/100**.\n` +
          `• **Key Advantage of ${p1.name}**: ${p1.pros?.[0] || 'Optimized power efficiency and premium build.'}\n` +
          `• **Key Advantage of ${p2.name}**: ${p2.pros?.[0] || 'Top-tier sustained performance and versatile capabilities.'}\n\n` +
          `**💡 WiseBot Verdict**: If your priority is maximum battery efficiency and brand ecosystem, choose **${p1.aiScore >= p2.aiScore ? p1.name : p2.name}**. If you want raw benchmark peak capability per Rupee, go with **${p1.price <= p2.price ? p1.name : p2.name}**.`;
      } else {
        text = `### ⚖️ Technical Breakdown Analysis\n\n` +
          `When comparing modern hardware configurations:\n` +
          `• **Processing Architecture**: Apple Silicon (M3/M4) leads in sustained thermal efficiency and battery life (15-18 hours). Intel Core Ultra / AMD Ryzen 8000 series lead in x86 compatibility and maximum eGPU / multi-monitor expansion.\n` +
          `• **Display Tech**: Look for 120Hz LTPO OLED for dynamic refresh modulation (1Hz to 120Hz) saving up to 25% battery.\n` +
          `• **Thermal Sustained Limits**: Active dual-fan laptops sustain 45W TDP without dropping core clock frequencies.\n\n` +
          `Would you like me to pull specific models from our catalog to compare?`;
      }
    } 
    // Budget Specific Queries
    else if (q.includes('under') || q.includes('budget') || q.includes('price') || q.includes('₹') || q.includes('rs') || q.includes('k')) {
      const budgetMatch = q.match(/(\d+)\s*(?:k|000)/i);
      let targetBudget = budgetSliderVal;
      if (budgetMatch) {
        const num = parseInt(budgetMatch[1]);
        targetBudget = num < 1000 ? num * 1000 : num;
      }

      const budgetPicks = products
        .filter(p => p.price <= targetBudget * 1.15)
        .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));

      productsFound = budgetPicks.slice(0, 3);

      if (productsFound.length > 0) {
        text = `### 💰 Top Budget Recommendations around ₹${targetBudget.toLocaleString('en-IN')}\n\n` +
          `Here are the highest-rated devices ranked by the **WiseScore Algorithm** for your budget bracket:\n\n` +
          productsFound.map((p, idx) => `**${idx + 1}. ${p.brand} ${p.name}** — ₹${p.price.toLocaleString('en-IN')}\n` +
            `• *WiseScore*: **${p.aiScore}/100** | *Rating*: ${p.rating}★\n` +
            `• *Highlight*: ${p.highlights?.[0] || p.pros?.[0] || 'Excellent balance of speed and longevity.'}`
          ).join('\n\n') +
          `\n\n**🛡️ Buying Advice**: All selected models have passed our sponsor-free thermal & component audit. Click any model below for full technical breakdown.`;
      } else {
        text = `I searched the database for options around ₹${targetBudget.toLocaleString('en-IN')}. Try adjusting the budget slider in the WiseBot toolbar for instant recommendations across Smartphones, Laptops, and ANC Headphones!`;
      }
    }
    // Jargon / Terminology Queries
    else if (q.includes('what is') || q.includes('explain') || q.includes('ltpo') || q.includes('oled') || q.includes('npu') || q.includes('tflops') || q.includes('tdp') || q.includes('anc')) {
      if (q.includes('ltpo')) {
        text = `### 💡 Jargon Decrypted: **LTPO Display (Low-Temperature Polycrystalline Oxide)**\n\n` +
          `• **ELI5 (Simply Put)**: A smart screen that automatically speeds up when you touch it (120Hz for silky scrolling) and slows down to 1Hz when reading a book or viewing Always-On-Display.\n` +
          `• **Battery Impact**: Saves **15% to 30%** daily battery compared to standard 60Hz or static 120Hz screens.\n` +
          `• **Where you find it**: Apple iPhone 15/16 Pro, Samsung Galaxy S24 Ultra, OnePlus 12.`;
      } else if (q.includes('npu') || q.includes('tops')) {
        text = `### 💡 Jargon Decrypted: **NPU (Neural Processing Unit) & TOPS**\n\n` +
          `• **What it is**: A dedicated silicone engine optimized for AI calculations (local language models, photo editing, live translations) without draining CPU/GPU battery.\n` +
          `• **TOPS metric**: Trillions of Operations Per Second. Modern AI PCs (Snapdragon X Elite, AMD Strix Point, Intel Lunar Lake) offer **40-48+ TOPS** to qualify for Microsoft Copilot+ features locally.`;
      } else {
        text = `### 💡 Tech Terminology Breakdown\n\n` +
          `• **TDP (Thermal Design Power)**: Maximum heat in Watts generated by the chip under load. Lower TDP = longer battery; Higher TDP = sustained gaming performance.\n` +
          `• **GaN (Gallium Nitride)**: Modern charger silicon allowing 65W-140W fast charging in tiny, pocketable power bricks without overheating.\n` +
          `• **ANC Decibel Attenuation**: High-end ANC headphones (Sony XM5, Bose QC Ultra) reduce background jet-engine hum by **-32dB to -38dB**.`;
      }
    }
    // Battery & Thermal Queries
    else if (q.includes('battery') || q.includes('sot') || q.includes('thermal') || q.includes('heat') || q.includes('throttling')) {
      const topBattery = products
        .filter(p => (p.specs && (p.specs['Battery'] || p.specs['Battery Life'] || p.specs['Capacity'])) || p.pros.some(pro => pro.toLowerCase().includes('battery')))
        .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
      
      productsFound = topBattery.slice(0, 3);

      text = `### 🔋 Battery Endurance & Thermal Throttling Audit\n\n` +
        `• **Screen-on-Time (SOT) Leaders**: Flagship devices with 5,000mAh+ Silicon-Carbon cells paired with TSMC 3nm/4nm nodes achieve **8.5 to 11 hours of active continuous SOT**.\n` +
        `• **Thermal Throttling Prevention**: Devices with oversized vapor chambers (Vapor Cooling > 9,000 mm²) prevent FPS drops during extended 60fps gaming and 4K video rendering.\n\n` +
        `**Top Endurance Picks from Catalog**:\n` +
        productsFound.map(p => `• **${p.name}** (₹${p.price.toLocaleString('en-IN')}) — WiseScore ${p.aiScore}/100`).join('\n');
    }
    // General Hardware Assistant query
    else {
      productsFound = products.filter(p => p.isEditorChoice || p.isTrending).slice(0, 2);
      text = `### 🎯 Hardware Intelligence Briefing\n\n` +
        `Regarding your question: "${query}"\n\n` +
        `Our database evaluates products on 5 objective pillars: **Raw Benchmarks**, **Thermals & Battery**, **Build Longevity**, **Software Update Policy**, and **Rupee-to-Value Index**.\n\n` +
        `• Feel free to ask for direct comparisons between specific brands (e.g. *Apple vs Samsung vs Lenovo*).\n` +
        `• You can also specify an exact budget (e.g. *Best laptop under ₹65,000*).\n\n` +
        `How can I refine this analysis for you?`;
    }

    return { text, productsFound };
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ExtendedChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Call Express server endpoint with Gemini API integration
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          mode: activeMode,
          history: messages.slice(-10).map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      let replyText = '';
      let detectedProducts: Product[] = [];

      if (response.ok) {
        const data = await response.json();
        replyText = data.text;
        detectedProducts = extractMentionedProducts(replyText);
        if (detectedProducts.length === 0) {
          detectedProducts = extractMentionedProducts(textToSend);
        }
      } else {
        throw new Error('API offline, generating local response');
      }

      const botMsg: ExtendedChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mentionedProducts: detectedProducts
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn('Using WiseBot offline intelligence engine:', err);
      const localResult = generateIntelligentLocalResponse(textToSend);

      const botMsg: ExtendedChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: localResult.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mentionedProducts: localResult.productsFound
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
        text: "👋 Chat reset! I am **WiseBot AI**. Ask me anything about specifications, price checks in ₹, or pick an intelligence mode below.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: [
          "📱 Recommend best camera phone under ₹50,000",
          "💻 Apple MacBook Air M3 vs ASUS ZenBook OLED",
          "🎧 Best wireless earbuds with active noise cancellation under ₹15,000",
          "⚡ What is an NPU and do I need 45 TOPS?"
        ]
      }
    ]);
  };

  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleTogglePin = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, pinned: !m.pinned } : m));
  };

  // Simulated Voice Query
  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    // Simulate voice transcription prompt
    setTimeout(() => {
      const voicePrompts = [
        "Which laptop has the best cooling and battery under 70,000 rupees?",
        "Compare Samsung Galaxy S24 Ultra with iPhone 16 Pro",
        "Explain what 120Hz LTPO AMOLED display means",
        "Best ANC headphones for office focus"
      ];
      const randomPrompt = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];
      setInput(randomPrompt);
      setIsListening(false);
    }, 1800);
  };

  // Simulated Speech Audio Playback
  const handleToggleSpeech = (msgId: string) => {
    if (activeAudioMsgId === msgId) {
      setActiveAudioMsgId(null);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    setActiveAudioMsgId(msgId);
    const targetMsg = messages.find(m => m.id === msgId);
    if (targetMsg && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Strip markdown asterisks and hash tags for speech synthesis
      const cleanText = targetMsg.text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.onend = () => setActiveAudioMsgId(null);
      utterance.onerror = () => setActiveAudioMsgId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setActiveAudioMsgId(null), 4000);
    }
  };

  // Export Transcript
  const handleExportTranscript = () => {
    const transcript = messages
      .map(m => `[${m.timestamp}] ${m.sender === 'user' ? 'You' : 'WiseBot AI'}:\n${m.text}\n`)
      .join('\n----------------------------------------\n\n');
    
    const blob = new Blob([`WiseFind AI Shopping Assistant Transcript\nExported on: ${new Date().toLocaleString()}\n\n${transcript}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WiseBot-Transcript-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8" id="wisebot-chat-container">
      {/* Container Frame */}
      <div className="bg-white dark:bg-[#0E1424] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col h-[740px] transition-colors duration-200">
        
        {/* Chat Header with Status & Mode Switchers */}
        <div className="bg-slate-50 dark:bg-[#090D16] border-b border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] rounded-2xl flex items-center justify-center text-white shadow-md shadow-purple-500/20 flex-shrink-0">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  WiseBot AI Companion
                </h3>
                <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Intel
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Hardware Benchmarks • Thermal Audits • Rupee Value Index
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={handleExportTranscript}
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Download Conversation Transcript"
            >
              <Download className="h-3.5 w-3.5 text-[#4F46E5]" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={handleClearChat}
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-500 bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Reset Conversation"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Intelligence Mode Tabs */}
        <div className="bg-slate-100/70 dark:bg-[#0B101D] border-b border-slate-200 dark:border-slate-800/80 px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'advisor', label: 'All-Round Advisor', icon: Bot },
            { id: 'compare', label: 'Spec Face-Off', icon: Scale },
            { id: 'budget', label: '₹ Budget Optimizer', icon: Award },
            { id: 'jargon', label: 'Jargon Decrypter', icon: HelpCircle },
            { id: 'thermal', label: 'Thermals & Battery', icon: Battery }
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                    : 'bg-white/80 dark:bg-[#12182B] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Mode Utility Bar (Budget Slider or Quick Jargon Buttons) */}
        {activeMode === 'budget' && (
          <div className="bg-indigo-50/60 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/40 p-3 px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-700 dark:text-slate-300">Set Maximum Budget:</span>
              <strong className="text-[#4F46E5] dark:text-indigo-400 font-black text-sm">₹{budgetSliderVal.toLocaleString('en-IN')}</strong>
            </div>
            <input
              type="range"
              min="15000"
              max="200000"
              step="5000"
              value={budgetSliderVal}
              onChange={(e) => setBudgetSliderVal(parseInt(e.target.value))}
              className="w-full sm:w-60 accent-[#4F46E5] cursor-pointer"
            />
            <button
              onClick={() => handleSendMessage(`What are the highest-rated tech devices under ₹${budgetSliderVal.toLocaleString('en-IN')}?`)}
              className="bg-[#4F46E5] hover:bg-indigo-600 text-white font-black text-[10px] uppercase px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Analyze Budget
            </button>
          </div>
        )}

        {/* Scrollable Chat Message Stream */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50 dark:bg-[#090D16]/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isAudioActive = activeAudioMsgId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 max-w-[92%] sm:max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar Icon */}
                <div className={`h-9 w-9 rounded-2xl flex items-center justify-center text-xs font-black flex-shrink-0 shadow-sm ${
                  isUser 
                    ? 'bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] text-white' 
                    : 'bg-black border border-purple-500/40 text-purple-400'
                }`}>
                  {isUser ? 'U' : <Bot className="h-4.5 w-4.5" />}
                </div>

                {/* Message Container */}
                <div className="space-y-3 min-w-0">
                  <div className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed border shadow-sm relative group ${
                    isUser
                      ? 'bg-[#111827] dark:bg-[#1E293B] text-white border-black dark:border-slate-700 rounded-tr-none'
                      : 'bg-white dark:bg-[#12182B] text-slate-800 dark:text-slate-100 border-slate-200/90 dark:border-slate-800 rounded-tl-none'
                  }`}>
                    
                    {/* Top action toolbar for bot response */}
                    {!isUser && (
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-bold">
                        <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                          <Sparkles className="h-3 w-3" /> WiseBot Analysis
                        </span>
                        <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleToggleSpeech(msg.id)}
                            className={`p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                              isAudioActive ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 hover:text-slate-700'
                            }`}
                            title={isAudioActive ? 'Stop Reading' : 'Listen to Audio Summary'}
                          >
                            {isAudioActive ? <VolumeX className="h-3.5 w-3.5 animate-pulse" /> : <Volume2 className="h-3.5 w-3.5" />}
                          </button>

                          <button
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            title="Copy Response"
                          >
                            {copiedMsgId === msg.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>

                          <button
                            onClick={() => handleTogglePin(msg.id)}
                            className={`p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                              msg.pinned ? 'text-amber-500' : 'text-slate-400 hover:text-slate-700'
                            }`}
                            title={msg.pinned ? 'Pinned to top' : 'Pin response'}
                          >
                            <Pin className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Formatted Content */}
                    <div className="space-y-2 whitespace-pre-line font-normal">
                      {msg.text.split('\n').map((line, lIdx) => {
                        if (line.startsWith('### ')) {
                          return <h4 key={lIdx} className="text-sm font-black text-slate-900 dark:text-white pt-1">{line.replace('### ', '')}</h4>;
                        }
                        if (line.startsWith('• ')) {
                          return (
                            <div key={lIdx} className="flex items-start gap-1.5 pl-1">
                              <span className="text-[#4F46E5] dark:text-purple-400 font-bold">•</span>
                              <span className="flex-grow">{line.replace('• ', '')}</span>
                            </div>
                          );
                        }
                        return <p key={lIdx}>{line}</p>;
                      })}
                    </div>

                    {/* Mentioned Products Cards inside Chat */}
                    {msg.mentionedProducts && msg.mentionedProducts.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                          Referenced Hardware Specifications:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {msg.mentionedProducts.map((p) => {
                            const isFav = favorites.some(f => f.id === p.id);
                            return (
                              <div
                                key={p.id}
                                className="bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col justify-between space-y-2 hover:border-purple-300 dark:hover:border-purple-800 transition-all shadow-xs"
                              >
                                <div className="flex gap-2.5 items-center">
                                  <SafeProductImage
                                    src={p.image}
                                    alt={p.name}
                                    category={p.category}
                                    className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <span className="text-[9px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest block">
                                      {p.brand}
                                    </span>
                                    <h5 className="font-extrabold text-slate-900 dark:text-white text-xs truncate">
                                      {p.name}
                                    </h5>
                                    <span className="text-[11px] font-black text-slate-900 dark:text-slate-100">
                                      ₹{p.price.toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-150 dark:border-slate-800">
                                  <button
                                    onClick={() => onProductSelect(p)}
                                    className="flex-1 bg-slate-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white text-[9px] font-black uppercase tracking-wider py-1.5 rounded-lg text-center cursor-pointer transition-colors"
                                  >
                                    Specs
                                  </button>
                                  {onAddToCompare && (
                                    <button
                                      onClick={() => onAddToCompare(p)}
                                      className="flex-1 bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[9px] font-black uppercase tracking-wider py-1.5 rounded-lg text-center cursor-pointer hover:bg-slate-50 transition-colors"
                                    >
                                      Compare
                                    </button>
                                  )}
                                  {onToggleFavorite && (
                                    <button
                                      onClick={() => onToggleFavorite(p)}
                                      className="p-1.5 rounded-lg bg-black border border-white/10 cursor-pointer hover:scale-105 transition-transform"
                                      title={isFav ? 'Remove from Stash' : 'Bookmark Specifications'}
                                    >
                                      <WiseBookmarkIcon size={14} active={isFav} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block px-1">
                    {msg.timestamp}
                  </span>

                  {/* Suggested Prompts Chips */}
                  {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedPrompts.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(p)}
                          className="text-[11px] text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-slate-900 bg-white dark:bg-[#12182B] hover:bg-slate-900 dark:hover:bg-white border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 font-bold transition-all shadow-xs text-left cursor-pointer hover:scale-[1.01]"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3.5 max-w-[80%]">
              <div className="h-9 w-9 rounded-2xl bg-black border border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div className="bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
                <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-xs font-bold text-slate-400 pl-2">WiseBot is analyzing specs & benchmarks...</span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Action Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090D16]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="flex items-center gap-2"
          >
            {/* Mic voice input simulator */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex-shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-slate-100 dark:bg-[#12182B] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={isListening ? 'Listening...' : 'Voice Query Input'}
            >
              {isListening ? <Mic className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
            </button>

            <input
              type="text"
              placeholder="Ask WiseBot anything (e.g. 'Compare MacBook M3 vs ThinkPad' or 'Best phone under ₹50,000')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-grow bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#4F46E5] transition-all font-medium shadow-inner"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white p-3 sm:px-5 rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-2 flex-shrink-0"
            >
              <span className="hidden sm:inline text-xs font-black uppercase tracking-wider">Ask</span>
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5 text-[10px] text-slate-400 font-semibold px-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              100% Sponsor-Free Hardware Verdicts & Verified ₹ Benchmarks
            </span>
            <span className="hidden sm:inline text-slate-500">
              Press Enter to query WiseBot Engine
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
