import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, X, Trash2, ArrowUpRight, BookOpen, Clock } from 'lucide-react';
import { BookmarkItem } from '../../types';

interface BookmarkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkItem[];
  onSelectBookmark: (bookmark: BookmarkItem) => void;
  onDeleteBookmark: (id: string) => void;
  onClearAll: () => void;
}

export const BookmarkDrawer: React.FC<BookmarkDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onSelectBookmark,
  onDeleteBookmark,
  onClearAll,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-Out Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[440px] bg-[#070b14] border-l border-white/15 shadow-2xl flex flex-col text-slate-200 select-none"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-400/40 text-cyan-300">
                  <Bookmark className="w-4 h-4 fill-cyan-400/30" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base font-semibold text-white tracking-wide uppercase">
                    Saved Bookmarks
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    {bookmarks.length} {bookmarks.length === 1 ? 'passage' : 'passages'} saved
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bookmarks List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {bookmarks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-950/40 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mb-4">
                    <BookOpen className="w-7 h-7 stroke-[1.5]" />
                  </div>
                  <h4 className="text-sm font-medium text-white mb-1.5">No Bookmarks Saved Yet</h4>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Click the bookmark icon beside any chapter paragraph to save memorable passages and quickly return to them later.
                  </p>
                </div>
              ) : (
                bookmarks.map((bm) => (
                  <motion.div
                    key={bm.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 rounded-2xl border border-white/10 bg-slate-950/50 hover:bg-slate-900/60 hover:border-cyan-400/40 transition-all group relative"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-400/20 truncate max-w-[240px]">
                        {bm.chapterTitle}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onDeleteBookmark(bm.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 font-light leading-relaxed line-clamp-3 mb-3 italic">
                      "{bm.excerpt}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1 text-[10px]">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(bm.timestamp).toLocaleDateString()}
                      </span>

                      <button
                        onClick={() => {
                          onSelectBookmark(bm);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 transition-colors font-medium cursor-pointer"
                      >
                        <span>Jump to passage</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer with Clear All */}
            {bookmarks.length > 0 && (
              <div className="p-4 border-t border-white/10 bg-slate-950/70 flex items-center justify-between">
                <button
                  onClick={onClearAll}
                  className="text-xs font-mono text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  Clear all bookmarks
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-white border border-white/10 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
