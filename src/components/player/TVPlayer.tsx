import React, { useState, useEffect, useRef } from 'react';
import { Maximize, Settings, Volume2, Play, Pause, SkipBack, SkipForward, Info, ArrowLeft, Radio } from 'lucide-react';
import { Channel } from '@/services/iptv';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface TVPlayerProps {
  channel: Channel;
  onClose: () => void;
}

export const TVPlayer = ({ channel, onClose }: TVPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('4K ULTRA');
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const [focusedControl, setFocusedControl] = useState(0);

  const controls = [
    { icon: SkipBack, label: 'PREV' },
    { icon: isPlaying ? Pause : Play, label: isPlaying ? 'PAUSE' : 'PLAY' },
    { icon: SkipForward, label: 'NEXT' },
    { icon: Settings, label: 'UHD' },
    { icon: Info, label: 'INFO' },
  ];

  useEffect(() => {
    const handleNav = (e: any) => {
      const { action } = e.detail;
      setShowControls(true);
      resetControlsTimeout();

      if (action === 'left') setFocusedControl(prev => Math.max(0, prev - 1));
      if (action === 'right') setFocusedControl(prev => Math.min(controls.length - 1, prev + 1));
      if (action === 'enter') {
        if (focusedControl === 1) setIsPlaying(!isPlaying);
        if (focusedControl === 3) {
          const qualities = ['4K ULTRA', '1080p', '720p'];
          const next = qualities[(qualities.indexOf(quality) + 1) % qualities.length];
          setQuality(next);
          toast.success(`Quality set to ${next}`);
        }
      }
      if (action === 'back') {
        // As requested: implement back using history.back() or similar
        // For the player modal, closing it is equivalent to going back in app state
        onClose();
      }
    };

    window.addEventListener('tv-navigation', handleNav);
    return () => window.removeEventListener('tv-navigation', handleNav);
  }, [focusedControl, isPlaying, quality, onClose, controls.length]);

  const resetControlsTimeout = () => {
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 8000);
  };

  useEffect(() => {
    resetControlsTimeout();
    return () => { if (controlsTimeout.current) clearTimeout(controlsTimeout.current); };
  }, []);

  const handleBackButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center font-sans"
    >
      {/* Background Simulating Video */}
      <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,transparent_70%)]" />
         <img 
           src={channel.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.name)}&background=1a1a1a&color=fff`}
           className="w-full h-full object-cover blur-[100px] opacity-20 absolute inset-0 scale-150" 
           alt="background"
         />
         
         <div className="relative z-10 flex flex-col items-center gap-12">
            <motion.div 
              animate={{ 
                boxShadow: ["0 0 20px rgba(220,38,38,0.2)", "0 0 60px rgba(220,38,38,0.5)", "0 0 20px rgba(220,38,38,0.2)"] 
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-64 h-64 rounded-[2.5rem] overflow-hidden glass-panel flex items-center justify-center p-12 border-red-600/20"
            >
               <img 
                 src={channel.logo} 
                 className="w-full h-full object-contain drop-shadow-2xl" 
                 alt={channel.name} 
                 onError={(e) => (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.name)}&background=1a1a1a&color=fff`}
               />
            </motion.div>
            <div className="text-center">
              <h2 className="text-6xl font-black text-white mb-6 uppercase italic tracking-tighter font-header">{channel.name}</h2>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-3 bg-red-600 px-6 py-2.5 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.6)] border border-red-500/50">
                   <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                   <span className="text-sm font-black text-white uppercase tracking-[0.4em] font-header">Live Broadcast</span>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-full backdrop-blur-md">
                   <span className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] font-header">{quality} STREAM</span>
                </div>
              </div>
            </div>
         </div>
      </div>

      {/* Controls Overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/80 transition-opacity duration-1000 p-16 flex flex-col justify-between",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        {/* Top Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-8">
            <button 
              onClick={handleBackButtonClick}
              className="w-16 h-16 rounded-[1.25rem] bg-white/5 hover:bg-white/10 flex items-center justify-center text-white backdrop-blur-xl border border-white/10 transition-all shadow-2xl group"
            >
               <ArrowLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h3 className="text-4xl font-black text-white leading-none tracking-tighter uppercase italic font-header">{channel.name}</h3>
              <div className="flex items-center gap-3 mt-3">
                <Radio size={14} className="text-red-600" />
                <p className="text-red-600 text-[11px] font-black uppercase tracking-[0.5em]">IBOX VVIP PREMIUM BROADCAST</p>
              </div>
            </div>
          </div>
          <button className="w-16 h-16 rounded-[1.25rem] bg-white/5 hover:bg-white/10 flex items-center justify-center text-white backdrop-blur-xl border border-white/10">
             <Maximize size={32} />
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="max-w-6xl mx-auto w-full mb-12">
           <div className="relative h-2.5 bg-white/5 rounded-full overflow-hidden mb-12">
             <motion.div 
               initial={{ width: "0%" }}
               animate={{ width: "100%" }}
               transition={{ duration: 120, repeat: Infinity }}
               className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-800 via-red-600 to-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]" 
             />
           </div>

           <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                 {controls.map((ctrl, i) => (
                    <button
                      key={i}
                      className={cn(
                        "p-6 rounded-3xl transition-all duration-500 flex flex-col items-center gap-2 cursor-pointer relative",
                        focusedControl === i 
                          ? "bg-red-600 text-white scale-125 shadow-[0_0_40px_rgba(220,38,38,0.6)] border border-red-400/50" 
                          : "bg-white/5 text-gray-500 border border-white/5"
                      )}
                      onClick={() => {
                        if (i === 1) setIsPlaying(!isPlaying);
                        setFocusedControl(i);
                      }}
                    >
                       <ctrl.icon size={36} className={cn(focusedControl === i ? "animate-pulse" : "")} />
                       {focusedControl === i && (
                         <motion.span 
                           layoutId="label"
                           className="absolute -bottom-12 text-[11px] font-black uppercase tracking-[0.5em] text-red-500 whitespace-nowrap font-header"
                         >
                           {ctrl.label}
                         </motion.span>
                       )}
                    </button>
                 ))}
              </div>

              <div className="flex items-center gap-10 text-white bg-white/5 px-10 py-6 rounded-[2.5rem] border border-white/10 backdrop-blur-2xl">
                 <div className="flex items-center gap-6">
                    <Volume2 size={28} className="text-red-600" />
                    <div className="w-48 h-2 bg-white/5 rounded-full relative">
                       <div className="w-[80%] h-full bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.4)]" />
                    </div>
                 </div>
                 <div className="w-px h-10 bg-white/10" />
                 <span className="text-3xl font-black tracking-tighter font-header text-white/90">
                   {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </span>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};