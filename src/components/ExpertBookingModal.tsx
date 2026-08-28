import React, { useState } from 'react';
import { Expert, ExpertSession, Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Calendar, Clock, Video, Phone, FileText, CheckCircle2, 
  Sparkles, ShieldCheck, CreditCard, ChevronRight, AlertCircle, HelpCircle
} from 'lucide-react';

interface ExpertBookingModalProps {
  expert: Expert;
  onClose: () => void;
  onBookingConfirmed: (session: ExpertSession) => void;
  productsCatalog?: Product[];
}

export const ExpertBookingModal: React.FC<ExpertBookingModalProps> = ({
  expert,
  onClose,
  onBookingConfirmed,
  productsCatalog = []
}) => {
  const [selectedType, setSelectedType] = useState<'video' | 'audio' | 'audit'>('video');
  const [selectedSlot, setSelectedSlot] = useState<string>(expert.availableSlots[0] || 'Today 05:00 PM');
  const [topic, setTopic] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdSession, setCreatedSession] = useState<ExpertSession | null>(null);

  const getPrice = () => {
    if (selectedType === 'video') return expert.hourlyRateINR;
    if (selectedType === 'audio') return Math.round(expert.hourlyRateINR * 0.75);
    return expert.chatRateINR;
  };

  const handleConfirmBooking = () => {
    if (!topic.trim()) return;

    const newSession: ExpertSession = {
      id: `sess-${Date.now()}`,
      expertId: expert.id,
      expertName: expert.name,
      expertAvatar: expert.avatar,
      expertTitle: expert.title,
      type: selectedType,
      status: 'upcoming',
      date: selectedSlot.split(' ')[0] || 'Today',
      timeSlot: selectedSlot,
      topic: topic,
      notes: notes || undefined,
      meetingUrl: `https://meet.wisefind.tech/room-${Math.random().toString(36).substring(7)}`
    };

    setCreatedSession(newSession);
    setIsSuccess(true);
    onBookingConfirmed(newSession);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-xl overflow-hidden relative"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={expert.avatar} alt={expert.name} className="h-10 w-10 rounded-xl object-cover border-2 border-primary/40" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 block">
                1:1 Consultation Scheduler
              </span>
              <h3 className="font-extrabold text-white text-base">Book Session with {expert.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isSuccess ? (
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Consultation Format Selector */}
            <div className="space-y-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                1. Select Consultation Format
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'video', label: '1:1 Video Call', icon: Video, desc: '30 Min Live Screen & Hardware Review', price: expert.hourlyRateINR },
                  { id: 'audio', label: '1:1 Audio Call', icon: Phone, desc: '20 Min Direct Call & Q&A', price: Math.round(expert.hourlyRateINR * 0.75) },
                  { id: 'audit', label: 'Spec Audit Report', icon: FileText, desc: 'Async Written Technical Audit', price: expert.chatRateINR },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedType(item.id as any)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary bg-indigo-50/50 shadow-md shadow-indigo-500/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <Icon className={`h-5 w-5 mb-2 ${isSelected ? 'text-primary' : 'text-slate-400'}`} />
                        <h4 className="font-extrabold text-slate-900 text-xs">{item.label}</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight mt-1">{item.desc}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/60">
                        <span className="text-xs font-black text-slate-900">₹{item.price}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select Slot */}
            <div className="space-y-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                2. Choose Available Time Slot
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {expert.availableSlots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-3 py-2.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'border-primary bg-slate-900 text-white'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Core Query / Topic */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                3. Primary Consultation Goal / Hardware Query <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 'Choosing between MacBook Air M3 16GB vs Asus Zenbook 14 OLED for Coding'"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary rounded-xl px-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Additional details */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                4. Additional Context / Current Setup (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="List your budget limit, target apps (VS Code, Blender, Premiere Pro), or specific questions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary rounded-xl p-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Order Summary Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Total Session Fee</span>
                <span className="text-lg font-black text-slate-900">₹{getPrice()} INR</span>
                <span className="text-[10px] text-emerald-600 font-bold block">✓ 100% Satisfaction Guarantee</span>
              </div>
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={!topic.trim()}
                className="px-6 py-3.5 bg-slate-900 hover:bg-black disabled:opacity-40 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-slate-900/10 flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4 text-cyan-400" />
                <span>Confirm & Reserve Slot</span>
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation State */
          <div className="p-8 text-center space-y-6">
            <div className="h-16 w-16 bg-emerald-100 border-2 border-emerald-300 rounded-full flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Consultation Reserved
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">Session Confirmed with {expert.name}</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Scheduled for <span className="text-slate-800 font-bold">{createdSession?.timeSlot}</span>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Format:</span>
                <span className="font-bold text-slate-900 uppercase">{createdSession?.type} Consultation</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Topic:</span>
                <span className="font-bold text-slate-900">{createdSession?.topic}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Meeting Room Link:</span>
                <a href={createdSession?.meetingUrl} target="_blank" rel="noreferrer" className="font-bold text-primary underline truncate max-w-[200px]">
                  {createdSession?.meetingUrl}
                </a>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                Close & View My Consultations
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
