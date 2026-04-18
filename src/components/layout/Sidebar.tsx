import React, { useEffect, useState } from 'react';
import { Home, Trophy, Globe, Heart, Settings, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  id: string;
  icon: React.ElementType;
  label: string;
  isFocused: boolean;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, isFocused, isActive, onClick }: SidebarItemProps) => (
  <div 
    onClick={onClick}
    className={cn(
      "flex items-center gap-5 px-6 py-4 transition-all duration-300 cursor-pointer rounded-2xl mx-2 border border-transparent",
      isFocused 
        ? "bg-red-600 text-white scale-105 shadow-2xl shadow-red-600/40 border-red-400/20" 
        : "text-gray-400 hover:text-white hover:bg-white/5",
      isActive && !isFocused && "text-red-500 font-black"
    )}
  >
    <Icon size={24} className={cn(isFocused ? "animate-pulse" : "")} />
    <span className="text-lg font-black uppercase tracking-widest font-header italic">{label}</span>
  </div>
);

interface SidebarProps {
  activeId: string;
  onSelect: (id: string) => void;
}

export const Sidebar = ({ activeId, onSelect }: SidebarProps) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const items = [
    { id: 'home', icon: Home, label: 'Discover' },
    { id: 'sports', icon: Trophy, label: 'Sports' },
    { id: 'countries', icon: Globe, label: 'Countries' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  useEffect(() => {
    const handleNav = (e: any) => {
      const { action } = e.detail;
      if (action === 'up') setFocusedIndex(prev => Math.max(0, prev - 1));
      if (action === 'down') setFocusedIndex(prev => Math.min(items.length - 1, prev + 1));
      if (action === 'enter') onSelect(items[focusedIndex].id);
    };

    window.addEventListener('tv-navigation', handleNav);
    return () => window.removeEventListener('tv-navigation', handleNav);
  }, [focusedIndex, items, onSelect]);

  return (
    <div className="w-80 h-screen bg-black/80 backdrop-blur-3xl border-r border-white/5 flex flex-col py-10 z-50">
      <div className="px-10 mb-16 flex flex-col items-center">
        <div className="flex flex-col items-center justify-center p-8 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 w-full relative overflow-hidden group">
          <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase font-header relative z-10">
            IBOX <span className="text-red-600">VVIP</span>
          </h1>
          <p className="text-[11px] font-black tracking-[0.5em] text-center text-red-500/60 uppercase italic mt-2 relative z-10">
            Ultra Premium
          </p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-3">
        {items.map((item, index) => (
          <SidebarItem
            key={item.id}
            id={item.id}
            icon={item.icon}
            label={item.label}
            isFocused={focusedIndex === index}
            isActive={activeId === item.id}
            onClick={() => onSelect(item.id)}
          />
        ))}
      </nav>

      <div className="px-8 mt-auto">
        <div className="p-6 rounded-[1.5rem] bg-gradient-to-br from-red-600/10 to-transparent border border-red-600/20 glass-panel">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black mb-3">Service Link</p>
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
            <span className="text-[12px] font-black text-white italic uppercase tracking-widest font-header">Direct Stream</span>
          </div>
        </div>
      </div>
    </div>
  );
};