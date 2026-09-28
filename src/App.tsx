import React, { useState } from 'react';
import { 
  Search, Sparkles, BookOpen, ShoppingBag, ArrowRight, Filter, 
  Star, Heart, Check, RotateCcw, Compass, Bookmark, Award, SlidersHorizontal 
} from 'lucide-react';
import { BookStoreProvider, useBookStore } from './context/BookStoreContext';
import { Navbar } from './components/Navbar';
import { SearchModal } from './components/SearchModal';
import { BookCard } from './components/BookCard';
import { BookDetailModal } from './components/BookDetailModal';
import { ExcerptReaderModal } from './components/ExcerptReaderModal';
import { PersonalizedRecommendations } from './components/PersonalizedRecommendations';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { PackagingShowcase } from './components/PackagingShowcase';
import { Footer } from './components/Footer';
import { GENRES, FORMATS } from './data/books';

const BookstoreApp: React.FC = () => {
  const {
    books,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    selectedFormat,
    setSelectedFormat,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    sortBy,
    setSortBy,
    onlyInStock,
    setOnlyInStock,
    onlyStaffPicks,
    setOnlyStaffPicks,
    resetFilters,
    setIsRecommendationsOpen,
    openDetailModal,
    openExcerptModal,
    addToCart,
    readingGoal,
    incrementReadingGoal,
    toast,
  } = useBookStore();

  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filter books
  const filteredBooks = books.filter(book => {
    // Genre
    if (selectedGenre !== 'All Collections' && book.genre !== selectedGenre) {
      return false;
    }
    // Format
    if (selectedFormat !== 'All Formats') {
      const hasFormat = book.formats.some(f => f.format === selectedFormat);
      if (!hasFormat) return false;
    }
    // Price
    if (book.price > maxPrice) return false;
    // Rating
    if (book.rating < minRating) return false;
    // Staff pick
    if (onlyStaffPicks && !book.staffPick) return false;
    // In stock
    if (onlyInStock && !book.inStock) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = book.title.toLowerCase().includes(q);
      const inAuthor = book.author.toLowerCase().includes(q);
      const inSynopsis = book.synopsis.toLowerCase().includes(q);
      const inTags = book.tags.some(t => t.toLowerCase().includes(q));
      if (!inTitle && !inAuthor && !inSynopsis && !inTags) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'newest') return b.publicationYear - a.publicationYear;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const spotlightBook = books[0]; // The Atlas of Solitude
  const staffPicksList = books.filter(b => b.staffPick).slice(0, 3);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeFiltersCount = 
    (selectedGenre !== 'All Collections' ? 1 : 0) +
    (selectedFormat !== 'All Formats' ? 1 : 0) +
    (maxPrice < 50 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (onlyStaffPicks ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#24211D] flex flex-col font-sans selection:bg-[#E8DCC9]">
      
      {/* Toast floating notification */}
      {toast && (
        <aside 
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#1F1C18] text-[#FAF8F5] px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium border border-[#3E3831] flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2"
        >
          <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{toast}</span>
        </aside>
      )}

      {/* Top Navigation */}
      <Navbar onNavigateSection={scrollToSection} />

      {/* Reading Goal Sub-Header Banner (Adjacency & quiet motivation) */}
      <div className="bg-[#F2ECE1] border-b border-[#E5DECDB] py-2 px-4 text-xs text-[#5E5446]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bookmark className="w-3.5 h-3.5 text-[#844C23]" />
            <span>
              2026 Patron Challenge: <strong>{readingGoal.current}</strong> of <strong>{readingGoal.target}</strong> books read ({Math.round((readingGoal.current / readingGoal.target) * 100)}%)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-[11px] text-[#7B7163]">
              Every order includes a brass & letterpress bookmark
            </span>
            <button
              onClick={incrementReadingGoal}
              className="text-[11px] font-semibold text-[#844C23] hover:underline"
            >
              + Log a Finished Book
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1">
        
        {/* 1. HERO SECTION */}
        <section id="hero" className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#E8DFC8] overflow-hidden">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left: Campaign Headline & Intuitive Search Bar (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Zero-Pill unboxed kicker */}
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#844C23]">
                  <span>Independent Booksellers</span>
                  <span aria-hidden="true">·</span>
                  <span>Cambridge Archive</span>
                  <span aria-hidden="true">·</span>
                  <span>Est. 1984</span>
                </div>

                <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#1F1C18] leading-[1.08] max-w-2xl text-balance">
                  Literature bound to outlive the ephemeral.
                </h1>

                <p className="font-serif text-base sm:text-lg text-[#52483C] leading-relaxed max-w-xl">
                  An independent emporium of Smyth-sewn fiction, celestial monographs, and forgotten classics. Search our collection by narrative vibe, historical era, or philosophical dilemma.
                </p>

                {/* Primary Search Bar right in Hero */}
                <div className="pt-2 max-w-xl">
                  <div 
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 sm:p-2.5 bg-white rounded-xl border border-[#D5CDC1] shadow-sm hover:border-[#844C23] transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 pl-2 flex-1 min-w-0">
                      <Search className="w-4 h-4 text-[#844C23] shrink-0" />
                      <span className="text-xs sm:text-sm text-[#7B7163] truncate">
                        Search by author, title, trope, or "atmospheric gothic mystery"...
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <kbd className="hidden sm:inline px-2 py-1 text-[11px] bg-[#F4EFE6] rounded text-[#7B7163] font-mono border border-[#DDD3C2]">
                        ⌘K
                      </kbd>
                      <button className="px-3.5 py-2 text-xs font-semibold text-white bg-[#24211D] group-hover:bg-[#844C23] rounded-lg transition-colors">
                        Explore
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct Matchmaker CTA & Proof Metrics */}
                <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#63594C]">
                  <button
                    onClick={() => setIsRecommendationsOpen(true)}
                    className="px-4 py-2.5 rounded-lg bg-[#F0E8DC] hover:bg-[#E5DBCB] text-[#1F1C18] font-semibold transition-colors flex items-center gap-2 border border-[#DDD2BF] cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#844C23]" />
                    <span>Take the Reading Matchmaker</span>
                    <ArrowRight className="w-3 h-3 text-[#844C23]" />
                  </button>

                  <div className="flex items-center gap-4 text-xs text-[#7B7163]">
                    <span>14,000+ Bound Volumes</span>
                    <span aria-hidden="true">·</span>
                    <span>100% Plastic-Free Packaging</span>
                  </div>
                </div>

              </div>

              {/* Right: Atmospheric Bookstore Photograph (5 cols) */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#DCD3C3] bg-[#E8E1D3] aspect-[4/3] lg:aspect-[5/4]">
                  <img
                    src="/src/assets/images/hero_bookstore_interior_1790580134518.jpg"
                    alt="Interior of The Bindery and Co. bookstore with towering wooden bookshelves and warm brass library lamps"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-5">
                    <div className="text-white space-y-0.5">
                      <span className="text-[11px] uppercase tracking-wider text-[#E8DCC9] font-medium block">
                        Our Cambridge Reading Room
                      </span>
                      <p className="font-editorial text-lg text-white">
                        Open seven days a week for quiet contemplation and tea.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* 2. SPOTLIGHT FEATURED NOVEL (Section 2.A: Storefront Hero Route) */}
        <section className="py-12 sm:py-16 bg-[#F6F1E7] border-b border-[#E8DFC8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 bg-white/80 rounded-2xl border border-[#E0D7C9] shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Cover (4 cols) */}
                <div className="md:col-span-4 flex justify-center">
                  <div 
                    onClick={() => openDetailModal(spotlightBook)}
                    className="relative w-48 sm:w-56 aspect-[3/4] rounded-xl overflow-hidden shadow-xl border border-[#D5CDC1] cursor-pointer group"
                  >
                    <img
                      src={spotlightBook.coverImage}
                      alt={spotlightBook.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 bg-white text-xs font-semibold rounded-md shadow">
                        Inspect Volume
                      </span>
                    </div>
                  </div>
                </div>

                {/* Narrative Description (8 cols) */}
                <div className="md:col-span-8 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-[#844C23] font-semibold uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5" />
                    <span>Curator’s Selection of the Season</span>
                  </div>

                  <h2 
                    onClick={() => openDetailModal(spotlightBook)}
                    className="font-editorial text-3xl sm:text-4xl font-medium text-[#1F1C18] hover:text-[#844C23] transition-colors cursor-pointer"
                  >
                    {spotlightBook.title}
                  </h2>

                  <p className="text-sm font-serif text-[#5A5247]">
                    by <span className="font-semibold text-[#1F1C18]">{spotlightBook.author}</span> · {spotlightBook.genre}
                  </p>

                  <p className="font-serif text-sm sm:text-base text-[#443D34] leading-relaxed line-clamp-3">
                    {spotlightBook.synopsis}
                  </p>

                  <div className="p-3 bg-[#F4EDE2] rounded-lg border border-[#E5DAC8] text-xs italic text-[#554939] font-serif">
                    "{spotlightBook.editorialQuote.quote}" — <span className="font-sans font-medium text-[#844C23] not-italic">{spotlightBook.editorialQuote.source}</span>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <span className="font-mono tabular-nums text-xl font-bold text-[#1F1C18]">
                      ${spotlightBook.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(spotlightBook, 'Hardcover', 1)}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-[#24211D] hover:bg-[#3E3831] rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add Hardcover to Bag</span>
                    </button>
                    <button
                      onClick={() => openExcerptModal(spotlightBook)}
                      className="px-4 py-2.5 text-xs font-semibold text-[#24211D] bg-[#EAE2D3] hover:bg-[#DDD3C2] rounded-lg transition-colors flex items-center gap-1.5 border border-[#D5CDC1]"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#844C23]" />
                      <span>Read Chapter 1 Excerpt</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 3. MAIN CATALOG & INTUITIVE SEARCH/FILTER SYSTEM */}
        <section id="catalog" className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Catalog Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E8DFC8]">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#844C23] font-semibold block mb-1">
                  The Complete Archive
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#1F1C18] tracking-tight">
                  Curated Catalog & Editions
                </h2>
                <p className="text-xs text-[#7B7163] mt-1">
                  Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'title' : 'titles'} in stock and ready for archival dispatch
                </p>
              </div>

              {/* Quick Actions & Mobile Filter Toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                  className="md:hidden px-3 py-2 text-xs font-medium text-[#24211D] bg-[#F2EDE4] rounded-lg border border-[#DDD3C2] flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 text-xs text-[#5A5247]">
                  <span className="hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 text-xs rounded-lg border border-[#D5CDC1] bg-white text-[#1F1C18] focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Curator's Choice</option>
                    <option value="rating">Highest Rated (★ 4.8+)</option>
                    <option value="price-asc">Price: Modest to Rare</option>
                    <option value="price-desc">Price: Rare to Modest</option>
                    <option value="newest">Newest Acquisitions</option>
                    <option value="title">Title (A–Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Interactive Genre Filter Ribbon (Section 1.A: Functional filter buttons allowed) */}
            <div className="py-4 border-b border-[#EFE9DF] overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 min-w-max">
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      selectedGenre === genre
                        ? 'bg-[#24211D] text-white shadow-xs'
                        : 'text-[#5A5247] hover:text-[#1F1C18] hover:bg-[#EFE9DF]'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout: Sidebar Filter & Grid */}
            <div className="pt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Sidebar Filters (3 cols on desktop) */}
              <aside className={`md:col-span-3 space-y-6 ${showFiltersMobile ? 'block' : 'hidden md:block'}`}>
                
                {/* Active Filter Clear Header */}
                {activeFiltersCount > 0 && (
                  <div className="p-3 bg-[#F0EAE0] rounded-xl border border-[#E0D7C9] flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#844C23]">
                      {activeFiltersCount} Active Filter{activeFiltersCount > 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={resetFilters}
                      className="text-xs text-[#7B7163] hover:text-[#1F1C18] flex items-center gap-1 font-medium"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                )}

                {/* Format Filter */}
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#665D4F] block">
                    Binding & Format
                  </span>
                  <div className="space-y-1 text-xs">
                    {FORMATS.map(fmt => (
                      <label key={fmt} className="flex items-center gap-2 cursor-pointer text-[#443D34] hover:text-[#1F1C18]">
                        <input
                          type="radio"
                          name="format"
                          checked={selectedFormat === fmt}
                          onChange={() => setSelectedFormat(fmt)}
                          className="accent-[#844C23]"
                        />
                        <span>{fmt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Slider */}
                <div className="space-y-2 pt-4 border-t border-[#EFE9DF]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="uppercase tracking-wider font-semibold text-[#665D4F]">Max Price</span>
                    <span className="font-mono tabular-nums font-semibold text-[#1F1C18]">${maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="50"
                    step="1"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#844C23] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#8F8475] font-mono">
                    <span>$15</span>
                    <span>$50</span>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-2 pt-4 border-t border-[#EFE9DF]">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#665D4F] block">
                    Minimum Rating
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    {[0, 4.5, 4.8].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        className={`px-2.5 py-1 rounded text-xs transition-colors border ${
                          minRating === rating
                            ? 'bg-[#24211D] text-white border-[#24211D]'
                            : 'bg-white text-[#5A5247] border-[#D5CDC1] hover:bg-[#F4EFE6]'
                        }`}
                      >
                        {rating === 0 ? 'All' : `${rating}★+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles: Staff Picks & In Stock */}
                <div className="space-y-2 pt-4 border-t border-[#EFE9DF] text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-[#443D34]">
                    <input
                      type="checkbox"
                      checked={onlyStaffPicks}
                      onChange={(e) => setOnlyStaffPicks(e.target.checked)}
                      className="accent-[#844C23] rounded"
                    />
                    <span>Curator Staff Picks Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[#443D34]">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="accent-[#844C23] rounded"
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>

                {/* Concierge Callout in Sidebar */}
                <div className="p-4 bg-[#F5EFE5] rounded-xl border border-[#E2D9CB] text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-[#844C23] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Can’t decide on a title?</span>
                  </div>
                  <p className="text-[#63594C] leading-relaxed">
                    Our AI Bookseller Concierge matches your reading mood and favorite authors.
                  </p>
                  <button
                    onClick={() => setIsRecommendationsOpen(true)}
                    className="w-full py-2 text-xs font-semibold text-white bg-[#844C23] hover:bg-[#6D3D1B] rounded-lg transition-colors cursor-pointer"
                  >
                    Open Matchmaker
                  </button>
                </div>

              </aside>

              {/* Book Grid (9 cols on desktop) */}
              <div className="md:col-span-9">
                {filteredBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredBooks.map(book => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-white/60 rounded-2xl border border-[#E8DFC8] p-8">
                    <p className="font-editorial text-2xl text-[#1F1C18]">No books match your current filters</p>
                    <p className="text-xs text-[#7B7163] mt-2 max-w-sm mx-auto">
                      Try broadening your price range, clearing specific tags, or resetting filters to browse our complete collection.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-5 px-5 py-2 text-xs font-semibold text-white bg-[#844C23] rounded-lg hover:bg-[#6D3D1B] transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        </section>

        {/* 4. STAFF PICKS SPOTLIGHT SECTION */}
        <section id="staff-picks" className="py-16 sm:py-20 bg-[#F4EFE6] border-t border-[#E8DFC8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#844C23] font-semibold block mb-1">
                  Bookseller Dispatches
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#1F1C18]">
                  Staff Selections for Autumn & Winter
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedGenre('All Collections');
                  setOnlyStaffPicks(true);
                  scrollToSection('catalog');
                }}
                className="text-xs font-semibold text-[#844C23] hover:underline flex items-center gap-1"
              >
                <span>View All Staff Picks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffPicksList.map(book => (
                <BookCard key={`staff-${book.id}`} book={book} />
              ))}
            </div>

          </div>
        </section>

        {/* 5. CRAFTSMANSHIP & UNBOXING SHOWCASE (With Generated Image) */}
        <PackagingShowcase />

      </main>

      {/* Footer */}
      <Footer onNavigateSection={scrollToSection} />

      {/* Global Interactive Modals */}
      <SearchModal />
      <PersonalizedRecommendations />
      <BookDetailModal />
      <ExcerptReaderModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderHistoryModal />

    </div>
  );
};

export default function App() {
  return (
    <BookStoreProvider>
      <BookstoreApp />
    </BookStoreProvider>
  );
}
