import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CreditCard, CheckCircle, Truck, Package, ArrowRight, Printer, RefreshCw, Sparkles, Gift } from 'lucide-react';
import { useBookStore } from '../context/BookStoreContext';
import { ShippingAddress, PaymentDetails, Order } from '../types/book';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    discountAmount,
    giftWrap,
    giftWrapFee,
    createOrder,
    lastCreatedOrder,
    setIsOrderHistoryOpen,
  } = useBookStore();

  const [step, setStep] = useState<1 | 2 | 3 | 'success'>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Shipping form state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: 'Clara Sterling',
    email: 'clara.sterling@oxford-folio.org',
    phone: '+1 (555) 234-8901',
    addressLine1: '742 Evergreen Terrace',
    addressLine2: 'Apt 4B',
    city: 'Cambridge',
    state: 'MA',
    postalCode: '02138',
    country: 'United States',
  });

  const [isGift, setIsGift] = useState(giftWrap);
  const [giftMessage, setGiftMessage] = useState('For a quiet evening with tea and literature.');

  // Delivery method
  const deliveryMethods = [
    {
      id: 'standard',
      name: 'Standard Carbon-Neutral Book Post',
      estimatedDays: '3–5 business days',
      price: subtotal >= 50 ? 0.00 : 4.50,
      description: 'Packaged in heavy recycled corrugated kraft with archival corner protectors.',
    },
    {
      id: 'priority',
      name: 'Priority Book Courier',
      estimatedDays: '1–2 business days',
      price: 7.50,
      description: 'Expedited air courier with signature confirmation upon arrival.',
    },
    {
      id: 'white_glove',
      name: 'White-Glove Binder’s Delivery',
      estimatedDays: '2 business days',
      price: 16.00,
      description: 'Hand-inspected, wrapped in Japanese washi paper with custom wax-embossed seal.',
    },
  ];

  const [selectedDelivery, setSelectedDelivery] = useState(deliveryMethods[0]);

  // Payment form state
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    paymentMethod: 'card',
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: 'CLARA STERLING',
    expiry: '08/28',
    cvv: '849',
  });

  if (!isCheckoutOpen) return null;

  const currentShippingCost = selectedDelivery.price;
  const estimatedTax = (subtotal - discountAmount) * 0.06;
  const grandTotal = Math.max(0, subtotal - discountAmount + currentShippingCost + estimatedTax + (isGift ? 4.50 : 0));

  const handleFillTestCard = () => {
    setPaymentDetails({
      paymentMethod: 'card',
      cardNumber: '4532 8920 1148 9021',
      cardHolder: 'CLARA STERLING',
      expiry: '11/29',
      cvv: '492',
    });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate high-security bank payment authorization
    await new Promise(resolve => setTimeout(resolve, 1200));

    const order = createOrder({
      items: cart,
      shippingAddress,
      deliveryMethod: selectedDelivery,
      paymentMethod: paymentDetails.paymentMethod === 'card' 
        ? `Card ending in ${paymentDetails.cardNumber?.slice(-4) || '4242'}`
        : paymentDetails.paymentMethod === 'apple_pay' ? 'Apple Pay' : 'Google Pay',
      subtotal,
      discount: discountAmount,
      shippingCost: currentShippingCost,
      tax: estimatedTax,
      total: grandTotal,
      isGift,
      giftMessage: isGift ? giftMessage : undefined,
    });

    setCreatedOrder(order);
    setIsProcessing(false);
    setStep('success');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      
      <div 
        className="w-full max-w-4xl bg-[#FAF8F5] text-[#24211D] rounded-2xl shadow-2xl border border-[#E2D9CB] overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E0D2] bg-[#F5EFE5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#844C23]" />
            <div>
              <h3 className="font-editorial text-xl font-medium text-[#1F1C18]">
                {step === 'success' ? 'Order Confirmation' : 'Secure Book Checkout'}
              </h3>
              <p className="text-[11px] text-[#7B7163]">
                Bank-Grade 256-bit Encrypted Transaction · Central Archive Fulfillment
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-[#5A5247] hover:text-[#1F1C18] hover:bg-[#EAE2D3] rounded-md transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (when not success) */}
        {step !== 'success' && (
          <div className="px-6 py-2.5 bg-[#EFE9DF] border-b border-[#E2D9CB] flex items-center justify-between text-xs text-[#63594C]">
            <div className="flex items-center gap-4 sm:gap-8">
              <button
                onClick={() => setStep(1)}
                className={`flex items-center gap-1.5 font-medium ${step === 1 ? 'text-[#844C23] font-bold' : ''}`}
              >
                <span>1. Shipping</span>
              </button>
              <span aria-hidden="true" className="text-[#AFA495]">→</span>
              <button
                onClick={() => setStep(2)}
                className={`flex items-center gap-1.5 font-medium ${step === 2 ? 'text-[#844C23] font-bold' : ''}`}
              >
                <span>2. Delivery</span>
              </button>
              <span aria-hidden="true" className="text-[#AFA495]">→</span>
              <button
                onClick={() => setStep(3)}
                className={`flex items-center gap-1.5 font-medium ${step === 3 ? 'text-[#844C23] font-bold' : ''}`}
              >
                <span>3. Payment & Review</span>
              </button>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-[#3A7045] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PCI-DSS Level 1</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {/* STEP 1: SHIPPING */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              <div className="md:col-span-7 space-y-4">
                <div>
                  <h4 className="font-editorial text-xl font-medium text-[#1F1C18]">
                    Shipping & Recipient Details
                  </h4>
                  <p className="text-xs text-[#7B7163]">
                    Where should we send your carefully packed volumes?
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-[#443D34] block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5CDC1] bg-white text-[#1F1C18] focus:ring-1 focus:ring-[#844C23]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#443D34] block mb-1">Email (for dispatch notes)</label>
                      <input
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5CDC1] bg-white text-[#1F1C18] focus:ring-1 focus:ring-[#844C23]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#443D34] block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5CDC1] bg-white text-[#1F1C18] focus:ring-1 focus:ring-[#844C23]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#443D34] block mb-1">Street Address</label>
                    <input
                      type="text"
                      value={shippingAddress.addressLine1}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5CDC1] bg-white text-[#1F1C18] focus:ring-1 focus:ring-[#844C23]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#443D34] block mb-1">City</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5CDC1] bg-white text-[#1F1C18] focus:ring-1 focus:ring-[#844C23]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#443D34] block mb-1">State / Province</label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5CDC1] bg-white text-[#1F1C18] focus:ring-1 focus:ring-[#844C23]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#443D34] block mb-1">ZIP / Postal</label>
                      <input
                        type="text"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5CDC1] bg-white text-[#1F1C18] focus:ring-1 focus:ring-[#844C23]"
                      />
                    </div>
                  </div>

                  {/* Gift option */}
                  <div className="pt-2 border-t border-[#EAE2D3]">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#24211D]">
                      <input
                        type="checkbox"
                        checked={isGift}
                        onChange={(e) => setIsGift(e.target.checked)}
                        className="accent-[#844C23] rounded"
                      />
                      <Gift className="w-4 h-4 text-[#844C23]" />
                      <span>This order is a gift (includes personalized handwritten card)</span>
                    </label>

                    {isGift && (
                      <div className="mt-2.5">
                        <label className="text-[11px] font-semibold text-[#7B7163] block mb-1">
                          Personalized Gift Note (inscribed in calligraphy):
                        </label>
                        <textarea
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          rows={2}
                          className="w-full p-2.5 text-xs rounded-lg border border-[#D5CDC1] bg-white text-[#1F1C18]"
                        />
                      </div>
                    )}
                  </div>

                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#24211D] hover:bg-[#3E3831] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Delivery Method</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Order Mini Summary on side */}
              <div className="md:col-span-5 bg-[#F5EFE5] p-5 rounded-xl border border-[#E5DECDB] space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7B7163] block">
                  Items in Shipment ({cart.length})
                </span>

                <div className="divide-y divide-[#E8E0D2] max-h-60 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={`${item.book.id}-${item.format}`} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="min-w-0 pr-2">
                        <span className="font-editorial font-medium block truncate text-[#1F1C18]">{item.book.title}</span>
                        <span className="text-[11px] text-[#7B7163]">{item.format} · Qty: {item.quantity}</span>
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-[#1F1C18] shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#E8DFC8] space-y-1 text-xs text-[#5A5247]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#3A7045]">
                      <span>Discount</span>
                      <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-sm text-[#1F1C18] pt-2 border-t border-[#E4DAC9]">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums">${(subtotal - discountAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: DELIVERY METHOD */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h4 className="font-editorial text-2xl font-medium text-[#1F1C18]">
                  Select Packing & Dispatch Method
                </h4>
                <p className="text-xs text-[#7B7163]">
                  All volumes are protected against transit moisture and corner impact.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {deliveryMethods.map(method => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedDelivery(method)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                      selectedDelivery.id === method.id
                        ? 'bg-[#24211D] text-white border-[#24211D] shadow-sm'
                        : 'bg-white hover:bg-[#F6F2EC] text-[#24211D] border-[#E0D7C9]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{method.name}</span>
                        <span className={`text-[11px] font-mono ${
                          selectedDelivery.id === method.id ? 'text-[#DCD5C9]' : 'text-[#7B7163]'
                        }`}>
                          · {method.estimatedDays}
                        </span>
                      </div>
                      <p className={`text-xs ${
                        selectedDelivery.id === method.id ? 'text-[#D5CEC2]' : 'text-[#63594C]'
                      }`}>
                        {method.description}
                      </p>
                    </div>

                    <span className="font-mono tabular-nums font-semibold text-sm shrink-0">
                      {method.price === 0 ? 'Complimentary' : `$${method.price.toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-medium text-[#5A5247] hover:text-[#1F1C18]"
                >
                  Back to Shipping
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#24211D] hover:bg-[#3E3831] rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT & REVIEW */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              <div className="md:col-span-7 space-y-5">
                <div>
                  <h4 className="font-editorial text-2xl font-medium text-[#1F1C18]">
                    Payment Details
                  </h4>
                  <p className="text-xs text-[#7B7163]">
                    Encrypted with end-to-end tokenization.
                  </p>
                </div>

                {/* One-Touch Express Pay buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setPaymentDetails({ ...paymentDetails, paymentMethod: 'apple_pay' });
                    }}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                      paymentDetails.paymentMethod === 'apple_pay'
                        ? 'bg-[#1F1C18] text-white border-[#1F1C18]'
                        : 'bg-white hover:bg-[#F3EFE9] text-[#1F1C18] border-[#D5CDC1]'
                    }`}
                  >
                    <span>Pay with</span>
                    <strong className="font-sans">Pay</strong>
                  </button>
                  <button
                    onClick={() => {
                      setPaymentDetails({ ...paymentDetails, paymentMethod: 'google_pay' });
                    }}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                      paymentDetails.paymentMethod === 'google_pay'
                        ? 'bg-[#1F1C18] text-white border-[#1F1C18]'
                        : 'bg-white hover:bg-[#F3EFE9] text-[#1F1C18] border-[#D5CDC1]'
                    }`}
                  >
                    <span>Pay with</span>
                    <strong className="font-sans text-[#4285F4]">G</strong>
                    <strong className="font-sans">Pay</strong>
                  </button>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-[#E2D9CB]"></div>
                  <span className="flex-shrink mx-4 text-[11px] uppercase tracking-wider text-[#8F8475]">Or Credit / Debit Card</span>
                  <div className="flex-grow border-t border-[#E2D9CB]"></div>
                </div>

                {/* Credit Card Form */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-[#443D34]">Card Number</label>
                    <button
                      onClick={handleFillTestCard}
                      className="text-[11px] text-[#844C23] hover:underline font-medium"
                    >
                      Fill Demo Test Card
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                      placeholder="4532 •••• •••• 9021"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#D5CDC1] bg-white text-[#1F1C18] font-mono focus:ring-1 focus:ring-[#844C23]"
                    />
                    <CreditCard className="w-4 h-4 text-[#8F8475] absolute left-3 top-2.5" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#443D34] block mb-1">Expiration (MM/YY)</label>
                      <input
                        type="text"
                        value={paymentDetails.expiry}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                        placeholder="12/28"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5CDC1] bg-white text-[#1F1C18] font-mono focus:ring-1 focus:ring-[#844C23]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#443D34] block mb-1">Security Code (CVV)</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={paymentDetails.cvv}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                        placeholder="•••"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5CDC1] bg-white text-[#1F1C18] font-mono focus:ring-1 focus:ring-[#844C23]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#443D34] block mb-1">Name on Card</label>
                    <input
                      type="text"
                      value={paymentDetails.cardHolder}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardHolder: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5CDC1] bg-white text-[#1F1C18] uppercase focus:ring-1 focus:ring-[#844C23]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-xs font-medium text-[#5A5247] hover:text-[#1F1C18]"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="px-6 py-3 text-xs font-semibold text-white bg-[#844C23] hover:bg-[#6D3D1B] rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Authorizing Transaction...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Authorize Payment · ${grandTotal.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Order Grand Summary */}
              <div className="md:col-span-5 bg-[#F5EFE5] p-5 rounded-xl border border-[#E5DECDB] space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7B7163] block">
                  Final Order Summary
                </span>

                <div className="space-y-2 text-xs text-[#5A5247] pb-3 border-b border-[#E8E0D2]">
                  <div className="flex justify-between">
                    <span>Books Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="font-mono tabular-nums text-[#1F1C18]">${subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#3A7045]">
                      <span>Promotional Savings</span>
                      <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery ({selectedDelivery.name.slice(0, 20)}...)</span>
                    <span className="font-mono tabular-nums text-[#1F1C18]">
                      {currentShippingCost === 0 ? 'Free' : `$${currentShippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  {isGift && (
                    <div className="flex justify-between">
                      <span>Artisanal Gift Wrapping & Card</span>
                      <span className="font-mono tabular-nums text-[#1F1C18]">+$4.50</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated State Tax (6%)</span>
                    <span className="font-mono tabular-nums text-[#1F1C18]">${estimatedTax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline text-[#1F1C18] pt-1">
                  <span className="font-serif font-semibold text-base">Total Due</span>
                  <span className="font-mono tabular-nums text-2xl font-bold text-[#844C23]">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>

                {/* Recipient summary badge */}
                <div className="p-3 bg-[#EBE4D8] rounded-lg text-[11px] text-[#554C3F] space-y-1">
                  <span className="font-semibold block text-[#362E23]">Ship To:</span>
                  <p>{shippingAddress.fullName}</p>
                  <p>{shippingAddress.addressLine1}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                </div>

              </div>

            </div>
          )}

          {/* STEP: SUCCESS / CONFIRMED RECEIPT */}
          {step === 'success' && createdOrder && (
            <div className="max-w-2xl mx-auto space-y-6 text-center py-4">
              
              <div className="w-16 h-16 bg-[#E2F0D9] text-[#2E7D32] rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#844C23] font-bold">
                  Order Received & Registered
                </span>
                <h4 className="font-editorial text-3xl font-medium text-[#1F1C18] mt-1">
                  Thank you for supporting independent letters.
                </h4>
                <p className="text-xs text-[#7B7163] mt-2 font-mono tabular-nums">
                  Reference: <strong className="text-[#1F1C18]">{createdOrder.id}</strong> · Tracking Code: <strong className="text-[#844C23]">{createdOrder.trackingNumber}</strong>
                </p>
              </div>

              {/* Order status tracking timeline */}
              <div className="p-5 bg-[#F5EFE5] rounded-xl border border-[#E5DECDB] text-left">
                <span className="text-xs font-semibold text-[#1F1C18] block mb-3">Fulfillment & Binding Timeline</span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-[#844C23] text-white flex items-center justify-center mx-auto text-xs font-bold">✓</div>
                    <span className="font-semibold block text-[#1F1C18] text-[11px]">Order Confirmed</span>
                    <span className="text-[10px] text-[#8F8475]">Today</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-[#24211D] text-white flex items-center justify-center mx-auto text-xs font-bold">2</div>
                    <span className="font-medium block text-[#1F1C18] text-[11px]">Archival Inspect</span>
                    <span className="text-[10px] text-[#8F8475]">Tomorrow</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-[#E5DECDB] text-[#7B7163] flex items-center justify-center mx-auto text-xs font-bold">3</div>
                    <span className="block text-[#7B7163] text-[11px]">In Transit</span>
                    <span className="text-[10px] text-[#8F8475]">{createdOrder.deliveryMethod.estimatedDays}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-[#E5DECDB] text-[#7B7163] flex items-center justify-center mx-auto text-xs font-bold">4</div>
                    <span className="block text-[#7B7163] text-[11px]">Delivered</span>
                    <span className="text-[10px] text-[#8F8475]">At Doorstep</span>
                  </div>
                </div>
              </div>

              {/* Printable Packing Slip / Receipt preview */}
              <div className="p-5 bg-white rounded-xl border border-[#E0D7C9] text-left space-y-3 text-xs text-[#443D34]">
                <div className="flex justify-between items-center pb-2 border-b border-[#EFE9DF]">
                  <span className="font-editorial text-base font-semibold text-[#1F1C18]">The Bindery & Co. — Invoice & Receipt</span>
                  <span className="text-[11px] text-[#7B7163]">{createdOrder.date}</span>
                </div>

                <div className="divide-y divide-[#F2ECE1]">
                  {createdOrder.items.map(item => (
                    <div key={`${item.book.id}-${item.format}`} className="py-2 flex justify-between">
                      <span>{item.book.title} ({item.format}) × {item.quantity}</span>
                      <span className="font-mono tabular-nums font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#EFE9DF] flex justify-between font-bold text-sm text-[#1F1C18]">
                  <span>Total Paid via {createdOrder.paymentMethod}</span>
                  <span className="font-mono tabular-nums">${createdOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handlePrintReceipt}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-[#24211D] bg-[#EAE2D3] hover:bg-[#DDD3C2] rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice Receipt</span>
                </button>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setIsOrderHistoryOpen(true);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-[#24211D] hover:bg-[#3E3831] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>View All Past Orders</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
