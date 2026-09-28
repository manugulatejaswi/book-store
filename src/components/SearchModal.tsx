import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, BookOpen, ArrowRight, CornerDownLeft, Filter } from 'lucide-react';
import { useBookStore } from '../context/BookStoreContext';
import { Book } from '../types/book';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    books,
    openDetailModal,
    openExcerptModal,
    setSelectedGenre,
  } = useBookStore();

  const [mode, setMode] = useState<'standard' | 'vibe'>('standard');
  const [vibeNote, setVibeNote] = useState<string | null>(null);
  const [isVibeSearching, setIsVibeSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setVibeNote(null);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  // Filter books based on query
  const queryLower = searchQuery.toLowerCase().trim();
  const filteredBooks = books.filter(b => {
    if (!queryLower) return true;
    const inTitle = b.title.toLowerCase().includes(queryLower);
    const inAuthor = b.author.toLowerCase().includes(queryLower);
    const inGenre = b.genre.toLowerCase().includes(queryLower);
    const inTags = b.tags.some(t => t.toLowerCase().includes(queryLower));
    const inMoods = b.moods.some(m => m.toLowerCase().includes(queryLower));
    const inTropes = b.tropes.some(t => t.toLowerCase().includes(queryLower));
    const inSynopsis = b.synopsis.toLowerCase().includes(queryLower);
    const inIsbn = b.isbn.toLowerCase().includes(queryLower);

    return inTitle || inAuthor || inGenre || inTags || inMoods || inTropes || inSynopsis || inIsbn;
  });

  const handleVibeQuery = async (queryText: string) => {
    setSearchQuery(queryText);
    setMode('vibe');
    setIsVibeSearching(true);
    setVibeNote(null);

    try {
      const response = await fetch('/api/search-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          catalogTitles: books.map(b => `${b.title} by ${b.author} (${b.genre})`),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setVibeNote(data.curatorRationale);
      }
    } catch {
      setVibeNote(`Curating atmospheric titles attuned to your mood "${queryText}".`);
    } finally {
      setIsVibeSearching(false);
    }
  };

  const popularQueries = [
    'Eleanor Vance',
    'Old Manuscripts',
    'Historical Fiction',
    'Solitude & Sea',
    'Victorian Clockwork',
    'Botanical Lore',
  ];

  const sampleVibeQueries = [
    'Quiet melancholy on a stormy coast',
    'Intellectual mystery in an ancient library',
    'Sensory prose with herbalism and secrets',
    'Cosmic wonder and deep time',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E8E2D8] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E8E2D8] bg-[#F7F4EE] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#844C23] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={mode === 'vibe' ? "Describe a feeling, setting, or reading mood..." : "Search by title, author, keyword, trope, ISBN..."}
            className="flex-1 bg-transparent text-[#1F1C18] placeholder-[#8F8475] text-base sm:text-lg focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setVibeNote(null); }}
              className="p-1 text-[#8F8475] hover:text-[#1F1C18] rounded-full"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2.5 py-1 text-xs font-medium text-[#7B7163] hover:text-[#1F1C18] border border-[#DDD3C2] rounded-md bg-[#EFE9DF]"
          >
            ESC
          </button>
        </div>

        {/* Search Mode Bar */}
        <div className="px-5 py-2.5 bg-[#FAF8F5] border-b border-[#EFE9DF] flex items-center justify-between text-xs text-[#5A5247]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('standard')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                mode === 'standard'
                  ? 'bg-[#24211D] text-[#FAF8F5]'
                  : 'hover:text-[#1F1C18] hover:bg-[#EFE9DF]'
              }`}
            >
              Catalog Search
            </button>
            <button
              onClick={() => {
                setMode('vibe');
                if (!searchQuery) handleVibeQuery('Quiet melancholy on a stormy coast');
              }}
              className={`px-3 py-1 font-medium rounded-md flex items-center gap-1.5 transition-colors ${
                mode === 'vibe'
                  ? 'bg-[#844C23] text-white'
                  : 'hover:text-[#1F1C18] hover:bg-[#EFE9DF]'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Mood & Vibe Search
            </button>
          </div>

          <span className="text-[#8F8475]">
            {filteredBooks.length} {filteredBooks.length === 1 ? 'title' : 'titles'} found
          </span>
        </div>

        {/* Assistant Rationale Banner */}
        {vibeNote && (
          <div className="px-5 py-3 bg-[#F4EDE2] border-b border-[#E8DEC8] text-xs text-[#4A3C2C] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#844C23] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-[#362719]">Curator’s Reading Note</span>
              <span>{vibeNote}</span>
            </div>
          </div>
        )}

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Quick Suggestions when input is empty */}
          {!searchQuery && (
            <div className="space-y-6 py-2">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-[#8F8475] block mb-2.5">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularQueries.map(term => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1.5 text-xs text-[#443D34] bg-[#F1ECE3] hover:bg-[#E8E1D4] hover:text-[#1F1C18] rounded-md transition-colors border border-[#E0D8CA]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-[#8F8475] flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#844C23]" />
                  Try a Vibe or Feeling
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sampleVibeQueries.map(vibe => (
                    <button
                      key={vibe}
                      onClick={() => handleVibeQuery(vibe)}
                      className="text-left px-3.5 py-2.5 text-xs text-[#443D34] bg-[#F7F4EE] hover:bg-[#ECE4D6] hover:text-[#1F1C18] rounded-lg border border-[#E4DC CE] transition-all flex items-center justify-between group"
                    >
                      <span>"{vibe}"</span>
                      <ArrowRight className="w-3 h-3 text-[#A09587] group-hover:text-[#844C23] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Matching Books List */}
          {filteredBooks.length > 0 ? (
            <div className="divide-y divide-[#EFE9DF]">
              {filteredBooks.map(book => (
                <div
                  key={book.id}
                  className="py-3 sm:py-3.5 flex items-center justify-between gap-4 group hover:bg-[#F3EFE9] -mx-2 px-2.5 rounded-lg transition-colors"
                >
                  <div 
                    onClick={() => {
                      openDetailModal(book);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="w-11 h-15 bg-[#E4DDD2] rounded overflow-hidden shrink-0 shadow-sm border border-[#D5CDC1]">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to stylized cover
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-editorial text-base sm:text-lg font-medium text-[#1F1C18] group-hover:text-[#844C23] transition-colors truncate">
                        {book.title}
                      </h4>
                      <p className="text-xs text-[#7B7163] truncate">
                        {book.author}
                      </p>
                      {/* Zero-Pill unboxed metadata */}
                      <div className="flex items-center gap-2 text-[11px] text-[#8F8475] mt-1">
                        <span>{book.genre}</span>
                        <span aria-hidden="true">·</span>
                        <span>{book.pages} pages</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums text-[#38332C] font-semibold">${book.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        openExcerptModal(book);
                        setIsSearchOpen(false);
                      }}
                      className="px-2.5 py-1 text-xs text-[#5A5247] hover:text-[#1F1C18] hover:bg-[#E5DED2] rounded border border-[#DDD3C2] transition-colors flex items-center gap-1"
                      title="Read Chapter 1 Excerpt"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Excerpt</span>
                    </button>
                    <button
                      onClick={() => {
                        openDetailModal(book);
                        setIsSearchOpen(false);
                      }}
                      className="px-3 py-1 text-xs font-medium text-[#FAF8F5] bg-[#24211D] hover:bg-[#3E3831] rounded transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-[#5A5247]">No books matched "{searchQuery}"</p>
              <p className="text-xs text-[#8F8475] mt-1 max-w-sm mx-auto">
                Try searching by broader terms like "Fiction", "History", or use the Mood & Vibe search for thematic inquiries.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-1.5 text-xs font-semibold text-[#844C23] hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-[#F2EDE4] border-t border-[#E8E2D8] flex items-center justify-between text-[11px] text-[#7B7163]">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-white/80 rounded border border-[#D5CDC1]">↵</kbd> to inspect
          </span>
          <span>Instant live query & AI literary concierge</span>
        </div>

      </div>
    </div>
  );
};
