import React, { useState } from 'react';
import { Expert, ExpertSession, Product } from '../types';
import { EXPERTS_DATA } from '../data/expertsData';
import { 
  Users, Video, MessageSquare, Clock, ShieldCheck, Sparkles, 
  Calendar, CheckCircle2, AlertCircle, ArrowRight, DollarSign, 
  Star, Settings, Plus, UserCheck, ToggleLeft, ToggleRight,
  Radio, BookOpen, ExternalLink, HelpCircle, PhoneCall
} from 'lucide-react';
import { motion } from 'motion/react';

interface ExpertDashboardProps {
  user: { name: string; email: string } | null;
  productsCatalog: Product[];
  onOpenGuides?: () => void;
}

export const ExpertDashboard: React.FC<ExpertDashboardProps> = ({
  user,
  productsCatalog,
  onOpenGuides
}) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'availability' | 'profile' | 'earnings'>('sessions');

  // Expert Live State
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [hourlyRate, setHourlyRate] = useState<number>(1499);
  const [chatRate, setChatRate] = useState<number>(499);
  const [specialties, setSpecialties] = useState<string[]>([
    'Coding Laptops & Linux',
    'MacBook M3 vs ThinkPad',
    'Audiophile ANC & DACs',
    'Mechanical Switches'
  ]);
  const [newSpecialtyInput, setNewSpecialtyInput] = useState('');
  const [expertTitle, setExpertTitle] = useState('Senior Systems Architect & Hardware Reviewer');
  const [expertBio, setExpertBio] = useState('10+ years reviewing enterprise workstations, thermals, and high-fidelity audio hardware. Helping shoppers avoid marketing traps.');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Active Sessions State
  const [sessions, setSessions] = useState<ExpertSession[]>([
    {
      id: 'sess-101',
      expertId: 'exp-current',
      expertName: user?.name || 'Verified Tech Expert',
      expertAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      expertTitle: 'Senior Systems Architect',
      type: 'video',
      status: 'upcoming',
      date: 'Today',
      timeSlot: 'Today 06:30 PM (IST)',
      topic: 'Battery & Thermal Throttling Comparison: MacBook Pro 16" M3 Max vs Lenovo Legion Pro 7i',
      meetingUrl: 'https://meet.wisefind.tech/room-spec-audit-101',
      notes: 'User wants objective developer benchmarks for Docker & LLM local compilation.'
    },
    {
      id: 'sess-102',
      expertId: 'exp-current',
      expertName: user?.name || 'Verified Tech Expert',
      expertAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      expertTitle: 'Senior Systems Architect',
      type: 'chat',
      status: 'upcoming',
      date: 'Tomorrow',
      timeSlot: 'Tomorrow 02:00 PM (IST)',
      topic: 'Mechanical Keyboard Switch Acoustics: Gateron Oil Kings vs Holy Pandas on Aluminum Plate',
      notes: 'Shopper is designing a custom CNC 75% board for programming.'
    },
    {
      id: 'sess-103',
      expertId: 'exp-current',
      expertName: user?.name || 'Verified Tech Expert',
      expertAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      expertTitle: 'Senior Systems Architect',
      type: 'video',
      status: 'completed',
      date: 'Yesterday',
      timeSlot: 'Yesterday 04:00 PM',
      topic: 'Smartphone Camera Sensor Shootout: Vivo X100 Pro vs S24 Ultra for Travel Photography',
      ratingGiven: 5,
      notes: 'Recommended Vivo X100 Pro with Zeiss APO telephoto for portrait sharpness.'
    }
  ]);

  const handleAddSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecialtyInput.trim()) return;
    if (!specialties.includes(newSpecialtyInput.trim())) {
      setSpecialties(prev => [...prev, newSpecialtyInput.trim()]);
    }
    setNewSpecialtyInput('');
  };

  const handleRemoveSpecialty = (spec: string) => {
    setSpecialties(prev => prev.filter(s => s !== spec));
  };

  const triggerSaveNotification = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleMarkComplete = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'completed' as const } : s));
    triggerSaveNotification('Session marked as completed. Earnings deposited to account balance.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in" id="expert-dashboard-root">
      {/* Top Banner with Glow and Live Availability */}
      <div className="relative bg-[#0E1322] border-2 border-[#1E293B] rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-2xl">
        {/* Glow gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#7C3AED]/25 via-[#4F46E5]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-gradient-to-tr from-[#4F46E5]/20 via-purple-600/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#C084FC] text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5 text-[#C084FC]" />
              <span>Verified Hardware Expert Desk</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Welcome back, {user ? user.name : 'Hardware Specialist'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Manage your direct 1:1 client video audits, adjust consultation pricing, and review buyer inquiries in real time.
            </p>
          </div>

          {/* Availability & Rates quick control card */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-[#12182B] p-4 sm:p-5 rounded-2xl border border-slate-800 flex-shrink-0 w-full lg:w-auto">
            <div className="flex items-center justify-between sm:justify-start gap-4 pr-0 sm:pr-4 sm:border-r border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Live Status</span>
                <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mt-0.5 ${isOnline ? 'text-emerald-400' : 'text-slate-400'}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                  {isOnline ? 'Accepting Clients' : 'Paused / Offline'}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsOnline(!isOnline);
                  triggerSaveNotification(`Status updated: ${!isOnline ? 'Available for calls' : 'Offline'}`);
                }}
                className="p-1 rounded-xl hover:bg-slate-800 transition-all cursor-pointer text-slate-300"
                title="Toggle Availability"
              >
                {isOnline ? (
                  <ToggleRight className="h-7 w-7 text-[#7C3AED]" />
                ) : (
                  <ToggleLeft className="h-7 w-7 text-slate-500" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-4 pl-0 sm:pl-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Video Rate</span>
                <span className="text-xs font-black text-white block mt-0.5">₹{hourlyRate}/hr</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chat Rate</span>
                <span className="text-xs font-black text-white block mt-0.5">₹{chatRate}/audit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Notification */}
      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-lg shadow-emerald-950/40">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Key Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming Consultations', value: sessions.filter(s => s.status === 'upcoming').length, sub: 'Next today at 6:30 PM', icon: Calendar, color: 'text-[#818CF8]', bg: 'bg-[#4F46E5]/15 border-[#4F46E5]/30' },
          { label: 'Total Completed Audits', value: '48 Sessions', sub: '98% on-time start', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
          { label: 'Client Feedback Rating', value: '4.98 / 5.0', sub: 'From 46 verified buyers', icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' },
          { label: 'Pending Payout (INR)', value: '₹42,800', sub: 'Auto-disbursed weekly', icon: DollarSign, color: 'text-[#C084FC]', bg: 'bg-[#7C3AED]/15 border-[#7C3AED]/30' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#0E1322] border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{stat.label}</span>
                <div className={`p-2 rounded-xl border ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight">{stat.value}</span>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'sessions', label: 'Consultations & Requests', count: sessions.filter(s => s.status === 'upcoming').length, icon: Calendar },
          { id: 'availability', label: 'Rates & Availability', icon: Clock },
          { id: 'profile', label: 'Expert Credentials & Tags', icon: UserCheck },
          { id: 'earnings', label: 'Earnings & Reviews', icon: DollarSign }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                isActive
                  ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white border-transparent shadow-md shadow-[#4F46E5]/20'
                  : 'bg-[#0E1322] text-slate-400 hover:text-white hover:bg-slate-800/80 border-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-[#7C3AED] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Consultations & Requests */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-black text-white">Client Consultation Queue</h2>
              <p className="text-xs text-slate-400">Scheduled 1:1 hardware specification calls and review audits.</p>
            </div>
          </div>

          <div className="space-y-4">
            {sessions.map((sess) => {
              const isUpcoming = sess.status === 'upcoming';
              return (
                <div
                  key={sess.id}
                  className={`bg-[#0E1322] border-2 rounded-2xl p-6 transition-all ${
                    isUpcoming ? 'border-[#4F46E5]/40 hover:border-[#4F46E5]' : 'border-slate-800/80 opacity-75'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-4 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${sess.type === 'video' ? 'bg-[#4F46E5]/20 text-[#818CF8] border-[#4F46E5]/30' : 'bg-[#7C3AED]/20 text-[#C084FC] border-[#7C3AED]/30'}`}>
                        {sess.type === 'video' ? <Video className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            {sess.type === 'video' ? '1:1 Live Video Audit' : 'Direct Text Consultation'}
                          </span>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            isUpcoming ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {sess.status}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-white mt-0.5">{sess.topic}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-left lg:text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scheduled Slot</span>
                        <span className="text-xs font-black text-slate-200">{sess.timeSlot}</span>
                      </div>
                    </div>
                  </div>

                  {sess.notes && (
                    <div className="bg-[#12182B] p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 font-medium mb-4">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#818CF8] block mb-1">Client Audit Scope Note:</span>
                      {sess.notes}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-[#7C3AED]" />
                      <span>Duration: 45 minutes allocation</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isUpcoming && sess.meetingUrl && (
                        <a
                          href={sess.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#4F46E5]/20 flex items-center gap-2 cursor-pointer"
                        >
                          <Video className="h-3.5 w-3.5" />
                          <span>Launch Video Room</span>
                        </a>
                      )}
                      {isUpcoming && (
                        <button
                          onClick={() => handleMarkComplete(sess.id)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Rates & Availability */}
      {activeTab === 'availability' && (
        <div className="bg-[#0E1322] border-2 border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-black text-white">Consultation Rates & Schedules</h2>
            <p className="text-xs text-slate-400">Configure your commercial rate per session in Indian Rupees (₹) and manage active booking windows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#12182B] p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#4F46E5]/20 text-[#818CF8] border border-[#4F46E5]/30">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">1:1 Video Consultation (45 Min)</h3>
                  <p className="text-[11px] text-slate-400">Live screen-sharing and specification dissection.</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                  Hourly Rate (₹ INR)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseInt(e.target.value) || 0)}
                    className="bg-[#0E1322] border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white w-full focus:outline-none focus:border-[#4F46E5]"
                  />
                  <button
                    onClick={() => triggerSaveNotification('Video hourly rate updated successfully!')}
                    className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex-shrink-0"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#12182B] p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#7C3AED]/20 text-[#C084FC] border border-[#7C3AED]/30">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Text Chat Spec Audit</h3>
                  <p className="text-[11px] text-slate-400">Asynchronous in-depth hardware review and advice.</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                  Per-Audit Rate (₹ INR)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={chatRate}
                    onChange={(e) => setChatRate(parseInt(e.target.value) || 0)}
                    className="bg-[#0E1322] border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white w-full focus:outline-none focus:border-[#7C3AED]"
                  />
                  <button
                    onClick={() => triggerSaveNotification('Chat audit rate updated successfully!')}
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex-shrink-0"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Expert Credentials & Specialties */}
      {activeTab === 'profile' && (
        <div className="bg-[#0E1322] border-2 border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-black text-white">Expert Profile & Focus Domains</h2>
            <p className="text-xs text-slate-400">Highlight your engineering specialties so shoppers with exact matching needs can find and book you.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                Professional Title / Headline
              </label>
              <input
                type="text"
                value={expertTitle}
                onChange={(e) => setExpertTitle(e.target.value)}
                className="bg-[#12182B] border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white w-full focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                Public Bio / Experience Overview
              </label>
              <textarea
                rows={3}
                value={expertBio}
                onChange={(e) => setExpertBio(e.target.value)}
                className="bg-[#12182B] border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-200 w-full focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                Specialized Hardware Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4F46E5]/15 border border-[#4F46E5]/30 text-[#818CF8] text-xs font-bold"
                  >
                    <span>{spec}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(spec)}
                      className="text-slate-400 hover:text-rose-400 cursor-pointer ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddSpecialty} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="e.g. OLED Color Grading, Linux Drivers..."
                  value={newSpecialtyInput}
                  onChange={(e) => setNewSpecialtyInput(e.target.value)}
                  className="bg-[#12182B] border border-slate-700 rounded-xl px-4 py-2 text-xs font-medium text-white w-full focus:outline-none focus:border-[#4F46E5]"
                />
                <button
                  type="submit"
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex-shrink-0"
                >
                  Add Tag
                </button>
              </form>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => triggerSaveNotification('Expert credentials & bio updated across platform index!')}
                className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md shadow-[#4F46E5]/20 cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Earnings & Reviews */}
      {activeTab === 'earnings' && (
        <div className="bg-[#0E1322] border-2 border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-black text-white">Client Reviews & Payout Ledger</h2>
            <p className="text-xs text-slate-400">Track verified consultation ratings, tips, and direct bank settlement cycles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#12182B] p-5 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">This Month's Gross</span>
              <span className="text-2xl font-black text-white block mt-1">₹58,400</span>
              <span className="text-[10px] text-emerald-400 font-bold block mt-1">+24% vs last month</span>
            </div>
            <div className="bg-[#12182B] p-5 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Platform Fee (WiseFind)</span>
              <span className="text-2xl font-black text-slate-400 block mt-1">0% (Beta)</span>
              <span className="text-[10px] text-[#818CF8] font-bold block mt-1">100% earnings to experts</span>
            </div>
            <div className="bg-[#12182B] p-5 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Next Bank Settlement</span>
              <span className="text-2xl font-black text-emerald-400 block mt-1">Friday 11:00 AM</span>
              <span className="text-[10px] text-slate-400 font-bold block mt-1">Direct NEFT to HDFC Bank</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-black text-white">Recent Client Testimonials</h3>
            {[
              {
                user: 'Aakash Verma',
                rating: 5,
                comment: 'Saved me ₹35,000 on my laptop purchase by proving I did not need the extra discrete GPU for backend Go compilation. Clear, scientific advice.',
                time: '2 days ago'
              },
              {
                user: 'Pooja Iyer',
                rating: 5,
                comment: 'The acoustic breakdown of silent mechanical switches and foam mods was top-notch.',
                time: '5 days ago'
              }
            ].map((review, i) => (
              <div key={i} className="bg-[#12182B] p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-white">{review.user}</span>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">"{review.comment}"</p>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">{review.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
