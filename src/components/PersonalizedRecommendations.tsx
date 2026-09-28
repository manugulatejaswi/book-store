import React, { useState, useEffect } from 'react';
import { X, Sparkles, BookOpen, ShoppingBag, ArrowRight, RefreshCw, Check, BookMarked, Compass } from 'lucide-react';
import { useBookStore } from '../context/BookStoreContext';
import { READING_MOODS, TROPES_AND_THEMES } from '../data/books';
import { Book } from '../types/book';

export const PersonalizedRecommendations: React.FC = () => {
  const {
    isRecommendationsOpen,
    setIsRecommendationsOpen,
    recommendationPreferences,
    setRecommendationPreferences,
    curatorResponse,
    isGeneratingRecs,
    generateRecommendations,
    books,
    openDetailModal,
    openExcerptModal,
    addToCart,
  } = useBookStore();

  const [step, setStep] = useState<1 | 2 | 3 | 'results'>(curatorResponse ? 'results' : 1);
  const [tempLovedBooks, setTempLovedBooks] = useState(recommendationPreferences.lovedBooks);

  // Calculate dynamic match scores for catalog books based on preferences
  const getMatchedBooks = (): { book: Book; score: number; rationale: string }[] => {
    return books.map(book => {
      let score = 70;
      let reasons: string[] = [];

      // Check mood match
      const currentMood = recommendationPreferences.mood.toLowerCase();
      if (book.moods.some(m => currentMood.includes(m.toLowerCase()))) {
        score += 15;
        reasons.push(`Alongs with your desire for ${recommendationPreferences.mood.toLowerCase()} prose`);
      }

      // Check tropes match
      const matchedTropes = book.tropes.filter(t => 
        recommendationPreferences.tropes.some(prefTrope => prefTrope.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(prefTrope.toLowerCase()))
      );
      if (matchedTropes.length > 0) {
        score += matchedTropes.length * 6;
        reasons.push(`Echoes tropes of ${matchedTropes[0]}`);
      }

      // Check genre overlap
      if (recommendationPreferences.genres.includes(book.genre)) {
        score += 8;
      }

      const finalScore = Math.min(99, Math.max(78, score));
      const rationale = reasons.length > 0
        ? reasons.join(' and ') + '.'
        : 'Shares profound stylistic grace and literary craft with your reading preferences.';

      return {
        book,
        score: finalScore,
        rationale,
      };
    }).sort((a, b) => b.score - a.score).slice(0, 4);
  };

  const handleStartGeneration = async () => {
    await generateRecommendations({
      ...recommendationPreferences,
      lovedBooks: tempLovedBooks,
    });
    setStep('results');
  };

  if (!isRecommendationsOpen) return null;

  const matchedPicks = getMatchedBooks();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      
      <div 
        className="w-full max-w-4xl bg-[#FAF8F5] text-[#24211D] rounded-2xl shadow-2xl border border-[#E2D9CB] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E0D2] bg-[#F5EFE5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#844C23]" />
            <div>
              <h3 className="font-editorial text-xl font-medium text-[#1F1C18]">
                The Curator’s Reading Matchmaker
              </h3>
              <p className="text-xs text-[#7B7163]">
                Personalized literary recommendations tailored to your current mindset
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRecommendationsOpen(false)}
            className="p-1.5 text-[#5A5247] hover:text-[#1F1C18] hover:bg-[#EAE2D3] rounded-md transition-colors"
            aria-label="Close matchmaker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Navigation / Status */}
        {step !== 'results' && (
          <div className="px-6 py-3 bg-[#EFE9DF] border-b border-[#E2D9CB] flex items-center justify-between text-xs text-[#63594C]">
            <div className="flex items-center gap-6">
              <span className={`font-medium ${step === 1 ? 'text-[#844C23] font-bold' : ''}`}>
                1. Mood & Atmosphere
              </span>
              <span aria-hidden="true">→</span>
              <span className={`font-medium ${step === 2 ? 'text-[#844C23] font-bold' : ''}`}>
                2. Themes & Tropes
              </span>
              <span aria-hidden="true">→</span>
              <span className={`font-medium ${step === 3 ? 'text-[#844C23] font-bold' : ''}`}>
                3. Past Loves & Pace
              </span>
            </div>

            <span className="text-[11px] text-[#8F8475]">Step {step} of 3</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {/* STEP 1: MOOD */}
          {step === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#844C23] font-medium">
                  Phase I
                </span>
                <h4 className="font-editorial text-2xl font-medium text-[#1F1C18]">
                  What emotional frequency are you seeking to inhabit?
                </h4>
                <p className="text-xs text-[#7B7163]">
                  Select the primary atmosphere for your next book.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {READING_MOODS.map(mood => (
                  <button
                    key={mood.id}
                    onClick={() => {
                      setRecommendationPreferences(prev => ({ ...prev, mood: mood.label }));
                      setStep(2);
                    }}
                    className={`p-4 text-left rounded-xl border transition-all ${
                      recommendationPreferences.mood === mood.label
                        ? 'bg-[#24211D] text-white border-[#24211D] shadow-sm'
                        : 'bg-white hover:bg-[#F6F2EC] text-[#24211D] border-[#E0D7C9]'
                    }`}
                  >
                    <span className="font-medium text-sm block">{mood.label}</span>
                    <p className={`text-xs mt-1 leading-relaxed ${
                      recommendationPreferences.mood === mood.label ? 'text-[#DCD5C9]' : 'text-[#7B7163]'
                    }`}>
                      {mood.desc}
                    </p>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#844C23] hover:bg-[#6D3D1B] rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Continue to Themes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: TROPES & THEMES */}
          {step === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#844C23] font-medium">
                  Phase II
                </span>
                <h4 className="font-editorial text-2xl font-medium text-[#1F1C18]">
                  Which literary elements pull you into a story?
                </h4>
                <p className="text-xs text-[#7B7163]">
                  Choose any themes or motifs that fascinate you (choose 1-4).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {TROPES_AND_THEMES.map(trope => {
                  const isSelected = recommendationPreferences.tropes.includes(trope);
                  return (
                    <button
                      key={trope}
                      onClick={() => {
                        setRecommendationPreferences(prev => {
                          const exists = prev.tropes.includes(trope);
                          const nextTropes = exists
                            ? prev.tropes.filter(t => t !== trope)
                            : [...prev.tropes, trope];
                          return { ...prev, tropes: nextTropes };
                        });
                      }}
                      className={`p-3 text-left rounded-lg border text-xs font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#844C23] text-white border-[#844C23] shadow-xs'
                          : 'bg-white hover:bg-[#F6F2EC] text-[#3A332A] border-[#E0D7C9]'
                      }`}
                    >
                      <span>{trope}</span>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-medium text-[#5A5247] hover:text-[#1F1C18]"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#844C23] hover:bg-[#6D3D1B] rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Continue to Books You Loved</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: LOVED BOOKS & GENERATION */}
          {step === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#844C23] font-medium">
                  Phase III
                </span>
                <h4 className="font-editorial text-2xl font-medium text-[#1F1C18]">
                  Anchor your personal reading constellation
                </h4>
                <p className="text-xs text-[#7B7163]">
                  Mention 1–3 books or writers that left an indelible mark on you.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-[#443D34] block mb-1.5">
                    Books, authors, or stories you cherish:
                  </label>
                  <input
                    type="text"
                    value={tempLovedBooks}
                    onChange={(e) => setTempLovedBooks(e.target.value)}
                    placeholder="e.g. Piranesi, Invisible Cities, The Shadow of the Wind, Ursula Le Guin"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D5CDC1] bg-white text-sm text-[#1F1C18] focus:outline-none focus:ring-2 focus:ring-[#844C23]"
                  />
                  <p className="text-[11px] text-[#8F8475] mt-1">
                    Our literary curator compares linguistic cadence, themes, and narrative architecture.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#443D34] block mb-1.5">
                    Reading Pace & Format Preference:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Immersive & Thoughtful (Hardcover)', 'Sweeping & Unhurried (Clothbound)', 'Compact Novella (Paperback)', 'Audio Companion'].map(pace => (
                      <button
                        key={pace}
                        onClick={() => setRecommendationPreferences(prev => ({ ...prev, readingPace: pace }))}
                        className={`p-2.5 text-xs text-left rounded-lg border transition-all ${
                          recommendationPreferences.readingPace === pace
                            ? 'bg-[#24211D] text-white border-[#24211D]'
                            : 'bg-white text-[#443D34] border-[#E0D7C9] hover:bg-[#F6F2EC]'
                        }`}
                      >
                        {pace}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-medium text-[#5A5247] hover:text-[#1F1C18]"
                >
                  Back
                </button>
                <button
                  onClick={handleStartGeneration}
                  disabled={isGeneratingRecs}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#844C23] hover:bg-[#6D3D1B] rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                >
                  {isGeneratingRecs ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Consulting Bookseller Archives...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Assemble My Personalized Reading Folio</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP: RESULTS / CURATED FOLIO */}
          {step === 'results' && (
            <div className="space-y-8">
              
              {/* Curator Letter Banner */}
              <div className="p-5 sm:p-6 bg-[#F5EFE5] rounded-xl border border-[#E4DAC9] relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-[#844C23] font-bold block mb-1">
                      Personalized Folio · Tailored for You
                    </span>
                    <h4 className="font-editorial text-2xl font-medium text-[#1F1C18]">
                      A Letter from Chief Curator Julian Thorne
                    </h4>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-[#844C23] hover:underline flex items-center gap-1 shrink-0 font-medium"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retune Preferences</span>
                  </button>
                </div>

                <p className="font-serif text-sm sm:text-base text-[#383127] leading-relaxed mt-3 italic">
                  "{curatorResponse?.curatorNote || `We have tuned our shelves to your resonance for ${recommendationPreferences.mood.toLowerCase()} prose and themes of ${recommendationPreferences.tropes.join(', ')}. Each title below mirrors the quiet craft you seek.`}"
                </p>

                {/* Literary Insights */}
                {curatorResponse?.insights && curatorResponse.insights.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#E8DFC8] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#5E5343]">
                    {curatorResponse.insights.map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="font-editorial text-[#844C23] font-bold text-sm">0{idx + 1}.</span>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Matched Books Shelf */}
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <h5 className="font-editorial text-xl font-medium text-[#1F1C18]">
                    Your Top Literary Matches
                  </h5>
                  <span className="text-xs text-[#7B7163]">
                    Based on stylistic resonance, narrative pace, and themes
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matchedPicks.map(({ book, score, rationale }) => (
                    <div
                      key={book.id}
                      className="p-4 bg-white rounded-xl border border-[#E5DDCF] shadow-xs flex gap-4 hover:border-[#844C23] transition-all group"
                    >
                      <div 
                        onClick={() => openDetailModal(book)}
                        className="w-20 aspect-[3/4] rounded-lg overflow-hidden shrink-0 bg-[#EAE3D6] shadow-sm cursor-pointer border border-[#DDD3C2]"
                      >
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          {/* Match Score Badge (clean text with tabular-nums) */}
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-mono tabular-nums text-xs font-bold text-[#844C23]">
                              {score}% Affinity Match
                            </span>
                            <span className="text-[11px] text-[#8F8475]">{book.genre}</span>
                          </div>

                          <h6 
                            onClick={() => openDetailModal(book)}
                            className="font-editorial text-base sm:text-lg font-medium text-[#1F1C18] truncate cursor-pointer group-hover:text-[#844C23] transition-colors"
                          >
                            {book.title}
                          </h6>
                          <p className="text-xs text-[#7B7163] truncate">{book.author}</p>
                          
                          <p className="text-[11px] text-[#5A5247] mt-1.5 line-clamp-2 italic font-serif">
                            "{rationale}"
                          </p>
                        </div>

                        <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#F2ECE1] mt-2">
                          <span className="font-mono tabular-nums text-xs font-semibold text-[#1F1C18]">
                            ${book.price.toFixed(2)}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openExcerptModal(book)}
                              className="px-2 py-1 text-xs text-[#5A5247] hover:text-[#1F1C18] hover:bg-[#F2ECE1] rounded border border-[#E0D7C9]"
                              title="Read Excerpt"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => addToCart(book, 'Hardcover', 1)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-[#24211D] hover:bg-[#38332C] rounded transition-colors flex items-center gap-1"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bundle & Save Callout */}
              <div className="p-4 bg-[#F2EDE4] rounded-xl border border-[#DFD6C7] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-semibold text-[#1F1C18] block">
                    Curator’s Complete Reading Pair
                  </span>
                  <p className="text-[#695F51] mt-0.5">
                    Order both <em>{matchedPicks[0]?.book.title}</em> and <em>{matchedPicks[1]?.book.title}</em> together to enjoy complimentary wax-sealed packaging.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (matchedPicks[0]) addToCart(matchedPicks[0].book, 'Hardcover', 1);
                    if (matchedPicks[1]) addToCart(matchedPicks[1].book, 'Hardcover', 1);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#844C23] hover:bg-[#6D3D1B] rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                >
                  Add Both to Bag
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        {step === 'results' && (
          <div className="px-6 py-3.5 border-t border-[#E8E0D2] bg-[#F5EFE5] flex items-center justify-between text-xs text-[#6E6455]">
            <span>Preferences saved to your local reading profile.</span>
            <button
              onClick={() => setIsRecommendationsOpen(false)}
              className="px-4 py-1.5 text-xs font-semibold text-[#24211D] hover:bg-[#EAE2D3] rounded-md transition-colors border border-[#DDD3C2]"
            >
              Done Exploring
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
