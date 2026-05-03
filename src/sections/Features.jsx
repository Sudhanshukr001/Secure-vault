import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ShieldCheck, Database, KeyRound, Zap, EyeOff, Globe2 } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: "AES-256-GCM Encryption",
    desc: "The same encryption standard used by financial institutions and governments globally."
  },
  {
    icon: Database,
    title: "Zero-Knowledge Architecture",
    desc: "We cannot see your data. Everything is encrypted on your device before upload."
  },
  {
    icon: KeyRound,
    title: "PBKDF2 Key Derivation",
    desc: "Passwords are salted and hashed 100,000 times to prevent brute-force attacks."
  },
  {
    icon: Zap,
    title: "WebCrypto API Performance",
    desc: "Hardware-accelerated cryptography running natively in your browser."
  },
  {
    icon: EyeOff,
    title: "Ephemeral Sessions",
    desc: "Keys exist only in your browser's memory and vanish upon page reload."
  },
  {
    icon: Globe2,
    title: "Offline Capable",
    desc: "Once loaded, the app works entirely offline. No internet connection required."
  }
];

const Features = () => {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Security by Design
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            We don't trust servers. We trust mathematics. SecureVault is built on verifiable, open standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-8 rounded-2xl group hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-primary/30"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;