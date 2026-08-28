import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ShieldCheck, Sparkles, CheckCircle2, User, Mail, Award, Link, Send } from 'lucide-react';

interface ExpertApplicationModalProps {
  onClose: () => void;
}

export const ExpertApplicationModal: React.FC<ExpertApplicationModalProps> = ({ onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    primaryDomain: 'Laptops & Workstations',
    yearsExperience: '5',
    portfolioUrl: '',
    bio: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden relative"
      >
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/20 text-cyan-400 rounded-xl border border-cyan-400/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300 block">Verified Experts Network</span>
              <h3 className="font-extrabold text-white text-base">Apply to Join WiseFind Reviewers</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Are you a tech reviewer, acoustic engineer, or hardware enthusiast? Share your objective advice 1:1 with tech buyers across India and set your own consultation rates.
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Vikramaditya Roy"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">Primary Specialization</label>
                <select
                  value={formData.primaryDomain}
                  onChange={(e) => setFormData({ ...formData, primaryDomain: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option>Laptops & Workstations</option>
                  <option>Smartphones & Mobile Tech</option>
                  <option>Audiophile & Sound Engineering</option>
                  <option>Mechanical Keyboards</option>
                  <option>Gaming PCs & GPUs</option>
                  <option>Cameras & Content Gear</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">Portfolio / Review Channel / LinkedIn URL</label>
              <input
                type="url"
                placeholder="https://youtube.com/@yourchannel or https://linkedin.com/in/..."
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">Hardware Philosophy & Experience Summary</label>
              <textarea
                rows={3}
                placeholder="Briefly describe your hardware evaluation background, benchmark setup, and why you value unbiased tech advice..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4 text-cyan-400" />
              <span>Submit Reviewer Credentials</span>
            </button>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="h-16 w-16 bg-cyan-100 border-2 border-cyan-300 rounded-full flex items-center justify-center text-primary mx-auto">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Application Under Verification</h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-sm mx-auto">
              Thank you, {formData.fullName}! Our hardware verification board will review your credentials and reach out to {formData.email} within 24-48 hours to onboard you into the WiseFind Verified Expert Network.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow"
            >
              Back to Expert Directory
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
