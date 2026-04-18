import { cn } from '@/lib/utils';
import { Channel } from '@/services/iptv';
import { Play, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChannelCardProps {
  channel: Channel;
  isFocused: boolean;
  onSelect: (channel: Channel) => void;
}

export const ChannelCard = ({ channel, isFocused, onSelect }: ChannelCardProps) => {
  // Navigation handler
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(channel);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={cn(
        "relative flex-shrink-0 w-full aspect-video rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer group broadcast-item",
        isFocused 
          ? "scale-110 z-10 ring-4 ring-red-600 shadow-[0_0_50px_rgba(220,38,38,0.5)] opacity-100 live-event-active" 
          : "scale-100 opacity-60 grayscale-[0.5]"
      )}
    >
      {/* Visual background for branding */}
      <div className="absolute inset-0 bg-neutral-950">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-50" />
        <img
          src={channel.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.name)}&background=1a1a1a&color=fff`}
          alt={channel.name}
          className={cn(
            "w-full h-full object-contain p-6 transition-transform duration-700",
            isFocused ? "scale-110" : "scale-100"
          )}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.name)}&background=1a1a1a&color=fff`;
          }}
        />
      </div>

      {/* Overlays */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-500",
        isFocused ? "opacity-100" : "opacity-80"
      )} />
      
      {/* Enhanced Live Indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em] z-20 shadow-lg">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        Live
      </div>

      {/* Channel ID / Rank */}
      <div className="absolute top-4 right-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] z-20">
        #{channel.id.slice(0, 3)}
      </div>

      {/* Content Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="flex items-center gap-2 mb-2">
           <Radio size={14} className="text-red-500" />
           <span className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em] font-header">{channel.category}</span>
        </div>
        <p className={cn(
          "text-lg font-black truncate transition-colors font-header uppercase italic tracking-tight",
          isFocused ? "text-white" : "text-gray-300"
        )}>
          {channel.name}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{channel.group}</p>
          {isFocused && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-red-500 text-[9px] font-black uppercase tracking-widest"
            >
              Watch Now <Play size={10} fill="currentColor" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Selection Glow */}
      {isFocused && (
        <div className="absolute inset-0 border-2 border-red-500/50 rounded-2xl pointer-events-none" />
      )}
    </motion.div>
  );
};