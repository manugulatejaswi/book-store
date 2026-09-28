import React from 'react';
import { X, Package, Clock, ExternalLink, Printer, ShoppingBag } from 'lucide-react';
import { useBookStore } from '../context/BookStoreContext';

export const OrderHistoryModal: React.FC = () => {
  const { isOrderHistoryOpen, setIsOrderHistoryOpen, orders, addToCart } = useBookStore();

  if (!isOrderHistoryOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div 
        className="w-full max-w-3xl bg-[#FAF8F5] text-[#24211D] rounded-2xl shadow-2xl border border-[#E2D9CB] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#E8E0D2] bg-[#F5EFE5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-[#844C23]" />
            <div>
              <h3 className="font-editorial text-xl font-medium text-[#1F1C18]">
                Your Order Archive & Deliveries
              </h3>
              <p className="text-xs text-[#7B7163]">
                Track incoming volumes and review past receipts
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOrderHistoryOpen(false)}
            className="p-1.5 text-[#5A5247] hover:text-[#1F1C18] hover:bg-[#EAE2D3] rounded-md transition-colors"
            aria-label="Close orders"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {orders.length > 0 ? (
            orders.map(order => (
              <div key={order.id} className="p-5 bg-white rounded-xl border border-[#E2D9CB] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EFE9DF] gap-2">
                  <div>
                    <span className="font-mono tabular-nums text-xs font-bold text-[#1F1C18]">{order.id}</span>
                    <span className="text-xs text-[#7B7163] block sm:inline sm:ml-2">Ordered on {order.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#EBF4EB] text-[#2E7D32] border border-[#CDE5CD]">
                      {order.status}
                    </span>
                    <span className="font-mono tabular-nums text-xs font-semibold text-[#844C23]">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="divide-y divide-[#F4EFE7]">
                  {order.items.map(item => (
                    <div key={`${item.book.id}-${item.format}`} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 aspect-[3/4] bg-[#EAE3D6] rounded overflow-hidden shadow-2xs">
                          <img
                            src={item.book.coverImage}
                            alt={item.book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-editorial text-sm font-medium text-[#1F1C18] block">{item.book.title}</span>
                          <span className="text-[11px] text-[#7B7163]">{item.book.author} · {item.format} (Qty: {item.quantity})</span>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(item.book, item.format, 1)}
                        className="px-2.5 py-1 text-xs text-[#5A5247] hover:text-[#1F1C18] hover:bg-[#F3EFE9] rounded border border-[#DDD3C2] transition-colors flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Tracking & Recipient footer */}
                <div className="pt-3 border-t border-[#EFE9DF] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#6E6455] gap-2">
                  <div>
                    <span className="text-[#8F8475]">Tracking Number: </span>
                    <strong className="font-mono text-[#1F1C18]">{order.trackingNumber}</strong>
                    <span className="block text-[11px] text-[#7B7163]">
                      Delivering to: {order.shippingAddress.fullName}, {order.shippingAddress.city}
                    </span>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 text-xs text-[#24211D] bg-[#F3EFE9] hover:bg-[#EAE2D3] rounded border border-[#D5CDC1] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-[#7B7163]">
              <Package className="w-10 h-10 text-[#C4B7A4] mx-auto mb-3" />
              <p className="font-editorial text-lg text-[#1F1C18]">No orders recorded yet</p>
              <p className="text-xs text-[#8F8475] mt-1 max-w-sm mx-auto">
                Once you complete checkout, your parcel tracking, packing slips, and receipts will appear here.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#E8E0D2] bg-[#F5EFE5] flex justify-end">
          <button
            onClick={() => setIsOrderHistoryOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-[#1F1C18] hover:bg-[#EAE2D3] rounded-lg transition-colors border border-[#DDD3C2]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
