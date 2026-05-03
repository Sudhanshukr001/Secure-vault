import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Shield, Lock, Unlock, Activity, Cpu, Wifi, Globe, ServerCog, HardDrive, FileKey } from 'lucide-react';

const StatCard = ({ icon, label, value, subtext }) => {
  const Icon = icon;

  return (
    <Motion.div 
      whileHover={{ y: -2 }}
      className="glass-panel p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-primary/10 transition-colors">
          <Icon className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
        </div>
        <span className="flex h-2 w-2 rounded-full bg-success shadow-[0_0_8px_#10b981]"></span>
      </div>
      <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{label}</h3>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-slate-500">{subtext}</p>
    </Motion.div>
  );
};

const Dashboard = () => {
  return (
    <div className="py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Console</h1>
          <p className="text-slate-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            System Status: <span className="text-success font-mono">OPERATIONAL</span>
          </p>
        </div>
        <div className="flex items-center space-x-3 text-sm font-mono text-slate-500 bg-dark-800 px-4 py-2 rounded-lg border border-white/5">
          <Globe className="w-4 h-4" />
          <span>ENCRYPTION_ENGINE_V2.0</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Shield} 
          label="Protocol" 
          value="AES-256-GCM" 
          subtext="NIST Approved Standard" 
        />
        <StatCard 
          icon={Cpu} 
          label="Hashing" 
          value="PBKDF2" 
          subtext="SHA-256 / 100k Iterations" 
        />
        <StatCard 
          icon={Wifi} 
          label="Connectivity" 
          value="Offline Mode" 
          subtext="Zero External Requests" 
        />
        <StatCard 
          icon={ServerCog} 
          label="Session Memory" 
          value="Volatile" 
          subtext="Cleared on Refresh" 
        />
      </div>

      {/* Main Operations Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions (Wide) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-slate-400" />
            Active Operations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/encrypt" className="group">
              <div className="glass-panel p-6 rounded-xl border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-all h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Lock className="w-32 h-32 text-primary" />
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Encrypt New Asset</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Secure documents or images using client-side encryption. Generates a .secure file.
                  </p>
                  <span className="text-primary text-sm font-medium group-hover:underline">Launch Protocol &rarr;</span>
                </div>
              </div>
            </Link>

            <Link to="/decrypt" className="group">
              <div className="glass-panel p-6 rounded-xl border border-white/5 hover:border-secondary/30 hover:bg-white/5 transition-all h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Unlock className="w-32 h-32 text-secondary" />
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                    <Unlock className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Decrypt Asset</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Restore access to secured files using your password or visual key image.
                  </p>
                  <span className="text-secondary text-sm font-medium group-hover:underline">Launch Protocol &rarr;</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* System Logs / Info (Sidebar) */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileKey className="w-5 h-5 text-slate-400" />
            Architecture Overview
          </h2>
          
          <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-6">
            <div className="flex gap-4">
              <div className="w-1 h-full bg-gradient-to-b from-primary to-transparent rounded-full min-h-[40px]"></div>
              <div>
                <h4 className="text-sm font-bold text-white">Browser Sandbox</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Cryptographic operations are isolated within the <code className="text-primary bg-primary/10 px-1 rounded">window.crypto</code> subsystem.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1 h-full bg-gradient-to-b from-secondary to-transparent rounded-full min-h-[40px]"></div>
              <div>
                <h4 className="text-sm font-bold text-white">Visual Cryptography</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Image-based key derivation uses raw byte hashing to generate entropy for the master key.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1 h-full bg-gradient-to-b from-success to-transparent rounded-full min-h-[40px]"></div>
              <div>
                <h4 className="text-sm font-bold text-white">No-Log Policy</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Serverless architecture ensures no data footprints, metadata, or access logs are generated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
