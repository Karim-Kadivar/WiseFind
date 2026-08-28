import React, { useState } from 'react';
import { EXPERTS_DATA } from '../data/expertsData';
import { Expert, ExpertSession, Product } from '../types';
import { ExpertChatModal } from './ExpertChatModal';
import { ExpertBookingModal } from './ExpertBookingModal';
import { ExpertApplicationModal } from './ExpertApplicationModal';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Star, MessageSquare, Video, Phone, ShieldCheck, 
  Sparkles, Clock, Search, Filter, Calendar, CheckCircle2, 
  Award, ArrowRight, UserCheck, Zap, ChevronRight, VideoOff, MessageCircle
} from 'lucide-react';

interface ExpertHubProps {
  productsCatalog?: Product[];
}

export const ExpertHub: React.FC<ExpertHubProps> = ({ productsCatalog = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeExpertForChat, setActiveExpertForChat] = useState<Expert | null>(null);
  const [activeExpertForBooking, setActiveExpertForBooking] = useState<Expert | null>(null);
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [userSessions, setUserSessions] = useState<ExpertSession[]>([
    {
      id: 'sess-demo-1',
      expertId: 'exp-1',
      expertName: 'Vikramaditya Sengupta',
      expertAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      expertTitle: 'Senior Systems Architect & PC Reviewer',
      type: 'video',
      status: 'upcoming',
      date: 'Today',
      timeSlot: 'Today 06:30 PM',
      topic: 'Reviewing Thermal & Battery Throttling for ThinkPad vs MacBook M3',
      meetingUrl: 'https://meet.wisefind.tech/room-thinkpad-m3'
    }
  ]);
  const [activeTabSection, setActiveTabSection] = useState<'directory' | 'sessions'>('directory');

  const categories = [
    'All',
    'Coding Laptops',
    'Flagship Smartphones',
    'ANC Headphones',
    'Custom Keyboards',
    'Competitive FPS Monitors',
    'Custom PC Building'
  ];

  const filteredExperts = EXPERTS_DATA.filter((expert) => {
    const matchesSearch = 
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      expert.bio.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'All') return true;
    return expert.specialties.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase()));
  });

  const handleBookingConfirmed = (newSession: ExpertSession) => {
    setUserSessions(prev => [newSession, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-slate-900 rounded-3xl text-white p-8 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-gradient-to-tr from-cyan-500/15 via-primary/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-cyan-300 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span>100% Sponsor-Free Hardware Council</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Talk 1:1 with Verified Tech Experts & Reviewers.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed">
              Connect directly with experienced hardware engineers, acoustic specialists, and veteran reviewers. Ask spec questions in 1:1 live chat, video consultations, or request custom build audits in Indian Rupees (₹).
            </p>
          </div>

          {/* Action Stats Block */}
          <div className="flex flex-wrap sm:flex-nowrap gap-4 bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700/80 flex-shrink-0">
            <div className="pr-6 border-r border-slate-700">
              <span className="text-2xl sm:text-3xl font-black text-cyan-400 block">1,270+</span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mt-1">1:1 Calls Guided</span>
            </div>
            <div className="pl-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 block">4.95 ★</span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mt-1">Average Satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation (Directory vs My Consultations) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTabSection('directory')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTabSection === 'directory'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Verified Experts ({EXPERTS_DATA.length})</span>
          </button>
          <button
            onClick={() => setActiveTabSection('sessions')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTabSection === 'sessions'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>My Consultations ({userSessions.length})</span>
          </button>
        </div>

        {/* Apply CTA Button */}
        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-primary px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm"
        >
          <Award className="h-4 w-4 text-primary" />
          <span>Apply as Verified Reviewer</span>
        </button>
      </div>

      {activeTabSection === 'directory' ? (
        <>
          {/* Search & Specialty Filters Bar */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              {/* Search Bar */}
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, spec topic, e.g. 'Thermal', 'Coding'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-primary rounded-2xl pl-10 pr-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none shadow-sm"
                />
              </div>

              {/* Quick Status Count */}
              <span className="text-xs font-bold text-slate-500">
                Showing <strong className="text-slate-900">{filteredExperts.length}</strong> available hardware specialists
              </span>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expert Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((exp) => (
              <motion.div
                key={exp.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group"
              >
                {/* Header Info */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={exp.avatar}
                          alt={exp.name}
                          referrerPolicy="no-referrer"
                          className="h-14 w-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm group-hover:border-primary/50 transition-colors"
                        />
                        {exp.isOnline && (
                          <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" title="Online for instant 1:1 chat" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-slate-900 text-base group-hover:text-primary transition-colors">{exp.name}</h3>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-0.5 border border-indigo-100">
                          {exp.verifiedBadge}
                        </span>
                      </div>
                    </div>

                    {/* Rating badge */}
                    <div className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl text-center flex-shrink-0">
                      <div className="flex items-center gap-1 font-black text-xs text-amber-900">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{exp.rating}</span>
                      </div>
                      <span className="text-[9px] text-amber-700 font-bold block">{exp.consultationsCount} sessions</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2">
                    {exp.bio}
                  </p>

                  {/* Specialties Pills */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Core Hardware Focus:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.specialties.map((spec, i) => (
                        <span key={i} className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-lg">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Featured Gear benchmarked */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Daily Evaluated Gear:</span>
                    <p className="text-[11px] font-bold text-slate-800 truncate">
                      {exp.featuredGear.join(' • ')}
                    </p>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Rate From</span>
                      <strong className="text-slate-900 font-black text-sm">₹{exp.chatRateINR}</strong> <span className="text-slate-400 text-[10px]">/ chat</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Response Time</span>
                      <span className="text-emerald-600 font-extrabold text-xs flex items-center gap-1 justify-end">
                        <Zap className="h-3 w-3 fill-emerald-500" />
                        {exp.responseRate}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveExpertForChat(exp)}
                      className="py-2.5 px-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Chat 1:1</span>
                    </button>
                    <button
                      onClick={() => setActiveExpertForBooking(exp)}
                      className="py-2.5 px-3 bg-primary hover:bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Video className="h-3.5 w-3.5 text-white" />
                      <span>Book Call</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        /* My Consultations Section */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Your Scheduled Consultations</h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Track upcoming video calls, chat history, and expert spec audit reports.</p>
            </div>
          </div>

          <div className="space-y-4">
            {userSessions.map((sess) => (
              <div
                key={sess.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="flex items-center gap-4">
                  <img src={sess.expertAvatar} className="h-14 w-14 rounded-2xl object-cover border-2 border-primary/20" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                        {sess.status}
                      </span>
                      <span className="text-xs font-bold text-slate-400">• {sess.timeSlot}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base">{sess.expertName}</h4>
                    <p className="text-xs text-slate-600 font-semibold">{sess.topic}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  {sess.meetingUrl && (
                    <a
                      href={sess.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 md:flex-initial px-5 py-3 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow"
                    >
                      <Video className="h-4 w-4 text-cyan-400" />
                      <span>Launch Video Call Room</span>
                    </a>
                  )}
                  <button
                    onClick={() => {
                      const exp = EXPERTS_DATA.find(e => e.id === sess.expertId) || EXPERTS_DATA[0];
                      setActiveExpertForChat(exp);
                    }}
                    className="flex-1 md:flex-initial px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Open Chat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render Modals if active */}
      {activeExpertForChat && (
        <ExpertChatModal
          expert={activeExpertForChat}
          onClose={() => setActiveExpertForChat(null)}
          productsCatalog={productsCatalog}
          onBookCall={(exp) => {
            setActiveExpertForChat(null);
            setActiveExpertForBooking(exp);
          }}
        />
      )}

      {activeExpertForBooking && (
        <ExpertBookingModal
          expert={activeExpertForBooking}
          onClose={() => setActiveExpertForBooking(null)}
          onBookingConfirmed={handleBookingConfirmed}
          productsCatalog={productsCatalog}
        />
      )}

      {showApplyModal && (
        <ExpertApplicationModal onClose={() => setShowApplyModal(false)} />
      )}
    </div>
  );
};
