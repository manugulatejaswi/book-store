import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, CartItem, BookFormat, Order, RecommendationPreferences, CuratorRecommendationResponse } from '../types/book';
import { BOOKS_DATA } from '../data/books';

interface BookStoreContextType {
  books: Book[];
  cart: CartItem[];
  addToCart: (book: Book, format?: BookFormat, quantity?: number) => void;
  removeFromCart: (bookId: string, format: BookFormat) => void;
  updateQuantity: (bookId: string, format: BookFormat, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  discountAmount: number;
  promoApplied: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  giftWrap: boolean;
  setGiftWrap: (val: boolean) => void;
  giftWrapFee: number;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;

  // Modals & Navigation
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isNaturalLanguageSearch: boolean;
  setIsNaturalLanguageSearch: (val: boolean) => void;
  
  // Filters
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
  selectedMood: string;
  setSelectedMood: (mood: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onlyInStock: boolean;
  setOnlyInStock: (val: boolean) => void;
  onlyStaffPicks: boolean;
  setOnlyStaffPicks: (val: boolean) => void;
  resetFilters: () => void;

  // Detail & Excerpt Modals
  activeDetailBook: Book | null;
  openDetailModal: (book: Book) => void;
  closeDetailModal: () => void;
  activeExcerptBook: Book | null;
  openExcerptModal: (book: Book) => void;
  closeExcerptModal: () => void;

  // Checkout & Orders
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'date' | 'trackingNumber' | 'status'>) => Order;
  isOrderHistoryOpen: boolean;
  setIsOrderHistoryOpen: (open: boolean) => void;
  lastCreatedOrder: Order | null;

  // Recommendations & Concierge
  isRecommendationsOpen: boolean;
  setIsRecommendationsOpen: (open: boolean) => void;
  recommendationPreferences: RecommendationPreferences;
  setRecommendationPreferences: React.Dispatch<React.SetStateAction<RecommendationPreferences>>;
  curatorResponse: CuratorRecommendationResponse | null;
  setCuratorResponse: (resp: CuratorRecommendationResponse | null) => void;
  isGeneratingRecs: boolean;
  generateRecommendations: (prefs?: RecommendationPreferences) => Promise<void>;

  // Recently Viewed & Reading Goals
  recentlyViewed: Book[];
  addToRecentlyViewed: (book: Book) => void;
  readingGoal: { target: number; current: number };
  incrementReadingGoal: () => void;

  // Notification Toast
  toast: string | null;
  showToast: (msg: string) => void;
}

const BookStoreContext = createContext<BookStoreContextType | undefined>(undefined);

export const BookStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books] = useState<Book[]>(BOOKS_DATA);
  
  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('folio_cart');
      return saved ? JSON.parse(saved) : [
        {
          book: BOOKS_DATA[0], // The Atlas of Solitude
          format: 'Hardcover' as BookFormat,
          price: 28.00,
          quantity: 1,
        }
      ];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const giftWrapFee = giftWrap ? 4.50 : 0;
  const freeShippingThreshold = 50.00;

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Wishlist persisted
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('folio_wishlist');
      return saved ? JSON.parse(saved) : ['botanical-alchemist', 'nocturne-for-architects'];
    } catch {
      return [];
    }
  });

  // Orders persisted
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('folio_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Search & Filter state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNaturalLanguageSearch, setIsNaturalLanguageSearch] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('All Collections');
  const [selectedFormat, setSelectedFormat] = useState('All Formats');
  const [selectedMood, setSelectedMood] = useState('All Moods');
  const [maxPrice, setMaxPrice] = useState(50);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyStaffPicks, setOnlyStaffPicks] = useState(false);

  // Modals
  const [activeDetailBook, setActiveDetailBook] = useState<Book | null>(null);
  const [activeExcerptBook, setActiveExcerptBook] = useState<Book | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);

  // Recommendations state
  const [recommendationPreferences, setRecommendationPreferences] = useState<RecommendationPreferences>({
    mood: 'Introspective & Quiet',
    tropes: ['Old Manuscripts & Libraries', 'Remote Observatories & Islands'],
    genres: ['Literary Fiction', 'Historical Fiction'],
    lovedBooks: 'Piranesi, Invisible Cities, The English Patient',
    readingPace: 'Immersive & Thoughtful',
  });
  const [curatorResponse, setCuratorResponse] = useState<CuratorRecommendationResponse | null>(null);
  const [isGeneratingRecs, setIsGeneratingRecs] = useState(false);

  // Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState<Book[]>(() => [BOOKS_DATA[1], BOOKS_DATA[2]]);

  // Reading Goal
  const [readingGoal, setReadingGoal] = useState<{ target: number; current: number }>(() => {
    try {
      const saved = localStorage.getItem('folio_reading_goal');
      return saved ? JSON.parse(saved) : { target: 25, current: 16 };
    } catch {
      return { target: 25, current: 16 };
    }
  });

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('folio_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('folio_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('folio_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('folio_reading_goal', JSON.stringify(readingGoal));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [readingGoal]);

  const addToCart = (book: Book, format: BookFormat = 'Hardcover', quantity: number = 1) => {
    const selectedFormatObj = book.formats.find(f => f.format === format) || book.formats[0];
    const unitPrice = selectedFormatObj ? selectedFormatObj.price : book.price;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.book.id === book.id && item.format === format);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { book, format, price: unitPrice, quantity }];
    });

    showToast(`Added "${book.title}" (${format}) to your reading bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (bookId: string, format: BookFormat) => {
    setCart(prev => prev.filter(item => !(item.book.id === bookId && item.format === format)));
    showToast('Item removed from reading bag');
  };

  const updateQuantity = (bookId: string, format: BookFormat, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId, format);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.book.id === bookId && item.format === format ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BOOKWORM') {
      setPromoApplied('BOOKWORM (10% Off Entire Order)');
      setDiscountPercent(0.10);
      showToast('10% Bookworm savings applied!');
      return { success: true, message: '10% discount applied.' };
    }
    if (clean === 'FOLIO15') {
      if (subtotal >= 50) {
        setPromoApplied('FOLIO15 (15% Off Patron Discount)');
        setDiscountPercent(0.15);
        showToast('15% Patron discount applied!');
        return { success: true, message: '15% discount applied.' };
      } else {
        return { success: false, message: 'FOLIO15 requires minimum $50.00 subtotal.' };
      }
    }
    if (clean === 'FREESHIP') {
      setPromoApplied('FREESHIP (Complimentary Standard Delivery)');
      setDiscountPercent(0);
      showToast('Free standard shipping unlocked!');
      return { success: true, message: 'Free shipping promo active.' };
    }
    return { success: false, message: 'Invalid or expired promotional code.' };
  };

  const discountAmount = subtotal * discountPercent;

  const toggleWishlist = (bookId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(bookId);
      const next = exists ? prev.filter(id => id !== bookId) : [...prev, bookId];
      showToast(exists ? 'Removed from your reading wishlist' : 'Saved to your reading wishlist');
      return next;
    });
  };

  const isInWishlist = (bookId: string) => wishlist.includes(bookId);

  const openDetailModal = (book: Book) => {
    setActiveDetailBook(book);
    addToRecentlyViewed(book);
  };

  const closeDetailModal = () => {
    setActiveDetailBook(null);
  };

  const openExcerptModal = (book: Book) => {
    setActiveExcerptBook(book);
  };

  const closeExcerptModal = () => {
    setActiveExcerptBook(null);
  };

  const addToRecentlyViewed = (book: Book) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(b => b.id !== book.id);
      return [book, ...filtered].slice(0, 6);
    });
  };

  const incrementReadingGoal = () => {
    setReadingGoal(prev => ({
      ...prev,
      current: Math.min(prev.current + 1, prev.target + 10),
    }));
    showToast('Reading progress updated! Keep going.');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All Collections');
    setSelectedFormat('All Formats');
    setSelectedMood('All Moods');
    setMaxPrice(50);
    setMinRating(0);
    setSortBy('featured');
    setOnlyInStock(false);
    setOnlyStaffPicks(false);
    setIsNaturalLanguageSearch(false);
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'date' | 'trackingNumber' | 'status'>): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const trackingCode = `BQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${randomNum}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Confirmed',
      trackingNumber: trackingCode,
    };

    setOrders(prev => [newOrder, ...prev]);
    setLastCreatedOrder(newOrder);
    clearCart();
    setPromoApplied(null);
    setDiscountPercent(0);
    setGiftWrap(false);
    incrementReadingGoal();
    return newOrder;
  };

  const generateRecommendations = async (prefs?: RecommendationPreferences) => {
    const targetPrefs = prefs || recommendationPreferences;
    setIsGeneratingRecs(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetPrefs),
      });

      if (response.ok) {
        const data = await response.json();
        setCuratorResponse(data);
      } else {
        throw new Error('Server response not ok');
      }
    } catch {
      // Graceful client fallback
      setCuratorResponse({
        source: 'algorithmic',
        curatorNote: `For a reader attuned to ${targetPrefs.mood.toLowerCase()} narratives and themes of ${(targetPrefs.tropes || []).join(' & ')}, we have assembled titles with exquisite linguistic control and lingering emotional resonance.`,
        insights: [
          `Prioritized titles with strong atmospheric immersion matching "${targetPrefs.mood}".`,
          'Filtered for rich craftsmanship and contemplative prose rhythm.',
          'Paired with acclaimed staff favorites on ancient manuscripts and isolated settings.',
        ],
        suggestedThemes: ['Lyrical Interiority', 'Archival Topography', 'Quiet Sublime'],
      });
    } finally {
      setIsGeneratingRecs(false);
    }
  };

  return (
    <BookStoreContext.Provider
      value={{
        books,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        subtotal,
        freeShippingThreshold,
        promoCode,
        setPromoCode,
        discountAmount,
        promoApplied,
        applyPromoCode,
        giftWrap,
        setGiftWrap,
        giftWrapFee,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        isNaturalLanguageSearch,
        setIsNaturalLanguageSearch,
        selectedGenre,
        setSelectedGenre,
        selectedFormat,
        setSelectedFormat,
        selectedMood,
        setSelectedMood,
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
        activeDetailBook,
        openDetailModal,
        closeDetailModal,
        activeExcerptBook,
        openExcerptModal,
        closeExcerptModal,
        isCheckoutOpen,
        setIsCheckoutOpen,
        orders,
        createOrder,
        isOrderHistoryOpen,
        setIsOrderHistoryOpen,
        lastCreatedOrder,
        isRecommendationsOpen,
        setIsRecommendationsOpen,
        recommendationPreferences,
        setRecommendationPreferences,
        curatorResponse,
        setCuratorResponse,
        isGeneratingRecs,
        generateRecommendations,
        recentlyViewed,
        addToRecentlyViewed,
        readingGoal,
        incrementReadingGoal,
        toast,
        showToast,
      }}
    >
      {children}
    </BookStoreContext.Provider>
  );
};

export const useBookStore = () => {
  const context = useContext(BookStoreContext);
  if (!context) {
    throw new Error('useBookStore must be used within a BookStoreProvider');
  }
  return context;
};
