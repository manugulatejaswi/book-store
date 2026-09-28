import React, { useState } from 'react';
import { X, Heart, ShoppingBag, BookOpen, Star, ShieldCheck, Truck, RotateCcw, Share2, Check } from 'lucide-react';
import { useBookStore } from '../context/BookStoreContext';
import { BookFormat } from '../types/book';

export const BookDetailModal: React.FC = () => {
  const {
    activeDetailBook,
    closeDetailModal,
    addToCart,
    toggleWishlist,
    isInWishlist,
    openExcerptModal,
    showToast,
  } = useBookStore();

  const [selectedFormat, setSelectedFormat] = useState<BookFormat>('Hardcover');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'synopsis' | 'specs' | 'reviews'>('synopsis');

  if (!activeDetailBook) return null;

  const currentFormatOption = activeDetailBook.formats.find(f => f.format === selectedFormat) || activeDetailBook.formats[0];
  const unitPrice = currentFormatOption ? currentFormatOption.price : activeDetailBook.price;
  const isFavorited = isInWishlist(activeDetailBook.id);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Book link copied to clipboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div 
        className="w-full max-w-4xl bg-[#FAF8F5] text-[#24211D] rounded-2xl shadow-2xl border border-[#E2D9CB] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-3.5 border-b border-[#E8E0D2] bg-[#F5EFE5] flex items-center justify-between text-xs text-[#5A5247]">
          {/* Zero-Pill unboxed hierarchy */}
          <div className="flex items-center gap-2 text-xs text-[#7B7163]">
            <span>{activeDetailBook.genre}</span>
            <span aria-hidden="true">/</span>
            <span>{activeDetailBook.subGenre}</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#1F1C18] font-medium truncate max-w-[200px] sm:max-w-xs">{activeDetailBook.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-1.5 text-[#5A5247] hover:text-[#1F1C18] hover:bg-[#EAE2D3] rounded-md transition-colors"
              title="Share book link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={closeDetailModal}
              className="p-1.5 text-[#5A5247] hover:text-[#1F1C18] hover:bg-[#EAE2D3] rounded-md transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cover & Excerpt Trigger (5 cols) */}
            <div className="md:col-span-5 flex flex-col items-center">
              
              <div className="relative w-full aspect-[3/4] max-w-[320px] rounded-xl overflow-hidden shadow-lg border border-[#DED4C5] bg-[#EAE3D6] group">
                <img
                  src={activeDetailBook.coverImage}
                  alt={activeDetailBook.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Quick Excerpt Preview Button floating on cover */}
                <button
                  onClick={() => openExcerptModal(activeDetailBook)}
                  className="absolute bottom-4 left-4 right-4 py-2.5 px-4 bg-[#FAF8F5]/95 hover:bg-white text-[#24211D] text-xs font-semibold rounded-lg shadow-md border border-[#D5CDC1] flex items-center justify-center gap-2 backdrop-blur-sm transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#844C23]" />
                  <span>Read Chapter 1 Excerpt</span>
                </button>
              </div>

              {/* Editorial Quote callout below cover */}
              <div className="mt-5 p-4 bg-[#F3ECE0] rounded-xl border border-[#E4DAC9] text-xs text-[#52483C] max-w-[320px] w-full">
                <p className="italic font-serif text-[13px] leading-relaxed">
                  "{activeDetailBook.editorialQuote.quote}"
                </p>
                <span className="block mt-2 text-[11px] font-sans font-medium text-[#844C23]">
                  — {activeDetailBook.editorialQuote.source}
                </span>
              </div>

            </div>

            {/* Right Column: Contiguous Purchase Module (7 cols) */}
            <div className="md:col-span-7 flex flex-col">
              
              {/* Title & Author */}
              <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-medium text-[#1F1C18] tracking-tight leading-tight">
                {activeDetailBook.title}
              </h2>
              
              <p className="text-sm sm:text-base text-[#5A5247] mt-1 font-serif">
                by <span className="text-[#1F1C18] font-semibold">{activeDetailBook.author}</span>
              </p>

              {/* Rating & Metadata unboxed */}
              <div className="flex items-center gap-3 text-xs text-[#7B7163] mt-3 pb-4 border-b border-[#EFE9DF]">
                <div className="flex items-center gap-1 text-[#96582A]">
                  <Star className="w-4 h-4 fill-[#96582A]" />
                  <span className="font-mono tabular-nums font-semibold text-[#1F1C18]">{activeDetailBook.rating.toFixed(1)}</span>
                </div>
                <span aria-hidden="true">·</span>
                <span className="underline decoration-[#D0C5B4]">{activeDetailBook.reviewCount} customer reviews</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#3A7045] flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" /> In Stock
                </span>
              </div>

              {/* Format Selection Selector (Interactive filter tab) */}
              <div className="mt-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7B7163] block mb-2">
                  Select Format & Edition
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {activeDetailBook.formats.map((fmt) => (
                    <button
                      key={fmt.format}
                      onClick={() => setSelectedFormat(fmt.format)}
                      className={`p-2.5 text-left rounded-lg border text-xs transition-all ${
                        selectedFormat === fmt.format
                          ? 'bg-[#24211D] text-white border-[#24211D] shadow-sm'
                          : 'bg-[#F4F0EB] text-[#443D34] border-[#DDD5C7] hover:border-[#844C23]'
                      }`}
                    >
                      <span className="font-medium block truncate">{fmt.format}</span>
                      <span className={`font-mono tabular-nums font-semibold block mt-1 ${
                        selectedFormat === fmt.format ? 'text-[#E8DCC9]' : 'text-[#844C23]'
                      }`}>
                        ${fmt.price.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
                {currentFormatOption?.notes && (
                  <p className="text-[11px] text-[#7B7163] mt-2 italic">
                    *{currentFormatOption.notes}
                  </p>
                )}
              </div>

              {/* Contiguous Purchase Action Block */}
              <div className="mt-6 p-4 sm:p-5 bg-[#F6F1E7] rounded-xl border border-[#E5DECDB] space-y-4">
                
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-[#7B7163]">Total Price:</span>
                    <div className="font-mono tabular-nums text-2xl font-bold text-[#1F1C18]">
                      ${(unitPrice * quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#DDD3C2] rounded-lg bg-white overflow-hidden shadow-2xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-sm text-[#5A5247] hover:bg-[#F3EFE9] transition-colors"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 font-mono tabular-nums text-xs font-semibold text-[#1F1C18] min-w-[28px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-sm text-[#5A5247] hover:bg-[#F3EFE9] transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Primary Add to Bag & Wishlist Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      addToCart(activeDetailBook, selectedFormat, quantity);
                      closeDetailModal();
                    }}
                    className="flex-1 py-3 px-5 text-xs font-semibold text-white bg-[#24211D] hover:bg-[#38332C] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Reading Bag · ${(unitPrice * quantity).toFixed(2)}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(activeDetailBook.id)}
                    className={`p-3 rounded-lg border transition-colors ${
                      isFavorited
                        ? 'bg-[#844C23] text-white border-[#844C23]'
                        : 'bg-white text-[#5A5247] hover:text-[#844C23] border-[#DDD3C2]'
                    }`}
                    title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    aria-label="Toggle wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
                  </button>
                </div>

                {/* Trust and Delivery Callouts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#6E6455] pt-2 border-t border-[#E8DFC8]">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#844C23]" />
                    <span>Free Shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#844C23]" />
                    <span>Archival Acid-Free Book Packaging</span>
                  </div>
                </div>

              </div>

              {/* Tabs for Synopsis, Specs, Reviews */}
              <div className="mt-8 border-b border-[#EFE9DF] flex gap-6 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('synopsis')}
                  className={`pb-2.5 transition-colors relative ${
                    activeTab === 'synopsis'
                      ? 'text-[#1F1C18] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#844C23]'
                      : 'text-[#7B7163] hover:text-[#1F1C18]'
                  }`}
                >
                  Synopsis
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2.5 transition-colors relative ${
                    activeTab === 'specs'
                      ? 'text-[#1F1C18] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#844C23]'
                      : 'text-[#7B7163] hover:text-[#1F1C18]'
                  }`}
                >
                  Book Specifications
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2.5 transition-colors relative ${
                    activeTab === 'reviews'
                      ? 'text-[#1F1C18] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#844C23]'
                      : 'text-[#7B7163] hover:text-[#1F1C18]'
                  }`}
                >
                  Patron Reviews ({activeDetailBook.reviews.length})
                </button>
              </div>

              {/* Tab Contents */}
              <div className="py-4 text-xs text-[#443D34] leading-relaxed">
                {activeTab === 'synopsis' && (
                  <div className="space-y-4">
                    <p className="font-serif text-sm leading-relaxed text-[#2C2721]">
                      {activeDetailBook.synopsis}
                    </p>
                    <div className="pt-2">
                      <span className="font-semibold text-[#1F1C18] block mb-1">About the Author</span>
                      <p className="text-xs text-[#5A5247]">{activeDetailBook.authorBio}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                    <div>
                      <dt className="text-[#8F8475]">ISBN-13</dt>
                      <dd className="font-mono tabular-nums font-medium text-[#1F1C18]">{activeDetailBook.isbn}</dd>
                    </div>
                    <div>
                      <dt className="text-[#8F8475]">Publisher</dt>
                      <dd className="font-medium text-[#1F1C18]">{activeDetailBook.publisher}</dd>
                    </div>
                    <div>
                      <dt className="text-[#8F8475]">Page Count</dt>
                      <dd className="font-mono tabular-nums font-medium text-[#1F1C18]">{activeDetailBook.pages} pages</dd>
                    </div>
                    <div>
                      <dt className="text-[#8F8475]">Publication Date</dt>
                      <dd className="font-medium text-[#1F1C18]">{activeDetailBook.publicationYear}</dd>
                    </div>
                    <div>
                      <dt className="text-[#8F8475]">Language</dt>
                      <dd className="font-medium text-[#1F1C18]">English</dd>
                    </div>
                    <div>
                      <dt className="text-[#8F8475]">Binding Standard</dt>
                      <dd className="font-medium text-[#1F1C18]">Smyth-Sewn Archival Quality</dd>
                    </div>
                  </dl>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {activeDetailBook.reviews.map(rev => (
                      <div key={rev.id} className="pb-3 border-b border-[#EFE9DF] last:border-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#1F1C18]">{rev.reviewer}</span>
                          <span className="text-[11px] text-[#8F8475]">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#96582A] my-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#96582A]" />
                          ))}
                        </div>
                        <p className="text-xs text-[#52483C]">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
