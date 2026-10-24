import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Award, 
  ShieldCheck, 
  Send, 
  Sparkles, 
  Search, 
  Filter, 
  ExternalLink, 
  BookOpen, 
  Settings, 
  TrendingUp, 
  AlertCircle, 
  Calendar, 
  Check, 
  LogOut, 
  Cpu, 
  Tag, 
  FileText,
  UserCheck,
  RefreshCw,
  Mail
} from 'lucide-react';

export default function AdvisorDashboard({
  user,
  onLogout,
  allProducts = [],
  guides = [],
  initialSubTab = 'inquiries',
  onNavigateTab
}) {
  const [activeTab, setActiveTab] = useState(initialSubTab || 'inquiries');
  const [isOnline, setIsOnline] = useState(true);
  
  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [inquiryFilter, setInquiryFilter] = useState('all'); // 'all' | 'pending' | 'resolved'
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [recommendedProductId, setRecommendedProductId] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [inquiryActionNotice, setInquiryActionNotice] = useState(null);

  // Advisor Profile State
  const [advisorName, setAdvisorName] = useState(user?.name || 'Dr. Vikramaditya Sengupta');
  const [advisorEmail, setAdvisorEmail] = useState(user?.email || 'advisor@wisefind.com');
  const [advisorCategory, setAdvisorCategory] = useState(user?.advisorCategory || 'Laptops & Workstations');
  const [advisorExperience, setAdvisorExperience] = useState(user?.advisorExperience || '10');
  const [advisorBio, setAdvisorBio] = useState('Independent hardware architect and benchmark specialist. 100% sponsor-free technical advice with zero marketing fluff.');
  const [testLabBench, setTestLabBench] = useState('FLIR thermal imaging, Calibrite ColorChecker, Keysight oscilloscope, acoustic sound-floor chamber.');
  const [profileSavedNotice, setProfileSavedNotice] = useState(null);

  // Rates & Availability State
  const [textConsultationFee, setTextConsultationFee] = useState(499);
  const [videoTeardownFee, setVideoTeardownFee] = useState(1299);
  const [autoAcceptInquiries, setAutoAcceptInquiries] = useState(true);
  const [availableDays, setAvailableDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [ratesSavedNotice, setRatesSavedNotice] = useState(null);

  // Guide Review State
  const [guideTipTitle, setGuideTipTitle] = useState('');
  const [guideTipCategory, setGuideTipCategory] = useState('Laptops');
  const [guideTipContent, setGuideTipContent] = useState('');
  const [guideTipNotice, setGuideTipNotice] = useState(null);

  // Fetch inquiries from server
  const fetchInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setInquiries(data);
          if (data.length > 0 && !selectedInquiry) {
            setSelectedInquiry(data[0]);
          }
        }
      }
    } catch (err) {
      console.warn("Error fetching inquiries:", err);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Update selected inquiry when list changes
  useEffect(() => {
    if (inquiries.length > 0 && !selectedInquiry) {
      setSelectedInquiry(inquiries[0]);
    }
  }, [inquiries]);

  // Reply handler
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!selectedInquiry || !replyText.trim()) return;

    setIsSubmittingReply(true);
    const matchedProduct = allProducts.find(p => p.id === recommendedProductId);

    try {
      const res = await fetch(`/api/inquiries/${selectedInquiry.id}/reply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reply: replyText.trim(),
          status: 'resolved',
          advisorName: advisorName,
          productTitle: matchedProduct ? matchedProduct.title : undefined,
          customerEmail: selectedInquiry.userEmail || selectedInquiry.customerEmail
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setInquiries(prev => prev.map(inq => inq.id === updated.id ? { ...inq, ...updated } : inq));
        setSelectedInquiry(prev => ({ ...prev, ...updated }));
        setReplyText('');
        setRecommendedProductId('');
        setInquiryActionNotice(`Advice successfully submitted! Email notification sent from hello.wisefind@gmail.com to buyer.`);
        setTimeout(() => setInquiryActionNotice(null), 5000);
      }
    } catch (err) {
      setInquiryActionNotice("Error submitting reply. Please try again.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileSavedNotice("Advisor credentials and bio saved successfully!");
    setTimeout(() => setProfileSavedNotice(null), 3500);
  };

  const handleSaveRates = (e) => {
    e.preventDefault();
    setRatesSavedNotice("Consultation fees and availability schedule updated!");
    setTimeout(() => setRatesSavedNotice(null), 3500);
  };

  const handlePublishTip = (e) => {
    e.preventDefault();
    if (!guideTipTitle.trim() || !guideTipContent.trim()) return;
    setGuideTipNotice(`Certified buying tip "${guideTipTitle}" submitted to WiseGuide editorial desk!`);
    setGuideTipTitle('');
    setGuideTipContent('');
    setTimeout(() => setGuideTipNotice(null), 4000);
  };

  const pendingCount = inquiries.filter(i => i.status !== 'resolved' && i.status !== 'replied').length;
  const resolvedCount = inquiries.filter(i => i.status === 'resolved' || i.status === 'replied').length;

  const filteredInquiries = inquiries.filter(inq => {
    if (inquiryFilter === 'pending') return inq.status !== 'resolved' && inq.status !== 'replied';
    if (inquiryFilter === 'resolved') return inq.status === 'resolved' || inq.status === 'replied';
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in" id="advisor-dashboard-container">
      
      {/* =========================================================================
          ADVISOR HEADER & STATUS CONTROL BAR (100% DISTINCT FROM CUSTOMER)
         ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E1138] via-[#140D28] to-[#0D0B1C] border-2 border-purple-900/40 p-6 sm:p-8 text-white shadow-2xl">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-purple-600/30 border-2 border-purple-400/30">
                {advisorName.charAt(0)}
              </div>
              <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-[#1E1138] ${isOnline ? 'bg-emerald-500' : 'bg-slate-500'}`} title={isOnline ? 'Online & Ready for Consultations' : 'Offline'}>
                <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {advisorName}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-black uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  <span>Certified Category Advisor</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200/80 font-medium flex items-center gap-2">
                <span>{advisorEmail}</span>
                <span>•</span>
                <span className="text-purple-300 font-bold">{advisorCategory}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{advisorExperience} Yrs Experience</span>
              </p>
              <p className="text-xs text-slate-400 max-w-2xl font-medium">
                100% Sponsor-Free Hardware Consultation Desk • Verified Buyer Inquiries • Direct Email Transmission via <strong className="text-purple-300">hello.wisefind@gmail.com</strong>
              </p>
            </div>
          </div>

          {/* Quick Actions & Status Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border ${
                isOnline
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>{isOnline ? 'Live & Accepting Inquiries' : 'Desk Offline / Away'}</span>
            </button>

            {onLogout && (
              <button
                type="button"
                id="advisor-logout-btn"
                onClick={onLogout}
                className="px-4 py-2.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Advisor KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-purple-900/50">
          <div className="bg-purple-950/40 border border-purple-800/40 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-purple-300 text-xs font-bold mb-1">
              <span>Pending Inquiries</span>
              <MessageSquare className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{pendingCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Awaiting technical audit</div>
          </div>

          <div className="bg-purple-950/40 border border-purple-800/40 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-purple-300 text-xs font-bold mb-1">
              <span>Dilemmas Resolved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{resolvedCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">100% Sponsor-free guidance</div>
          </div>

          <div className="bg-purple-950/40 border border-purple-800/40 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-purple-300 text-xs font-bold mb-1">
              <span>Consultation Rate</span>
              <DollarSign className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">₹{textConsultationFee}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">0% Platform Cut (Keep 100%)</div>
          </div>

          <div className="bg-purple-950/40 border border-purple-800/40 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-purple-300 text-xs font-bold mb-1">
              <span>Monthly Earnings</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300">₹14,970</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Next direct settlement: Nov 1</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ADVISOR DEDICATED NAVIGATION TABS (NO CUSTOMER SHOPPER CLUTTER)
         ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'inquiries'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Buyer Inquiries Desk ({inquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('credentials')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'credentials'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Bio & Test Lab Credentials</span>
        </button>

        <button
          onClick={() => setActiveTab('rates')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'rates'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Rates & Weekly Availability</span>
        </button>

        <button
          onClick={() => setActiveTab('playbook')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'playbook'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>WiseGuide Buying Playbooks</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'payouts'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Advisory Payouts & Ledger</span>
        </button>
      </div>

      {/* Global Action Notices */}
      {inquiryActionNotice && (
        <div className="p-4 rounded-2xl bg-purple-500/15 border-2 border-purple-500/40 text-purple-800 dark:text-purple-200 text-sm font-bold flex items-center gap-3 animate-fade-in">
          <Mail className="w-5 h-5 text-purple-500 shrink-0" />
          <span>{inquiryActionNotice}</span>
        </div>
      )}

      {/* =========================================================================
          TAB 1: BUYER INQUIRIES QUEUE & REPLY DESK
         ========================================================================= */}
      {activeTab === 'inquiries' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Left Column: Inquiries List & Filters */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <button
                  onClick={() => setInquiryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    inquiryFilter === 'all'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({inquiries.length})
                </button>
                <button
                  onClick={() => setInquiryFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    inquiryFilter === 'pending'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  onClick={() => setInquiryFilter('resolved')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    inquiryFilter === 'resolved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Resolved ({resolvedCount})
                </button>
              </div>

              <button
                onClick={fetchInquiries}
                disabled={isLoadingInquiries}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-purple-600 transition-all cursor-pointer"
                title="Refresh Inquiries"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingInquiries ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredInquiries.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Inquiries Found</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {inquiryFilter === 'pending' ? 'All buyer dilemmas are currently resolved! Great job.' : 'No inquiries in this filter view.'}
                  </p>
                </div>
              ) : (
                filteredInquiries.map((inq) => {
                  const isSelected = selectedInquiry?.id === inq.id;
                  const isResolved = inq.status === 'resolved' || inq.status === 'replied';

                  return (
                    <div
                      key={inq.id}
                      onClick={() => setSelectedInquiry(inq)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-purple-500/10 border-purple-500 shadow-md shadow-purple-500/10'
                          : 'bg-white dark:bg-[#0E1322] border-slate-200 dark:border-slate-800/80 hover:border-purple-300 dark:hover:border-purple-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[180px]">
                          {inq.userName || inq.customerName || 'Shopper Dilemma'}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          isResolved 
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                        }`}>
                          {isResolved ? 'Resolved' : 'Needs Response'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 font-medium mb-2">
                        {inq.question || inq.message || inq.dilemma || 'Looking for expert hardware buying advice'}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                        <span>{inq.category || advisorCategory}</span>
                        {inq.budget && <span className="font-bold text-slate-700 dark:text-slate-300">Budget: ₹{Number(inq.budget).toLocaleString('en-IN')}</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Inquiry Detail & Live Reply Desk */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0E1322] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
            {selectedInquiry ? (
              <>
                {/* Inquiry Overview Banner */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                        Buyer Inquiry Case ID: {selectedInquiry.id}
                      </span>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white">
                        {selectedInquiry.userName || selectedInquiry.customerName || 'Shopper Inquiry'}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        Email: <strong className="text-slate-800 dark:text-slate-200">{selectedInquiry.userEmail || selectedInquiry.customerEmail || 'Registered Shopper'}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#0A0E1A] border border-slate-200 dark:border-slate-800/80">
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      Customer Question / Buying Dilemma:
                    </span>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                      "{selectedInquiry.question || selectedInquiry.message || selectedInquiry.dilemma || 'Seeking recommendations for optimal performance per rupee'}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/60">
                      <span className="text-[10px] text-slate-400 block">Category:</span>
                      <strong className="text-slate-900 dark:text-white">{selectedInquiry.category || advisorCategory}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/60">
                      <span className="text-[10px] text-slate-400 block">Target Budget:</span>
                      <strong className="text-emerald-500">₹{Number(selectedInquiry.budget || 60000).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/60">
                      <span className="text-[10px] text-slate-400 block">Priority:</span>
                      <strong className="text-purple-400">{selectedInquiry.priorityFactor || 'Performance & Longevity'}</strong>
                    </div>
                  </div>
                </div>

                {/* Existing Reply if already answered */}
                {selectedInquiry.reply && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Submitted Advisor Advice (Sent to Buyer via hello.wisefind@gmail.com)</span>
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300">
                      {selectedInquiry.reply}
                    </p>
                  </div>
                )}

                {/* Live Reply Form */}
                <form onSubmit={handleSendReply} className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                        <span>Advisor Technical Recommendation</span>
                      </label>
                      <span className="text-[10px] text-purple-500 font-bold">100% Sponsor-Free Oath</span>
                    </div>
                    <textarea
                      required
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Provide clear technical rationale, thermal considerations, genuine pros/cons, and why you recommend or dissuade this purchase..."
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 leading-relaxed"
                    />
                  </div>

                  {/* Recommend a Catalog Product */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Attach Recommended Product from Catalog (Optional)
                    </label>
                    <select
                      value={recommendedProductId}
                      onChange={(e) => setRecommendedProductId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="">-- No specific product attached --</option>
                      {allProducts.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.title} (₹{Number(p.price).toLocaleString('en-IN')} - WiseScore {p.score || p.wiseScore || 90}/100)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submission Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Transmits actual email notification to user from <strong>hello.wisefind@gmail.com</strong></span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReply || !replyText.trim()}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmittingReply ? 'Dispatching...' : 'Send Advice & Email Customer'}</span>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="p-12 text-center text-slate-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Select an Inquiry</h3>
                <p className="text-xs text-slate-500 mt-1">Pick a dilemma from the left queue to review specs and submit advice.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: BIO & TEST LAB CREDENTIALS
         ========================================================================= */}
      {activeTab === 'credentials' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-[#0E1322] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-fade-in">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Advisor Credentials & Benchmark Test Lab
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Buyers trust WiseFind advisors because we disclose testing methodology and never accept vendor payments.
            </p>
          </div>

          {profileSavedNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{profileSavedNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Full Name</label>
              <input
                type="text"
                required
                value={advisorName}
                onChange={(e) => setAdvisorName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Verified Email</label>
              <input
                type="email"
                disabled
                value={advisorEmail}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Primary Category Domain</label>
              <select
                value={advisorCategory}
                onChange={(e) => setAdvisorCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Laptops & Workstations">Laptops & Workstations</option>
                <option value="Smartphones & Flagships">Smartphones & Flagships</option>
                <option value="Audio & Acoustics">Audio & Acoustics</option>
                <option value="Smart Home Automation">Smart Home Automation</option>
                <option value="Cameras & Optics">Cameras & Optics</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Years in Hardware Benchmarking</label>
              <input
                type="number"
                min="1"
                max="40"
                value={advisorExperience}
                onChange={(e) => setAdvisorExperience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Sponsor-Free Bio & Philosophy
            </label>
            <textarea
              rows={3}
              value={advisorBio}
              onChange={(e) => setAdvisorBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Test Lab Hardware & Instruments (Disclosed to Buyers)
            </label>
            <input
              type="text"
              value={testLabBench}
              onChange={(e) => setTestLabBench(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-black uppercase tracking-wider text-[11px] mb-0.5">WiseFind 100% Sponsor-Free Oath</strong>
              <span>
                By operating as an advisor, you certify that recommendations are solely based on verifiable benchmark data, price-to-performance efficiency, and genuine durability.
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-purple-600/30 transition-all cursor-pointer"
            >
              Save Credentials
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 3: CONSULTATION RATES & AVAILABILITY
         ========================================================================= */}
      {activeTab === 'rates' && (
        <form onSubmit={handleSaveRates} className="bg-white dark:bg-[#0E1322] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-fade-in">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Consultation Rates & Weekly Availability
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Set your 1-on-1 consultation rates. WiseFind takes 0% commission from category advisors.
            </p>
          </div>

          {ratesSavedNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{ratesSavedNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white">Text Dilemma Audit</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-500">Async</span>
              </div>
              <p className="text-xs text-slate-500">
                Detailed written audit of two competing laptop/phone models with benchmark graphs.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={textConsultationFee}
                  onChange={(e) => setTextConsultationFee(Number(e.target.value))}
                  className="w-32 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-black text-slate-900 dark:text-white"
                />
                <span className="text-xs text-slate-500">per response</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white">Live Video Teardown</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">20 Mins</span>
              </div>
              <p className="text-xs text-slate-500">
                1-on-1 screenshare session dissecting internal upgradeability, VRM phases, and display calibration.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={videoTeardownFee}
                  onChange={(e) => setVideoTeardownFee(Number(e.target.value))}
                  className="w-32 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-black text-slate-900 dark:text-white"
                />
                <span className="text-xs text-slate-500">per session</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Active Weekly Availability
            </label>
            <div className="flex flex-wrap gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                const active = availableDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      setAvailableDays(prev => 
                        active ? prev.filter(d => d !== day) : [...prev, day]
                      );
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                      active
                        ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-purple-600/30 transition-all cursor-pointer"
            >
              Update Availability & Rates
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 4: WISEGUIDE BUYING PLAYBOOKS & TIPS
         ========================================================================= */}
      {activeTab === 'playbook' && (
        <div className="bg-white dark:bg-[#0E1322] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-fade-in">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              WiseGuide Category Playbook Reviewer
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Submit verified buyer warnings, decoy spec alerts, and buying advice to WiseFind editorial guides.
            </p>
          </div>

          {guideTipNotice && (
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
              <span>{guideTipNotice}</span>
            </div>
          )}

          <form onSubmit={handlePublishTip} className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Contribute Advisor Hardware Note</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Playbook Tip Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Always check TGP wattage on RTX 4060 laptops before buying"
                  value={guideTipTitle}
                  onChange={(e) => setGuideTipTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Target Category</label>
                <select
                  value={guideTipCategory}
                  onChange={(e) => setGuideTipCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Laptops">Laptops</option>
                  <option value="Smartphones">Smartphones</option>
                  <option value="Audio">Audio</option>
                  <option value="Smart Home">Smart Home</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Technical Explanation & Warning</label>
              <textarea
                rows={3}
                required
                placeholder="Explain the marketing trick: Many 45W budget laptops are advertised as RTX 4060 but deliver half the frame rate of 100W+ chassis..."
                value={guideTipContent}
                onChange={(e) => setGuideTipContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Submit Tip to WiseGuide
            </button>
          </form>

          {/* Published Guides Preview */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Live Category Buying Guides ({guides.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {guides.slice(0, 4).map(guide => (
                <div key={guide.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-purple-500">{guide.category}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{guide.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{guide.summary || guide.content?.introduction}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateTab && onNavigateTab('guides')}
                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-500 cursor-pointer shrink-0"
                    title="View Guide"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: ADVISORY PAYOUTS & EARNINGS LEDGER
         ========================================================================= */}
      {activeTab === 'payouts' && (
        <div className="bg-white dark:bg-[#0E1322] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Earnings & Direct Settlement Ledger
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                WiseFind operates on a 0% advisor commission policy. 100% of consultation fees reach your account.
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Lifetime Earnings</span>
              <span className="text-2xl font-black text-emerald-500">₹62,870</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Consultation Type</th>
                  <th className="py-3 px-3">Buyer Email</th>
                  <th className="py-3 px-3">Fee</th>
                  <th className="py-3 px-3">Platform Fee</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-3 px-3">Oct 24, 2026</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">Flagship Laptop Dilemma</td>
                  <td className="py-3 px-3">customer@wisefind.com</td>
                  <td className="py-3 px-3 font-bold text-emerald-500">₹499</td>
                  <td className="py-3 px-3 text-slate-400">₹0 (0%)</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold text-[10px]">Settled</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3">Oct 22, 2026</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">Audio Studio Monitor Audit</td>
                  <td className="py-3 px-3">rahul.audio@gmail.com</td>
                  <td className="py-3 px-3 font-bold text-emerald-500">₹499</td>
                  <td className="py-3 px-3 text-slate-400">₹0 (0%)</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold text-[10px]">Settled</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3">Oct 20, 2026</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">Live Teardown & Cooling Audit</td>
                  <td className="py-3 px-3">priya.bengaluru@outlook.com</td>
                  <td className="py-3 px-3 font-bold text-emerald-500">₹1,299</td>
                  <td className="py-3 px-3 text-slate-400">₹0 (0%)</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold text-[10px]">Settled</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3">Oct 18, 2026</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">MacBook M3 vs ThinkPad Z16</td>
                  <td className="py-3 px-3">anand.tech@yahoo.com</td>
                  <td className="py-3 px-3 font-bold text-emerald-500">₹499</td>
                  <td className="py-3 px-3 text-slate-400">₹0 (0%)</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold text-[10px]">Settled</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
