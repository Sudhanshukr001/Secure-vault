import React from 'react';
import { Upload, FileKey, Download } from 'lucide-react';

const steps = [
  {
    id: '01',
    title: "Upload",
    desc: "Select any file from your local device.",
    icon: Upload
  },
  {
    id: '02',
    title: "Encrypt",
    desc: "Client-side processing with your key.",
    icon: FileKey
  },
  {
    id: '03',
    title: "Secure",
    desc: "Download the encrypted artifact.",
    icon: Download
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white">Workflow</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"></div>

          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col md:items-start group">
              <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center mb-6 border border-white/10 shadow-lg group-hover:border-primary/50 transition-colors">
                <step.icon className="w-8 h-8 text-white group-hover:text-primary transition-colors" strokeWidth={1.5} />
              </div>
              <div className="text-xs font-mono text-primary mb-2 tracking-wider">STEP {step.id}</div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;