import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChannelCard } from '@/components/home/ChannelCard';
import { TVPlayer } from '@/components/player/TVPlayer';
import { M3U_URLS, parseM3U, Channel } from '@/services/iptv';
import { useFocus } from '@/hooks/useFocus';
import { Toaster, toast } from 'sonner';
import { Loader2, Settings as SettingsIcon, Heart, History, Sparkles, LayoutGrid, Clock, ShieldCheck, Zap, Trophy, ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import './styles.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize focus listener
  useFocus(); 

  // Load all channels on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const all: Channel[][] = await Promise.all(
          M3U_URLS.map(source => parseM3U(source.url, source.name))
        );
        const flatChannels = all.flat();
        setChannels(flatChannels);
      } catch (e) {
        toast.error('Failed to load IPTV sources');
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };
    fetchAll();
  }, []);

  const filteredChannels = useMemo(() => {
    return channels.filter(c => {
      if (activeTab === 'home') return true;
      if (activeTab === 'sports') return ['Sports', 'Soccer', 'Basketball', 'Tennis', 'Motorsport', 'Combat', 'Combat Sports'].includes(c.category);
      if (activeTab === 'countries') return ['UK', 'USA', 'Spain', 'France', 'Italy'].includes(c.category);
      if (activeTab === 'favorites') return favorites.includes(c.id);
      return true;
    });
  }, [channels, activeTab, favorites]);

  // TV Navigation
  useEffect(() => {
    if (selectedChannel) return;
    
    const handleNav = (e: any) => {
      const { action } = e.detail;
      const columns = 5;

      if (action === 'right') setFocusedIndex(prev => Math.min(filteredChannels.length - 1, prev + 1));
      if (action === 'left') setFocusedIndex(prev => Math.max(0, prev - 1));
      if (action === 'down') setFocusedIndex(prev => Math.min(filteredChannels.length - 1, prev + columns));
      if (action === 'up') setFocusedIndex(prev => Math.max(0, prev - columns));
      
      if (action === 'enter' && filteredChannels[focusedIndex]) {
        setSelectedChannel(filteredChannels[focusedIndex]);
      }

      if (action === 'back') {
        if (selectedChannel) {
          setSelectedChannel(null);
        } else if (activeTab !== 'home') {
          setActiveTab('home');
        } else {
          // If at home, history back as requested
          window.history.back();
        }
      }
    };

    window.addEventListener('tv-navigation', handleNav);
    return () => window.removeEventListener('tv-navigation', handleNav);
  }, [focusedIndex, filteredChannels, selectedChannel, activeTab]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const element = scrollContainerRef.current.children[focusedIndex] as HTMLElement;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }
  }, [focusedIndex]);

  const handleBackAction = () => {
    if (selectedChannel) {
      setSelectedChannel(null);
    } else if (activeTab !== 'home') {
      setActiveTab('home');
    } else {
      window.history.back();
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-blue-950/20" />
        <div className="relative z-10 flex flex-col items-center gap-12">
           <div className="flex flex-col items-center">
             <h1 className="text-8xl font-black italic tracking-tighter text-white uppercase font-header">
               IBOX <span className="text-red-600">VVIP</span>
             </h1>
             <div className="h-1.5 w-40 bg-red-600 mt-4 rounded-full shadow-[0_0_25px_rgba(220,38,38,0.9)]" />
           </div>
           <div className="flex flex-col items-center gap-6">
             <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
             <p className="text-xs text-gray-400 font-black uppercase tracking-[0.6em] animate-pulse">
               System Initializing
             </p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-red-600/30">
      <Sidebar activeId={activeTab} onSelect={(id) => { setActiveTab(id); setFocusedIndex(0); }} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-red-600/10 blur-[200px] -mr-96 -mt-96 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-red-900/10 blur-[180px] -ml-48 -mb-48 pointer-events-none" />

        {/* Dynamic Header */}
        <header className="p-12 pb-6 flex justify-between items-end z-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBackAction}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-2xl border border-white/10 text-sm font-black uppercase tracking-widest transition-all text-red-500 hover:text-white group cursor-pointer"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              <div className="flex items-center gap-2 bg-red-600/20 border border-red-600/30 px-4 py-1.5 rounded-full">
                 <Sparkles size={16} className="text-red-500" />
                 <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-500">Premium VVIP</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-600/20 border border-blue-600/30 px-4 py-1.5 rounded-full">
                 <Zap size={16} className="text-blue-500" />
                 <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500">Fast Stream</span>
              </div>
            </div>
            <h2 className="text-7xl font-black uppercase italic tracking-tighter leading-none mt-2 font-header">
              {activeTab === 'home' ? 'IBOX VVIP' : activeTab}
            </h2>
            <div className="flex items-center gap-4 text-gray-500 text-xs font-bold mt-2 uppercase tracking-widest">
               <div className="flex items-center gap-2"><LayoutGrid size={16}/> {filteredChannels.length} Streams</div>
               <span className="w-1 h-1 rounded-full bg-gray-700" />
               <div className="flex items-center gap-2"><ShieldCheck size={16}/> Encrypted</div>
               <span className="w-1 h-1 rounded-full bg-gray-700" />
               <div className="flex items-center gap-2"><Clock size={16}/> Sync: OK</div>
            </div>
          </div>
          
          <div className="flex items-center gap-12">
             <div className="flex flex-col items-end">
                <p className="text-4xl font-black text-white leading-none tracking-tight font-header">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-[11px] uppercase tracking-[0.4em] font-black text-red-600 mt-2">Satellite Link</p>
             </div>
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-2xl shadow-red-600/40 border border-red-500/30 ring-4 ring-red-600/10">
                <SettingsIcon size={28} className="text-white" />
             </div>
          </div>
        </header>

        {/* Categories Bar */}
        <div className="px-12 py-6 z-10">
           <div className="flex gap-5">
              <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-8 py-3.5 rounded-2xl border border-white/5 text-sm font-black uppercase tracking-widest transition-all">
                <History size={18} /> History
              </button>
              <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-8 py-3.5 rounded-2xl border border-white/5 text-sm font-black uppercase tracking-widest transition-all">
                <Heart size={18} /> Favorites
              </button>
              <button 
                onClick={() => setActiveTab('sports')}
                className="flex items-center gap-3 bg-red-600 px-8 py-3.5 rounded-2xl border border-red-500 text-sm font-black italic uppercase tracking-widest transition-all shadow-2xl shadow-red-600/40 hover:scale-105 active:scale-95"
              >
                <Trophy size={18} /> Live Sports
              </button>
           </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 overflow-hidden px-12 pb-12 flex flex-col mt-4">
          <div className="flex-1 flex flex-col">
            {filteredChannels.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                 <p className="text-3xl font-black uppercase italic tracking-tighter font-header">No Broadcasts Available</p>
                 <p className="text-sm mt-4 font-bold uppercase tracking-[0.3em]">Check your connection or change category</p>
              </div>
            ) : (
              <div 
                ref={scrollContainerRef}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12 overflow-y-auto pr-8 custom-scrollbar scroll-smooth pt-4"
              >
                {filteredChannels.map((channel, index) => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    isFocused={focusedIndex === index}
                    onSelect={setSelectedChannel}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Fullscreen Player */}
      <AnimatePresence>
        {selectedChannel && (
          <TVPlayer 
            channel={selectedChannel} 
            onClose={() => setSelectedChannel(null)} 
          />
        )}
      </AnimatePresence>

      <Toaster 
        position="bottom-right" 
        theme="dark" 
        richColors 
        toastOptions={{
          className: 'bg-black/90 backdrop-blur-2xl border border-red-600/20 text-white rounded-3xl p-6 shadow-2xl',
        }}
      />
    </div>
  );
}

export default App;