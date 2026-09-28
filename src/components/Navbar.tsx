import React from 'react';
import { Search, ShoppingBag, Heart, Compass, Sparkles, BookOpen } from 'lucide-react';
import { useBookStore } from '../context/BookStoreContext';

interface NavbarProps {
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateSection }) => {
  const {
    cartCount,
    setIsCartOpen,
    setIsSearchOpen,
    wishlist,
    setIsRecommendationsOpen,
    setIsOrderHistoryOpen,
    orders,
  } = useBookStore();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D8] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Single text element Brand Zone wordmark (Strict Top Bar Contract) */}
        <button
          onClick={() => onNavigateSection('hero')}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#844C23]"
          aria-label="The Bindery and Co. Home"
        >
          <span className="font-editorial text-2xl sm:text-3xl font-medium tracking-tight text-[#1F1C18] block group-hover:text-[#844C23] transition-colors">
            The Bindery & Co.
          </span>
        </button>

        {/* Zone 2: 4-5 clean text navigation links with subtle hover underlines */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5A5247]">
          <button
            onClick={() => onNavigateSection('catalog')}
            className="hover:text-[#1F1C18] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#844C23] hover:after:w-full after:transition-all"
          >
            Catalog
          </button>
          <button
            onClick={() => setIsRecommendationsOpen(true)}
            className="hover:text-[#1F1C18] transition-colors py-1 flex items-center gap-1.5 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#844C23] hover:after:w-full after:transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#844C23]" />
            Reading Matchmaker
          </button>
          <button
            onClick={() => onNavigateSection('staff-picks')}
            className="hover:text-[#1F1C18] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#844C23] hover:after:w-full after:transition-all"
          >
            Staff Picks
          </button>
          <button
            onClick={() => onNavigateSection('craftsmanship')}
            className="hover:text-[#1F1C18] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#844C23] hover:after:w-full after:transition-all"
          >
            Art of Binding
          </button>
          {orders.length > 0 && (
            <button
              onClick={() => setIsOrderHistoryOpen(true)}
              className="hover:text-[#1F1C18] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#844C23] hover:after:w-full after:transition-all"
            >
              My Orders ({orders.length})
            </button>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[#5A5247] hover:text-[#1F1C18] bg-[#F1EBE1] hover:bg-[#E9E1D3] transition-colors border border-[#E0D8CB]"
            aria-label="Search bookstore"
          >
            <Search className="w-3.5 h-3.5 text-[#5A5247]" />
            <span className="hidden sm:inline">Search title, author, mood...</span>
            <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] bg-white/70 rounded text-[#7B7163] border border-[#DDD3C2]">
              ⌘K
            </kbd>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => onNavigateSection('catalog')}
            className="p-2 text-[#5A5247] hover:text-[#844C23] relative transition-colors"
            title="Saved in Wishlist"
            aria-label="View Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#844C23] rounded-full" />
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#24211D] hover:bg-[#38332C] rounded-lg transition-colors whitespace-nowrap shadow-sm"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="tabular-nums font-mono text-xs px-1.5 py-0.2 bg-[#3F3A33] rounded text-[#E8DCC9]">
              {cartCount}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
