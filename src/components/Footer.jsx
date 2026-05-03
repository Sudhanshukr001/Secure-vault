import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-dark-900 mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/5 rounded-lg">
              <Shield className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-sm text-slate-500">
              © {new Date().getFullYear()} SecureVault. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Documentation</span>
            
            <div className="pl-6 border-l border-white/10">
              <span className="text-slate-600">Developed by </span>
              <span className="text-slate-300 font-semibold hover:text-primary transition-colors cursor-default">
                Sudhanshu Kumar
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;