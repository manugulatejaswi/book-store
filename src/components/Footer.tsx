import React from 'react';
import { BookOpen, Sparkles, MapPin, Mail, Phone, Heart } from 'lucide-react';
import { useBookStore } from '../context/BookStoreContext';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  const { setIsRecommendationsOpen, setIsSearchOpen } = useBookStore();

  return (
    <footer className="bg-[#1F1C18] text-[#D8D0C5] pt-16 pb-12 border-t border-[#38332C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#38332C]">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-editorial text-2xl sm:text-3xl font-medium tracking-tight text-[#FAF8F5] block">
              The Bindery & Co.
            </span>
            <p className="font-serif text-sm text-[#B3A99B] leading-relaxed max-w-sm">
              Independent booksellers and custom edition binders established in 1984. Curating rare monographs, transcendent literature, and clothbound keepsakes for discerning readers worldwide.
            </p>
            <div className="text-xs text-[#8F8475] space-y-1 pt-1 font-mono">
              <p>44 Trinity Street, Cambridge CB2 1TB</p>
              <p>Monday – Saturday: 09:30 – 18:30 · Sunday: 11:00 – 17:00</p>
            </div>
          </div>

          {/* Quick Curations Links */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs uppercase tracking-wider text-[#FAF8F5] font-semibold block">
              Explorations
            </span>
            <ul className="space-y-2 text-xs text-[#B3A99B]">
              <li>
                <button
                  onClick={() => onNavigateSection('catalog')}
                  className="hover:text-white transition-colors"
                >
                  Complete Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsRecommendationsOpen(true)}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Reading Matchmaker</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('staff-picks')}
                  className="hover:text-white transition-colors"
                >
                  Staff Selections
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('craftsmanship')}
                  className="hover:text-white transition-colors"
                >
                  The Art of Binding
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:text-white transition-colors"
                >
                  Mood & Vibe Search
                </button>
              </li>
            </ul>
          </div>

          {/* Service & Assurance */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs uppercase tracking-wider text-[#FAF8F5] font-semibold block">
              Reader Care
            </span>
            <ul className="space-y-2 text-xs text-[#B3A99B]">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Carbon-Neutral Post
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Custom Slipcasing
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Gift Certificates
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Institutional Archives
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Returns & Replacements
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs uppercase tracking-wider text-[#FAF8F5] font-semibold block">
              The Folio Dispatch
            </span>
            <p className="text-xs text-[#B3A99B] leading-relaxed">
              A bi-weekly letter on forgotten authors, newly translated works, and private press releases.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="your.reading.desk@email.com"
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#2E2923] text-white border border-[#443D34] placeholder-[#7F7466] focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                onClick={() => alert('Thank you for subscribing to The Folio Dispatch.')}
                className="w-full py-2 px-3 text-xs font-semibold text-[#1F1C18] bg-[#E8DCC9] hover:bg-white rounded-lg transition-colors"
              >
                Join the Circle
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7B7163] gap-4">
          <p>© 1984–2026 The Bindery & Co. Booksellers Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Smyth-Sewn Binding</span>
            <span aria-hidden="true">·</span>
            <span>Acid-Free Paper Guarantee</span>
            <span aria-hidden="true">·</span>
            <span>Worldwide Courier</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
