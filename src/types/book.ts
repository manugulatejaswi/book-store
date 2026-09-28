export type BookFormat = 'Hardcover' | 'Paperback' | "Collector's Clothbound" | 'eBook' | 'Audiobook';

export interface BookFormatOption {
  format: BookFormat;
  price: number;
  available: boolean;
  notes?: string;
}

export interface Review {
  id: string;
  reviewer: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  authorBio: string;
  genre: string;
  subGenre: string;
  tags: string[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  coverImage: string;
  coverColor: string; // Fallback aesthetic bookcloth styling
  accentColor: string;
  isbn: string;
  pages: number;
  publicationYear: number;
  publisher: string;
  formats: BookFormatOption[];
  synopsis: string;
  sampleExcerpt: {
    chapterTitle: string;
    text: string[];
  };
  editorialQuote: {
    quote: string;
    source: string;
  };
  featured?: boolean;
  staffPick?: boolean;
  bestseller?: boolean;
  inStock: boolean;
  moods: string[];
  tropes: string[];
  reviews: Review[];
}

export interface CartItem {
  book: Book;
  format: BookFormat;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentDetails {
  paymentMethod: 'card' | 'apple_pay' | 'google_pay';
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  cvv?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  deliveryMethod: {
    id: string;
    name: string;
    price: number;
    estimatedDays: string;
  };
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  isGift: boolean;
  giftMessage?: string;
  status: 'Confirmed' | 'Bound & Packaged' | 'In Transit' | 'Delivered';
  trackingNumber: string;
}

export interface RecommendationPreferences {
  mood: string;
  tropes: string[];
  genres: string[];
  lovedBooks: string;
  readingPace: string;
}

export interface CuratorRecommendationResponse {
  source: 'gemini' | 'algorithmic';
  curatorNote: string;
  insights: string[];
  suggestedThemes: string[];
  recommendedBookIds?: string[];
}
