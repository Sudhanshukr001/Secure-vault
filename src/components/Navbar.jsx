import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Menu, X, Lock, Unlock, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Encrypt', path: '/encrypt', icon: Lock },
    { name: 'Decrypt', path: '/decrypt', icon: Unlock },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 transition-all duration-300 ${scrolled ? 'bg-dark-900/80 shadow-2xl' : 'bg-transparent border-transparent'}`}>
          
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="bg-primary p-1.5 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Secure<span className="text-slate-400 font-light">Vault</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    location.pathname === link.path 
                      ? 'text-white bg-white/10' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    {link.icon && <link.icon className="w-3.5 h-3.5" />}
                    <span>{link.name}</span>
                  </span>
                </Link>
              ))}
            </div>
            
            <div className="hidden md:block">
              <Link to="/dashboard">
                <button className="bg-white text-dark-900 hover:bg-slate-200 px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Console
                </button>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white">
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-4 right-4 bg-dark-800/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-3"
                >
                  {link.icon && <link.icon className="w-5 h-5 text-primary" />}
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="px-4 py-3 text-center bg-primary rounded-xl text-white font-bold">
                Go to Console
              </Link>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
