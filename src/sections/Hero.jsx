import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Shield, Lock, ChevronRight, FileLock } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-10 pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        
        {/* Modern Pill Badge */}
        <Motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-8 hover:bg-white/10 transition-colors cursor-default"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_10px_#10b981]"></span>
          <span className="text-xs text-slate-300 font-medium tracking-wide uppercase">Zero-Trust Environment</span>
        </Motion.div>

        {/* Headline */}
        <Motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-8xl font-bold tracking-tight mb-8 text-white"
        >
          Privacy is not <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">
             an option.
          </span>
        </Motion.h1>

        {/* Subtext */}
        <Motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          SecureVault uses client-side <strong>AES-256-GCM</strong> encryption. 
          Your data is encrypted before it ever leaves your device. 
          We have zero knowledge of your files or keys.
        </Motion.p>

        {/* Buttons */}
        <Motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          {/* Primary Shimmer Button */}
          <Link to="/encrypt">
            <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-dark-900 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-all hover:bg-dark-800">
                <Lock className="w-4 h-4 mr-2 text-primary" /> Start Encrypting
              </span>
            </button>
          </Link>
          
          <Link to="/decrypt">
            <button className="px-8 py-3 rounded-full text-slate-300 font-medium hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 group border border-transparent hover:border-white/10">
              <FileLock className="w-4 h-4" />
              Decrypt File
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </button>
          </Link>
        </Motion.div>
      </div>
    </section>
  );
};

export default Hero;