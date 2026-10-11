import React from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';

export interface DetailModalData {
  category: string;
  title: string;
  description: string;
  imageUrl?: string;
  actionText?: string;
  onAction?: () => void;
}

interface DetailModalProps {
  data: DetailModalData | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#05070e]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#080d1f] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900/80 border border-slate-800 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category label */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            {data.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-light text-slate-100 mb-4 tracking-tight pr-10">
          {data.title}
        </h3>

        {/* High-Resolution Image Preview */}
        {data.imageUrl && (
          <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden mb-5 border border-slate-800 relative bg-black/80 flex-shrink-0 shadow-lg">
            <img 
              src={data.imageUrl} 
              alt={data.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080d1f] via-transparent to-transparent opacity-50" />
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
              HIGH-RESOLUTION ASTROPHOTOGRAPHY
            </div>
          </div>
        )}

        {/* Description */}
        <div className="overflow-y-auto pr-1 flex-1 mb-6">
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono rounded-xl transition-colors border border-slate-800"
          >
            Close View
          </button>

          {data.onAction && (
            <button
              onClick={() => {
                data.onAction!();
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-medium text-xs rounded-xl transition-transform hover:scale-105 shadow-lg shadow-cyan-500/20"
            >
              <span>{data.actionText || 'Explore Topic'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
