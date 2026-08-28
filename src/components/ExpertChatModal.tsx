import React, { useState, useEffect, useRef } from 'react';
import { Expert, ExpertChatMessage, Product } from '../types';
import { SafeProductImage } from './SafeProductImage';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Send, Video, Phone, CheckCircle2, Sparkles, Paperclip, 
  MessageSquare, Star, ShieldCheck, Clock, FileText, PhoneOff, Mic, MicOff, Camera, CameraOff, Volume2
} from 'lucide-react';

interface ExpertChatModalProps {
  expert: Expert;
  onClose: () => void;
  productsCatalog?: Product[];
  onBookCall?: (expert: Expert) => void;
}

export const ExpertChatModal: React.FC<ExpertChatModalProps> = ({
  expert,
  onClose,
  productsCatalog = [],
  onBookCall
}) => {
  const [messages, setMessages] = useState<ExpertChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'expert',
      text: `Hello! I'm ${expert.name}. I specialize in ${expert.specialties.join(', ')}. What tech hardware or comparison are you deciding on today? Feel free to share your budget or attach items from WiseFind catalog!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [activeCall, setActiveCall] = useState<'video' | 'audio' | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (attachmentProduct?: Product) => {
    if (!input.trim() && !attachmentProduct) return;

    const userMsgText = input.trim();
    const newUserMsg: ExpertChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userMsgText || (attachmentProduct ? `Attached product specs for review: ${attachmentProduct.name}` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: attachmentProduct ? [{
        productName: attachmentProduct.name,
        productPrice: attachmentProduct.price,
        productImage: attachmentProduct.image,
        productCategory: attachmentProduct.category,
        specSummary: `${attachmentProduct.brand} | AI Score: ${attachmentProduct.aiScore}/100`
      }] : undefined
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setShowProductPicker(false);
    setIsTyping(true);

    // Simulate Expert thoughtful response after 1.2s
    setTimeout(() => {
      let responseText = '';
      if (attachmentProduct) {
        responseText = `Thanks for attaching the ${attachmentProduct.name} (₹${attachmentProduct.price.toLocaleString('en-IN')})! Looking at the specifications, it scores ${attachmentProduct.aiScore}/100 on WiseFind. Key highlight: ${attachmentProduct.highlights[0] || 'Solid thermal design'}. Do you want me to contrast this against alternatives in the same budget segment?`;
      } else if (userMsgText.toLowerCase().includes('laptop') || userMsgText.toLowerCase().includes('macbook') || userMsgText.toLowerCase().includes('code')) {
        responseText = `Great query regarding laptops. For coding and multi-threaded workloads, I always emphasize RAM scalability and sustained thermal performance over peak burst clock speeds. In India, under ₹80,000, looking for 16GB LPDDR5/DDR5 is mandatory. Would you like a 1:1 30-min video call to review specific thermal benchmarks?`;
      } else if (userMsgText.toLowerCase().includes('phone') || userMsgText.toLowerCase().includes('camera') || userMsgText.toLowerCase().includes('battery')) {
        responseText = `On mobile tech, sensors and ISP processing matter more than raw Megapixel count! For battery durability in Indian weather, check the vapor chamber size. What is your primary priority: camera dynamic range, gaming FPS, or battery longevity?`;
      } else {
        responseText = `That's a very practical question! Based on my evaluation of over 200+ hardware setups, I recommend prioritizing build durability and warranty service network in your city. Shall I prepare a custom 1-page spec audit report for you?`;
      }

      setMessages(prev => [...prev, {
        id: `msg-${Date.now() + 1}`,
        sender: 'expert',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-3xl h-[92vh] max-h-[750px] flex flex-col overflow-hidden relative"
      >
        {/* Chat Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img 
                src={expert.avatar} 
                alt={expert.name} 
                referrerPolicy="no-referrer"
                className="h-11 w-11 rounded-2xl object-cover border-2 border-primary/50 shadow-sm"
              />
              {expert.isOnline && (
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-sm sm:text-base tracking-tight">{expert.name}</h3>
                <span className="text-[9px] font-black uppercase tracking-wider bg-primary/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Verified Reviewer
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium truncate max-w-[280px] sm:max-w-md">
                {expert.title} • {expert.responseRate} response time
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCall('audio')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all cursor-pointer"
              title="Start Audio Call Simulation"
            >
              <Phone className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveCall('video')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all cursor-pointer"
              title="Start Video Call Simulation"
            >
              <Video className="h-4 w-4 text-cyan-400" />
            </button>
            {onBookCall && (
              <button
                onClick={() => {
                  onClose();
                  onBookCall(expert);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-indigo-600 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Book Call</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Live Call Simulator Overlay if Active */}
        <AnimatePresence>
          {activeCall && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-950 text-white p-4 border-b border-slate-800 flex-shrink-0 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={expert.avatar} alt={expert.name} className="h-12 w-12 rounded-2xl object-cover border-2 border-emerald-400" />
                    <span className="absolute inset-0 rounded-2xl border-2 border-emerald-400 animate-ping opacity-30" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                        Live {activeCall === 'video' ? 'Video Consultation' : 'Audio Call'} In Progress
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold">{expert.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">02:14 • 1:1 Direct Telemetry Channel</p>
                  </div>
                </div>

                {/* Call Control Buttons */}
                <div className="flex items-center gap-3 bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer ${isMuted ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  {activeCall === 'video' && (
                    <button
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer ${isVideoOff ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                    >
                      {isVideoOff ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                    </button>
                  )}
                  <button
                    onClick={() => setActiveCall(null)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg"
                  >
                    <PhoneOff className="h-4 w-4" />
                    <span>End Call</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[88%] sm:max-w-[78%]">
                {msg.sender === 'expert' && (
                  <img
                    src={expert.avatar}
                    alt={expert.name}
                    className="h-7 w-7 rounded-xl object-cover border border-slate-200 flex-shrink-0 mb-1"
                  />
                )}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line font-medium">{msg.text}</p>

                  {/* Render Product Attachment if attached */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/40 space-y-2">
                      {msg.attachments.map((att, i) => (
                        <div key={i} className="bg-slate-100/80 border border-slate-200 rounded-xl p-2.5 flex items-center gap-3">
                          {att.productImage && (
                            <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 overflow-hidden flex-shrink-0">
                              <SafeProductImage src={att.productImage} alt={att.productName || 'Product'} category={att.productCategory || 'Laptops'} />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-slate-900 text-xs truncate">{att.productName}</h5>
                            <p className="text-[10px] text-slate-500 font-semibold">
                              ₹{att.productPrice?.toLocaleString('en-IN')} • {att.specSummary}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <span
                    className={`text-[9px] font-bold block mt-2 text-right ${
                      msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold pl-2">
              <img src={expert.avatar} className="h-6 w-6 rounded-lg object-cover" />
              <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-2 rounded-2xl shadow-sm">
                <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{expert.name} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Product Picker Drawer if toggled */}
        <AnimatePresence>
          {showProductPicker && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="p-3 bg-white border-t border-slate-200 shadow-lg flex-shrink-0 max-h-48 overflow-y-auto space-y-2"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Select Product to Attach into 1:1 Consultation
                </span>
                <button onClick={() => setShowProductPicker(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {productsCatalog.slice(0, 6).map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => handleSend(prod)}
                    className="p-2 border border-slate-200 hover:border-primary rounded-xl flex items-center gap-2 text-left hover:bg-slate-50 transition-all cursor-pointer group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                      <SafeProductImage src={prod.image} alt={prod.name} category={prod.category} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-slate-800 truncate group-hover:text-primary">{prod.name}</h5>
                      <span className="text-[10px] text-slate-500 font-semibold">₹{prod.price.toLocaleString('en-IN')}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowProductPicker(!showProductPicker)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              showProductPicker ? 'bg-primary text-white border-primary' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Attach Product Specs from WiseFind Catalog"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <input
            type="text"
            placeholder={`Ask ${expert.name} a spec question... (e.g. 'Is this thermal design suitable for 4K video rendering?')`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-primary rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 font-medium focus:outline-none"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-3 bg-slate-900 hover:bg-black disabled:opacity-40 text-white rounded-2xl font-black transition-all cursor-pointer shadow-md shadow-slate-900/10 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
