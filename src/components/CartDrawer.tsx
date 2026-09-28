import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Gift, Tag, Check, ShieldCheck } from 'lucide-react';
import { useBookStore } from '../context/BookStoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    freeShippingThreshold,
    promoCode,
    setPromoCode,
    promoApplied,
    applyPromoCode,
    discountAmount,
    giftWrap,
    setGiftWrap,
    giftWrapFee,
    setIsCheckoutOpen,
  } = useBookStore();

  const [inputCode, setInputCode] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = () => {
    if (!inputCode) return;
    const res = applyPromoCode(inputCode);
    setPromoFeedback(res.message);
    if (res.success) {
      setInputCode('');
    }
  };

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const finalSubtotal = Math.max(0, subtotal - discountAmount + giftWrapFee);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl border-l border-[#E2D9CB] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cart Header */}
          <div className="px-6 py-4 border-b border-[#E8E0D2] bg-[#F5EFE5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#844C23]" />
              <h3 className="font-editorial text-xl font-medium text-[#1F1C18]">
                Your Reading Bag
              </h3>
              <span className="text-xs text-[#7B7163] font-mono tabular-nums">
                ({cart.reduce((s, i) => s + i.quantity, 0)})
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#5A5247] hover:text-[#1F1C18] hover:bg-[#EAE2D3] rounded-md transition-colors"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-[#F0EAE0] border-b border-[#E4DAC9] text-xs text-[#52483C]">
            <div className="flex justify-between items-center mb-1.5">
              {amountToFreeShipping > 0 ? (
                <span>
                  Add <strong className="font-mono text-[#844C23]">${amountToFreeShipping.toFixed(2)}</strong> more for complimentary shipping
                </span>
              ) : (
                <span className="font-medium text-[#3A7045] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> You've unlocked Complimentary Standard Shipping!
                </span>
              )}
              <span className="font-mono tabular-nums text-[11px] text-[#7B7163]">
                ${subtotal.toFixed(2)} / ${freeShippingThreshold.toFixed(2)}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#DDD3C2] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#844C23] transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Itemized List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#EFE9DF]">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={`${item.book.id}-${item.format}`} className="py-4 flex gap-3.5 group">
                  {/* Thumbnail */}
                  <div className="w-14 aspect-[3/4] bg-[#EAE3D6] rounded overflow-hidden shrink-0 shadow-xs border border-[#DDD3C2]">
                    <img
                      src={item.book.coverImage}
                      alt={item.book.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-editorial text-base font-medium text-[#1F1C18] truncate">
                          {item.book.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.book.id, item.format)}
                          className="text-[#9E9384] hover:text-[#9A3412] p-1 transition-colors"
                          title="Remove item"
                          aria-label={`Remove ${item.book.title} from bag`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-[#7B7163] truncate">{item.book.author}</p>
                      
                      {/* Zero-Pill metadata: unboxed */}
                      <span className="text-[11px] text-[#8F8475] mt-0.5 block">
                        Format: {item.format}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#DDD3C2] rounded bg-white overflow-hidden text-xs">
                        <button
                          onClick={() => updateQuantity(item.book.id, item.format, item.quantity - 1)}
                          className="px-2 py-0.5 text-[#5A5247] hover:bg-[#F3EFE9]"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono tabular-nums text-center min-w-[20px] font-semibold text-[#1F1C18]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.book.id, item.format, item.quantity + 1)}
                          className="px-2 py-0.5 text-[#5A5247] hover:bg-[#F3EFE9]"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Total Line Price */}
                      <span className="font-mono tabular-nums text-sm font-semibold text-[#1F1C18]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-[#7B7163]">
                <ShoppingBag className="w-10 h-10 text-[#C4B7A4] mx-auto mb-3" />
                <p className="font-editorial text-lg text-[#1F1C18]">Your bag is quiet</p>
                <p className="text-xs text-[#8F8475] mt-1 max-w-xs mx-auto">
                  Browse our catalog or take the Reading Matchmaker to discover titles for your nightstand.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-[#844C23] hover:underline"
                >
                  Explore Book Catalog
                </button>
              </div>
            )}
          </div>

          {/* Cart Footer & Checkout Module */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#E8E0D2] bg-[#F5EFE5] space-y-4">
              
              {/* Gift Wrap Toggle */}
              <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-[#E0D7C9] text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#383127]">
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="accent-[#844C23] rounded"
                  />
                  <Gift className="w-4 h-4 text-[#844C23]" />
                  <span>Artisanal Parchment & Wax Seal Gift Wrap (+$4.50)</span>
                </label>
              </div>

              {/* Promo Code Input */}
              <div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="Promo code (try BOOKWORM)"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#D5CDC1] bg-white text-[#1F1C18] focus:outline-none uppercase"
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 text-xs font-medium text-[#24211D] bg-[#EAE2D3] hover:bg-[#DDD3C2] rounded-lg transition-colors border border-[#D0C5B4]"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[11px] text-[#3A7045] mt-1 flex items-center gap-1 font-medium">
                    <Check className="w-3 h-3" /> Active: {promoApplied}
                  </p>
                )}
                {promoFeedback && !promoApplied && (
                  <p className="text-[11px] text-[#A63A2B] mt-1">
                    {promoFeedback}
                  </p>
                )}
              </div>

              {/* Totals Summary */}
              <div className="space-y-1.5 text-xs text-[#5A5247] pt-2 border-t border-[#E8DFC8]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-semibold text-[#1F1C18]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#3A7045]">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums font-semibold">
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {giftWrap && (
                  <div className="flex justify-between">
                    <span>Archival Gift Wrapping</span>
                    <span className="font-mono tabular-nums font-semibold text-[#1F1C18]">
                      +${giftWrapFee.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-semibold text-[#1F1C18] pt-2 border-t border-[#E4DAC9]">
                  <span>Estimated Total</span>
                  <span className="font-mono tabular-nums text-base">
                    ${finalSubtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3 px-4 bg-[#24211D] hover:bg-[#38332C] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7B7163]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#844C23]" />
                <span>Bank-grade 256-bit encryption · 30-day reader guarantee</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
