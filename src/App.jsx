import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Encrypt from './pages/Encrypt';
import Decrypt from './pages/Decrypt';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-dark-900 text-white selection:bg-primary selection:text-white">
        
        {/* Professional Grid Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid"></div>
          {/* Subtle Ambient Light - Top Center */}
          <div className="absolute top-[-20%] left-[20%] right-[20%] h-[500px] bg-primary/20 blur-[150px] rounded-full opacity-40"></div>
        </div>

        <Navbar />
        
        <main className="flex-grow relative z-10 pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/encrypt" element={<Encrypt />} />
            <Route path="/decrypt" element={<Decrypt />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;