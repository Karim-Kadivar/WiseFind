import React, { useState, useMemo, useEffect } from 'react';
import { ADVISORS_DATA, EXPERTS_DATA } from '../data/expertsData.js';
import { ExpertChatModal } from './ExpertChatModal.jsx';
import { ExpertBookingModal } from './ExpertBookingModal.jsx';
import { ExpertApplicationModal } from './ExpertApplicationModal.jsx';
import { motion } from 'motion/react';
import { 
  Users, 
  Star, 
  MessageSquare, 
  Video, 
  ShieldCheck, 
  Search, 
  Calendar, 
  CheckCircle2, 
  Award, 
  Zap, 
  FileText,
  Smartphone,
  Laptop,
  Headphones,
  UtensilsCrossed,
  Sparkles,
  Shirt,
  Gamepad2,
  Watch,
  Clock,
  ChevronRight,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export const ExpertHub = ({ productsCatalog = [], onProductSelect, initialCategory = 'All', onOpenGuides }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [onlyOnline, setOnlyOnline] = useState(false);
    const [activeExpertForChat, setActiveExpertForChat] = useState(null);
    const [activeExpertForBooking, setActiveExpertForBooking] = useState(null);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [showAuditModal, setShowAuditModal] = useState(false);
    
    // Quick Audit State
    const [auditDeviceName, setAuditDeviceName] = useState('');
    const [auditBudget, setAuditBudget] = useState('');
    const [auditNotes, setAuditNotes] = useState('');
    const [auditSuccess, setAuditSuccess] = useState(false);

    const [userSessions, setUserSessions] = useState([
        {
            id: 'sess-demo-1',
            expertId: 'adv-1',
            expertName: 'Vikramaditya Sengupta',
            expertAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            expertTitle: 'Senior Systems Architect & PC Benchmark Specialist',
            type: 'video',
            status: 'upcoming',
            date: 'Today',
            timeSlot: 'Today 06:30 PM',
            topic: 'Reviewing Thermal & Battery Throttling for ThinkPad vs MacBook M3',
            meetingUrl: 'https://meet.wisefind.tech/room-thinkpad-m3'
        }
    ]);
    const [activeTabSection, setActiveTabSection] = useState('directory');

    const categories = [
        { label: 'All', icon: Users },
        { label: 'Smartphones & Gadgets', icon: Smartphone },
        { label: 'Laptops & Workstations', icon: Laptop },
        { label: 'Audio & Headphones', icon: Headphones },
        { label: 'Home & Kitchen', icon: UtensilsCrossed },
        { label: 'Skincare & Personal Care', icon: Sparkles },
        { label: 'Fashion & Footwear', icon: Shirt },
        { label: 'Gaming & PC Builds', icon: Gamepad2 },
        { label: 'Fitness & Wearables', icon: Watch }
    ];

    // Synchronize initialCategory if navigated from Buying Guides or Catalog
    useEffect(() => {
        if (initialCategory && initialCategory !== 'All') {
            const raw = initialCategory.toLowerCase();
            const matched = categories.find(c => {
                const label = c.label.toLowerCase();
                return label.includes(raw) || raw.includes(label) ||
                       (raw.includes('phone') && label.includes('phone')) ||
                       (raw.includes('laptop') && label.includes('laptop')) ||
                       (raw.includes('audio') && label.includes('audio')) ||
                       (raw.includes('headphone') && label.includes('headphone')) ||
                       (raw.includes('kitchen') && label.includes('kitchen')) ||
                       (raw.includes('watch') && (label.includes('wearable') || label.includes('watch'))) ||
                       (raw.includes('fashion') && label.includes('fashion'));
            });
            if (matched) {
                setSelectedCategory(matched.label);
            } else {
                setSelectedCategory(initialCategory);
            }
        }
    }, [initialCategory]);

    const advisorsList = ADVISORS_DATA || EXPERTS_DATA;

    const filteredAdvisors = useMemo(() => {
        return advisorsList.filter((advisor) => {
            const query = searchQuery.toLowerCase();
            const matchesSearch = 
                advisor.name.toLowerCase().includes(query) ||
                advisor.title.toLowerCase().includes(query) ||
                (advisor.category && advisor.category.toLowerCase().includes(query)) ||
                advisor.specialties.some(s => s.toLowerCase().includes(query)) ||
                advisor.bio.toLowerCase().includes(query) ||
                (advisor.featuredGear && advisor.featuredGear.some(g => g.toLowerCase().includes(query)));

            if (!matchesSearch) return false;
            if (onlyOnline && !advisor.isOnline) return false;
            if (selectedCategory === 'All') return true;

            const categoryMatch = 
                (advisor.category && advisor.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
                advisor.specialties.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase()));

            return categoryMatch;
        });
    }, [searchQuery, onlyOnline, selectedCategory, advisorsList]);

    const handleBookingConfirmed = (newSession) => {
        setUserSessions(prev => [newSession, ...prev]);
        setActiveTabSection('sessions');
    };

    const handleSubmitAudit = (e) => {
        e.preventDefault();
        if (!auditDeviceName.trim()) return;
        setAuditSuccess(true);
        setTimeout(() => {
            setAuditSuccess(false);
            setShowAuditModal(false);
            setAuditDeviceName('');
            setAuditBudget('');
            setAuditNotes('');
        }, 2200);
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10" id="advisors-hub">
      
        {/* Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#070A14] via-[#0E1528] to-[#1A233D] rounded-3xl text-white p-6 sm:p-10 border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none"/>
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-gradient-to-tr from-amber-500/15 via-cyan-500/10 to-transparent rounded-full blur-2xl pointer-events-none"/>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4 text-indigo-400"/>
                <span>100% Sponsor-Free Category Advisors</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Direct 1:1 Guidance from Verified Product Advisors.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Connect with genuine category specialists who physically test and benchmark products. Ask your exact buying dilemmas via instant 1:1 chat or video calls across Mobiles, Laptops, Audio, Kitchen, Skincare, Fashion, and Gaming.
              </p>
            </div>

            {/* Action Stats Block */}
            <div className="flex flex-wrap sm:flex-nowrap gap-4 bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 flex-shrink-0">
              <div className="pr-5 border-r border-slate-800">
                <span className="text-2xl sm:text-3xl font-black text-indigo-400 block">1,480+</span>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mt-1">1:1 Sessions Guided</span>
              </div>
              <div className="pl-2">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 block">4.96 ★</span>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mt-1">Satisfaction Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tab Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#12182B] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setActiveTabSection('directory')} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTabSection === 'directory'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="h-4 w-4"/>
              <span>Category Advisors ({advisorsList.length})</span>
            </button>
            <button 
              onClick={() => setActiveTabSection('sessions')} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTabSection === 'sessions'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="h-4 w-4"/>
              <span>My Advice Sessions ({userSessions.length})</span>
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setShowAuditModal(true)} 
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md hover:opacity-95 active:scale-95"
            >
              <FileText className="h-4 w-4 text-[#FBBF24]"/>
              <span>Free 3-Min Spec Audit</span>
            </button>

            <button 
              onClick={() => setShowApplyModal(true)} 
              className="flex items-center gap-1.5 bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#1A223B] text-slate-800 dark:text-slate-200 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Award className="h-4 w-4 text-purple-600 dark:text-purple-400"/>
              <span>Apply as Advisor</span>
            </button>
          </div>
        </div>

        {activeTabSection === 'directory' ? (
          <>
            {/* Search & Category Filter Pills */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                {/* Search Bar */}
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                  <input 
                    type="text" 
                    placeholder="Search by advisor name, topic, e.g. 'Air Fryer', 'Coding', 'Camera'..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 focus:border-[#4F46E5] rounded-2xl pl-10 pr-4 py-3 text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none shadow-sm"
                  />
                </div>

                {/* Online Only Toggle */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <button 
                    onClick={() => setOnlyOnline(!onlyOnline)} 
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      onlyOnline
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-600 dark:text-emerald-400'
                        : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${onlyOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}/>
                    <span>Available Now</span>
                  </button>
                </div>
              </div>

              {/* Category Pills Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.label;
                  return (
                    <button
                      key={cat.label}
                      onClick={() => setSelectedCategory(cat.label)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#4F46E5] text-white border-transparent shadow-md shadow-indigo-500/25'
                          : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5"/>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Buying Guide Quick Bridge Banner */}
            {onOpenGuides && (
              <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-200/80 dark:border-indigo-900/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Want to master the 5 Golden Rules before consulting?
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                      Read our plain-language {selectedCategory !== 'All' ? selectedCategory : 'Category'} Buying Guide with cheat sheets, Do's & Don'ts, and marketing trap warnings.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                      const targetGuideCategory = 
                          selectedCategory.includes('Smartphones') ? 'Smartphones' :
                          selectedCategory.includes('Laptops') ? 'Laptops' :
                          selectedCategory.includes('Audio') ? 'Audio & Headphones' :
                          selectedCategory.includes('Kitchen') ? 'Home & Kitchen' :
                          selectedCategory.includes('Fitness') ? 'Smartwatches & Wearables' :
                          selectedCategory.includes('Fashion') ? 'Fashion & Lifestyle' :
                          selectedCategory !== 'All' ? selectedCategory : 'Smartphones';
                      onOpenGuides(targetGuideCategory);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-white dark:bg-[#12182B] text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-all cursor-pointer whitespace-nowrap shadow-xs hover:scale-102"
                >
                  <span>Read Buying Guide</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Advisors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAdvisors.map((advisor) => (
                <motion.div
                  key={advisor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-150 ease-out flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Header: Avatar, Status, Name, Badge */}
                    <div className="flex items-start gap-3.5">
                      <div className="relative shrink-0">
                        <img 
                          src={advisor.avatar} 
                          alt={advisor.name} 
                          className="h-14 w-14 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-700 shadow-sm"
                        />
                        {advisor.isOnline ? (
                          <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111827]" title="Online Now"/>
                        ) : (
                          <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-slate-400 border-2 border-white dark:border-[#111827]" title="Offline"/>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                            {advisor.name}
                          </h3>
                          <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 shrink-0"/>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold line-clamp-1">
                          {advisor.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center text-amber-500 text-[11px] font-black">
                            <Star className="h-3 w-3 fill-amber-500 mr-0.5"/>
                            <span>{advisor.rating}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">
                            ({advisor.consultationsCount} consultations)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Category Tag & Credential */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {advisor.category && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800">
                          {advisor.category}
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {advisor.experienceYears}+ yrs testing
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed line-clamp-2">
                      {advisor.bio}
                    </p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1">
                      {advisor.specialties.slice(0, 3).map((spec, sIdx) => (
                        <span key={sIdx} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer: Pricing & Action Buttons */}
                  <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Quick Advice</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          ₹{advisor.chatRateINR} <span className="text-[10px] text-slate-400 font-medium">/ chat</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">1:1 Video Audit</span>
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                          ₹{advisor.hourlyRateINR} <span className="text-[10px] text-slate-400 font-medium">/ 30 min</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setActiveExpertForChat(advisor)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-black transition-colors cursor-pointer"
                      >
                        <MessageSquare className="h-3.5 w-3.5"/>
                        <span>Quick Chat</span>
                      </button>

                      <button
                        onClick={() => setActiveExpertForBooking(advisor)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <Video className="h-3.5 w-3.5 text-amber-300"/>
                        <span>Book 1:1</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          /* My Sessions Tab */
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Your Scheduled Advice Sessions
            </h2>
            {userSessions.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
                <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3"/>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No scheduled sessions yet.</p>
                <p className="text-xs text-slate-500 mt-1">Book an advisor above to get personalized 1:1 buying guidance.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userSessions.map((session) => (
                  <div key={session.id} className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <img src={session.expertAvatar} alt={session.expertName} className="h-12 w-12 rounded-xl object-cover"/>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">{session.expertName}</h4>
                        <p className="text-xs text-slate-500">{session.topic}</p>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
                          🕒 {session.timeSlot}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={session.meetingUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Join Video Room
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3-Minute Free Spec Audit Modal */}
        {showAuditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#11172A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-left relative">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                Request Free 3-Minute Product Spec Audit
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
                Our category advisors will review your intended product and confirm if it's worth your money or if a better alternative exists.
              </p>

              {auditSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto"/>
                  <h4 className="text-sm font-black text-emerald-800 dark:text-emerald-200">Spec Audit Dispatched!</h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    An available category advisor will review this and send feedback shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitAudit} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Product Name or Model
                    </label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. MacBook Air M3 16GB, or Philips HD9252 Air Fryer" 
                      value={auditDeviceName}
                      onChange={(e) => setAuditDeviceName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Your Maximum Budget (₹)
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g. 65000" 
                      value={auditBudget}
                      onChange={(e) => setAuditBudget(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      What is your main use case? (Optional)
                    </label>
                    <textarea 
                      placeholder="e.g. Daily coding with Docker, or heavy outdoor photography" 
                      value={auditNotes}
                      onChange={(e) => setAuditNotes(e.target.value)}
                      rows={2}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAuditModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-md shadow-indigo-500/20"
                    >
                      Submit Audit
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Existing Modals */}
        {activeExpertForChat && (
          <ExpertChatModal 
            expert={activeExpertForChat} 
            onClose={() => setActiveExpertForChat(null)} 
          />
        )}

        {activeExpertForBooking && (
          <ExpertBookingModal 
            expert={activeExpertForBooking} 
            onClose={() => setActiveExpertForBooking(null)} 
            onBookingConfirmed={handleBookingConfirmed} 
          />
        )}

        {showApplyModal && (
          <ExpertApplicationModal 
            onClose={() => setShowApplyModal(false)} 
          />
        )}

      </div>
    );
};

export const AdvisorsHub = ExpertHub;
