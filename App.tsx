import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Tools from './components/Tools';
import Features from './components/Features';
import Footer from './components/Footer';

const App: React.FC = () => {
  useEffect(() => {
    document.body.classList.add('fade-in');
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <Tools />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default App;