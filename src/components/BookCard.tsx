import React from 'react';
import { Heart, ShoppingBag, BookOpen, Star } from 'lucide-react';
import { Book } from '../types/book';
import { useBookStore } from '../context/BookStoreContext';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    openDetailModal,
    openExcerptModal,
  } = useBookStore();

  const isFavorited = isInWishlist(book.id);

  return (
    <article className="group flex flex-col bg-white/70 hover:bg-white rounded-xl p-3 sm:p-4 border border-[#E8E2D8] hover:border-[#D0C5B4] hover:shadow-lg transition-all duration-200">
      
      {/* Cover Showcase Area */}
      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-[#EFE9DF] mb-3.5 shadow-sm border border-[#E2D9CB]">
        
        {/* Cover Image with Fallback */}
        <img
          src={book.coverImage}
          alt={`Book cover of ${book.title} by ${book.author}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Fallback stylized bookcloth spine & debossing overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-black/60 via-transparent to-black/20"
        >
          {/* Subtle top indicator: staff pick or award */}
          <div className="flex justify-between items-start">
            {book.staffPick ? (
              <span className="text-[11px] font-medium tracking-wide text-white/90 drop-shadow">
                Staff Curation
              </span>
            ) : <span />}

            <span className="text-[11px] font-mono text-white/90 drop-shadow">
              {book.publicationYear}
            </span>
          </div>

          <div className="text-white text-xs space-y-1">
            <p className="line-clamp-2 italic text-white/90 text-[11px]">
              "{book.editorialQuote.quote.slice(0, 85)}..."
            </p>
          </div>
        </div>

        {/* Quick action buttons floating on top right */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(book.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
              isFavorited
                ? 'bg-[#844C23] text-white'
                : 'bg-[#FAF8F5]/90 text-[#443D34] hover:bg-white hover:text-[#844C23]'
            }`}
            title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Quick Preview bar on hover bottom */}
        <div className="absolute bottom-2 left-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openExcerptModal(book);
            }}
            className="flex-1 py-1.5 px-2 bg-[#FAF8F5]/95 hover:bg-white text-[#24211D] text-xs font-medium rounded-md shadow-sm border border-[#DDD3C2] flex items-center justify-center gap-1.5 backdrop-blur-sm transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#844C23]" />
            Look Inside
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDetailModal(book);
            }}
            className="py-1.5 px-3 bg-[#24211D] hover:bg-[#38332C] text-white text-xs font-medium rounded-md shadow-sm transition-colors"
          >
            Inspect
          </button>
        </div>

      </div>

      {/* Book Metadata & Title */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Zero-Pill unboxed genre & format line */}
          <div className="flex items-center gap-1.5 text-xs text-[#7B7163] mb-1">
            <span>{book.genre}</span>
            <span aria-hidden="true">·</span>
            <span>{book.formats[0]?.format || 'Hardcover'}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => openDetailModal(book)}
            className="font-editorial text-lg sm:text-xl font-medium text-[#1F1C18] group-hover:text-[#844C23] transition-colors line-clamp-1 cursor-pointer"
            title={book.title}
          >
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-[#5A5247] mt-0.5 line-clamp-1">
            {book.author}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-[#7B7163] mt-2">
            <div className="flex items-center text-[#96582A]">
              <Star className="w-3.5 h-3.5 fill-[#96582A]" />
            </div>
            <span className="font-mono tabular-nums text-[#38332C] font-medium">{book.rating.toFixed(1)}</span>
            <span className="text-[#8F8475]">({book.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Add to Bag CTA */}
        <div className="pt-3 mt-3 border-t border-[#EFE9DF] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono tabular-nums text-base font-semibold text-[#1F1C18]">
              ${book.price.toFixed(2)}
            </span>
            {book.originalPrice && (
              <span className="font-mono tabular-nums text-xs text-[#8F8475] line-through">
                ${book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(book, 'Hardcover', 1)}
            className="px-3 py-1.5 text-xs font-semibold text-[#1F1C18] hover:text-[#FAF8F5] bg-[#F1ECE3] hover:bg-[#24211D] rounded-lg transition-colors border border-[#DDD3C2] hover:border-[#24211D] flex items-center gap-1.5 cursor-pointer"
            aria-label={`Add ${book.title} to reading bag`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

      </div>

    </article>
  );
};
