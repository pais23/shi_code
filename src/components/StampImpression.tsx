import React from 'react';
import { 
  Train, 
  Mail, 
  Coffee, 
  Landmark, 
  Trees, 
  Calendar, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';
import { StampCategory } from '../types';

interface StampImpressionProps {
  name: string;
  category: StampCategory;
  inkColor?: string;
  shape?: 'round' | 'square' | 'shield' | 'oval' | 'hexagon';
  date?: string;
  city?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rotationDeg?: number;
  className?: string;
}

export const StampImpression: React.FC<StampImpressionProps> = ({
  name,
  category,
  inkColor = '#9f1239',
  shape = 'round',
  date = 'VALID 2025',
  city = 'INDONESIA',
  size = 'md',
  rotationDeg = -4,
  className = '',
}) => {
  const getIcon = () => {
    const iconSize = size === 'sm' ? 14 : size === 'md' ? 20 : size === 'lg' ? 28 : 36;
    switch (category) {
      case 'station':
        return <Train size={iconSize} />;
      case 'post_office':
        return <Mail size={iconSize} />;
      case 'cafe':
        return <Coffee size={iconSize} />;
      case 'museum_landmark':
        return <Landmark size={iconSize} />;
      case 'nature_tour':
        return <Trees size={iconSize} />;
      case 'community_event':
        return <Calendar size={iconSize} />;
      case 'bookstore_art':
        return <BookOpen size={iconSize} />;
      default:
        return <Sparkles size={iconSize} />;
    }
  };

  // Dimensions
  const sizeClasses = {
    sm: 'w-16 h-16 text-[9px]',
    md: 'w-24 h-24 text-[11px]',
    lg: 'w-32 h-32 text-[13px]',
    xl: 'w-40 h-40 text-[15px]',
  };

  const borderShapes = {
    round: 'rounded-full border-2 border-dashed',
    square: 'rounded-lg border-2 border-dashed',
    oval: 'rounded-[38%] border-2 border-dashed',
    shield: 'rounded-b-3xl rounded-t-lg border-2 border-dashed',
    hexagon: 'rounded-2xl border-2 border-dashed',
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center p-2 select-none transition-transform duration-200 ${sizeClasses[size]} ${borderShapes[shape]} ${className}`}
      style={{
        color: inkColor,
        borderColor: inkColor,
        transform: `rotate(${rotationDeg}deg)`,
        boxShadow: `inset 0 0 0 2px ${inkColor}33`,
        backgroundColor: `${inkColor}08`,
      }}
    >
      {/* Outer Stamp Rim */}
      <div 
        className="absolute inset-1 rounded-full border opacity-40 pointer-events-none"
        style={{ borderColor: inkColor }}
      />

      {/* Top Header Tag */}
      <span 
        className="font-bold tracking-widest uppercase truncate max-w-[90%] text-center text-[0.8em]"
        style={{ fontFamily: "'Special Elite', monospace, sans-serif" }}
      >
        {city}
      </span>

      {/* Center Icon & Name */}
      <div className="my-1 flex items-center justify-center opacity-90">
        {getIcon()}
      </div>

      <span 
        className="font-bold tracking-tight text-center line-clamp-1 max-w-[95%] text-[0.75em]"
        style={{ fontFamily: "'Special Elite', monospace, sans-serif" }}
      >
        {name.length > 18 ? `${name.substring(0, 16)}..` : name}
      </span>

      {/* Date / Serial bottom */}
      <span 
        className="mt-0.5 tracking-wider text-[0.65em] font-semibold opacity-85"
        style={{ fontFamily: "'Special Elite', monospace, sans-serif" }}
      >
        {date}
      </span>

      {/* Authentic Distressed Ink Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply rounded-inherit bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:6px_6px]"
      />
    </div>
  );
};
