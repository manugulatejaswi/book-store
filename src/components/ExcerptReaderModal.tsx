import React, { useState } from 'react';
import { X, BookOpen, ShoppingBag, ZoomIn, ZoomOut, Check } from 'lucide-react';
import { useBookStore } from '../context/BookStoreContext';

export const ExcerptReaderModal: React.FC = () => {
  const { activeExcerptBook, closeExcerptModal, addToCart } = useBookStore();
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  if (!activeExcerptBook) return null;

  const fontClasses = {
    normal: 'text-base sm:text-lg leading-relaxed',
    large: 'text-lg sm:text-xl leading-loose',
    xlarge: 'text-xl sm:text-2xl leading-loose',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      
      <div 
        className="w-full max-w-4xl bg-[#FBF9F5] text-[#24211D] rounded-2xl shadow-2xl border border-[#E2D9CB] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Reader Top Bar */}
        <div className="px-5 py-3.5 border-b border-[#E8E0D2] bg-[#F5EFE5] flex items-center justify-between text-xs text-[#5A5247]">
          
          <div className="flex items-center gap-3">
            <span className="font-editorial text-sm font-semibold text-[#1F1C18]">
              {activeExcerptBook.title}
            </span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline text-[#7B7163]">
              {activeExcerptBook.author}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Font sizing controls */}
            <div className="hidden sm:flex items-center gap-1 bg-[#ECE4D6] p-1 rounded-md border border-[#DDD3C2]">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 text-xs font-serif rounded transition-colors ${
                  fontSize === 'normal' ? 'bg-white shadow-xs text-[#1F1C18]' : 'text-[#7B7163]'
                }`}
                title="Normal text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 text-sm font-serif rounded transition-colors ${
                  fontSize === 'large' ? 'bg-white shadow-xs text-[#1F1C18]' : 'text-[#7B7163]'
                }`}
                title="Large text size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-0.5 text-base font-serif rounded transition-colors ${
                  fontSize === 'xlarge' ? 'bg-white shadow-xs text-[#1F1C18]' : 'text-[#7B7163]'
                }`}
                title="Extra large text size"
              >
                A++
              </button>
            </div>

            <button
              onClick={closeExcerptModal}
              className="p-1.5 text-[#5A5247] hover:text-[#1F1C18] hover:bg-[#EAE2D3] rounded-md transition-colors"
              aria-label="Close reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Reader Parchment Page */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-16 py-10 sm:py-14 bg-[#FBF9F5] selection:bg-[#EBDDC8]">
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Title Lockup */}
            <div className="text-center pb-8 border-b border-[#E8DFC8]">
              <span className="text-xs uppercase tracking-widest text-[#844C23] font-medium block mb-2">
                Sample Excerpt · Chapter One
              </span>
              <h2 className="font-editorial text-2xl sm:text-4xl font-medium text-[#1F1C18] tracking-tight">
                {activeExcerptBook.sampleExcerpt.chapterTitle}
              </h2>
              <p className="font-editorial italic text-sm text-[#7B7163] mt-2">
                from <span className="font-medium text-[#24211D]">{activeExcerptBook.title}</span> by {activeExcerptBook.author}
              </p>
            </div>

            {/* Prose with drop cap */}
            <div className={`space-y-6 font-serif text-[#24211D] ${fontClasses[fontSize]}`}>
              {activeExcerptBook.sampleExcerpt.text.map((paragraph, idx) => (
                <p 
                  key={idx} 
                  className={idx === 0 ? "first-letter:float-left first-letter:text-5xl first-letter:pr-3 first-letter:font-editorial first-letter:font-bold first-letter:text-[#844C23] first-letter:leading-none" : ""}
                >
                  {paragraph}
                </p>
              ))}

              <div className="pt-8 text-center">
                <span className="text-sm font-serif italic text-[#8F8475]">
                  — End of Sample Reading —
                </span>
                <p className="text-xs text-[#7B7163] mt-1">
                  Full volume contains {activeExcerptBook.pages} pages on acid-free milled paper.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Reader Bottom Action Bar */}
        <div className="px-6 py-4 border-t border-[#E8E0D2] bg-[#F5EFE5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#5A5247] text-center sm:text-left">
            <span>Enjoying this prose? The hardcover edition is in stock and ready to ship.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={closeExcerptModal}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-medium text-[#5A5247] hover:text-[#1F1C18] bg-[#EAE2D3] hover:bg-[#DDD3C2] rounded-lg transition-colors"
            >
              Close Reader
            </button>
            <button
              onClick={() => {
                addToCart(activeExcerptBook, 'Hardcover', 1);
                closeExcerptModal();
              }}
              className="flex-1 sm:flex-initial px-5 py-2 text-xs font-semibold text-white bg-[#24211D] hover:bg-[#3E3831] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Purchase Hardcover · ${activeExcerptBook.price.toFixed(2)}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
