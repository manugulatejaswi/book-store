import React from 'react';
import { Shield, Sparkles, Feather, Compass, Check } from 'lucide-react';

export const PackagingShowcase: React.FC = () => {
  return (
    <section id="craftsmanship" className="py-16 sm:py-24 bg-[#F5EFE6] border-y border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: High-fidelity product photo */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#DFD5C5] bg-[#E8E1D3]">
              <img
                src="/src/assets/images/craft_packaging_showcase_1790580199095.jpg"
                alt="Hand-bound book wrapped in heavy kraft paper with cotton twine and wax seal"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover aspect-[4/3]"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-xl border border-[#E0D7C9] text-xs text-[#443D34]">
                <span className="font-semibold block text-[#1F1C18]">The Bindery Standard</span>
                <p className="text-[11px] text-[#695F51] mt-0.5">
                  100% plastic-free packaging: ribbed Swedish kraft, unbleached cotton twine, and hand-embossed beeswax seals.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Editorial prose and craft details */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#844C23] font-semibold block mb-2">
                Uncompromising Preservation
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1F1C18] tracking-tight leading-tight">
                Every volume treated as a lifelong artifact.
              </h2>
            </div>

            <p className="font-serif text-base sm:text-lg text-[#52483C] leading-relaxed">
              We reject the plastic mailers and hurried fulfillment of modern mega-retailers. In our Cambridge bindery, every shipment is hand-inspected for spine squareness, leaf integrity, and dustjacket alignment before receiving its archival seal.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white/70 rounded-xl border border-[#E5DECDB] space-y-1.5">
                <span className="text-xs font-bold text-[#1F1C18] flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5 text-[#844C23]" />
                  Archival Acid-Free Paper
                </span>
                <p className="text-xs text-[#6E6455] leading-normal">
                  Guaranteed 300-year leaf preservation with neutral pH buffers.
                </p>
              </div>

              <div className="p-4 bg-white/70 rounded-xl border border-[#E5DECDB] space-y-1.5">
                <span className="text-xs font-bold text-[#1F1C18] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#844C23]" />
                  Corner Armor Enclosures
                </span>
                <p className="text-xs text-[#6E6455] leading-normal">
                  Reinforced double-flute corner buffers withstand transit impact.
                </p>
              </div>

              <div className="p-4 bg-white/70 rounded-xl border border-[#E5DECDB] space-y-1.5">
                <span className="text-xs font-bold text-[#1F1C18] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#844C23]" />
                  Embossed Wax Seal
                </span>
                <p className="text-xs text-[#6E6455] leading-normal">
                  Each parcel hand-sealed with warm Burgundy beeswax and company mark.
                </p>
              </div>

              <div className="p-4 bg-white/70 rounded-xl border border-[#E5DECDB] space-y-1.5">
                <span className="text-xs font-bold text-[#1F1C18] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#844C23]" />
                  Complimentary Bookmark
                </span>
                <p className="text-xs text-[#6E6455] leading-normal">
                  Die-cut brass & heavy letterpress bookmark included in every package.
                </p>
              </div>
            </div>

            {/* Adjacency proof */}
            <div className="pt-2 flex items-center gap-6 text-xs text-[#7B7163]">
              <span className="font-mono tabular-nums text-[#1F1C18] font-bold text-sm">
                42,800+
              </span>
              <span>parcels dispatched without corner damage</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-[#1F1C18] font-bold text-sm">
                100%
              </span>
              <span>Carbon-neutral logistics</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
