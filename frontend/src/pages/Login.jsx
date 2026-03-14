import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, GraduationCap, Sparkles, BookOpen, Globe } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(); // Trigger authentication state change in App.jsx
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-slate-950 overflow-hidden font-inter">
      {/* Left Decoration Column */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 border-r border-slate-800 relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-transparent opacity-50"></div>
        
        <div className="flex items-center gap-3 relative z-10 animate-in slide-in-from-left-4 duration-700">
           <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
             <ShieldCheck className="w-7 h-7 text-white" />
           </div>
           <span className="text-2xl font-black text-white tracking-tight">DetectPro AI</span>
        </div>

        <div className="relative z-10 space-y-12 animate-in slide-in-from-bottom-8 duration-1000">
           <div className="space-y-4">
              <h2 className="text-6xl font-black text-white leading-tight">
                Empowering <br />
                <span className="text-primary-500">Academic</span> <br />
                Integrity.
              </h2>
              <p className="text-xl text-slate-400 font-medium max-w-md leading-relaxed">
                The most advanced AI-powered platform for student paper formatting, plagiarism detection, and professional rewriting.
              </p>
           </div>

           <div className="grid grid-cols-2 gap-8 pr-12">
              <div className="space-y-3">
                 <div className="p-3 bg-white/5 rounded-2xl w-fit border border-white/10 group-hover:border-primary-500/50 transition-colors">
                    <Sparkles className="w-6 h-6 text-primary-400" />
                 </div>
                 <h4 className="text-white font-black text-sm uppercase tracking-wider">Smart Rewriting</h4>
                 <p className="text-xs text-slate-500 font-bold leading-relaxed">AI suggestions to improve clarity and reduce similarity.</p>
              </div>
              <div className="space-y-3">
                 <div className="p-3 bg-white/5 rounded-2xl w-fit border border-white/10 group-hover:border-primary-500/50 transition-colors">
                    <Globe className="w-6 h-6 text-emerald-400" />
                 </div>
                 <h4 className="text-white font-black text-sm uppercase tracking-wider">Global Search</h4>
                 <p className="text-xs text-slate-500 font-bold leading-relaxed">Scans against 500K+ academic journals and textbooks.</p>
              </div>
           </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-8 opacity-40">
           <span className="text-xs font-bold text-white uppercase tracking-widest">Version 2.4-PRO</span>
           <div className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
           </div>
        </div>
      </div>

      {/* Right Login Column */}
      <div className="flex items-center justify-center p-8 lg:p-16 relative">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
           <div className="mb-12">
              <h3 className="text-4xl font-black mb-4">Log in to Campus</h3>
              <p className="text-lg text-slate-500 font-bold">Access your academic assistant and scan history.</p>
           </div>

           <form className="space-y-8" onSubmit={handleLogin}>
              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-slate-400 ml-1 underline decoration-primary-500/30 underline-offset-4">Academic Email</label>
                    <div className="relative group">
                       <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                       <input 
                         type="email" 
                         required
                         placeholder="e.g. j.doe@uni-global.edu"
                         className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-inner"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-slate-400 ml-1 underline decoration-primary-500/30 underline-offset-4">Secret Key</label>
                    <div className="relative group">
                       <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                       <input 
                         type="password" 
                         required
                         placeholder="••••••••••••"
                         className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-inner"
                       />
                    </div>
                 </div>
              </div>

              <div className="flex items-center justify-between px-2">
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary-500 focus:ring-primary-500 cursor-pointer" />
                    <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">Keep me signed in</span>
                 </label>
                 <button type="button" className="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot?</button>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-slate-950 dark:bg-primary-500 text-white rounded-[1.5rem] font-black text-base transition-all transform hover:scale-[1.03] active:scale-95 shadow-2xl shadow-slate-900/20 disabled:opacity-50 flex items-center justify-center gap-3 group"
              >
                {loading ? 'Opening Portal...' : 'Enter Academic Portal'}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
           </form>

           <div className="mt-12 text-center space-y-8">
              <div className="flex items-center gap-4">
                 <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Student?</span>
                 <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
              </div>
              
              <button className="w-full py-4 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] font-black text-sm text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                 <GraduationCap className="w-5 h-5 text-primary-500" />
                 Create Academic Account
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
