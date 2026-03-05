'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Search,
  Share2,
  MapPinned,
  Zap,
} from 'lucide-react';

const storesSeed = [
  {
    id: 1,  
    name: 'Rudraksh Pharmacy',
    pincode: 395009,
    area: 'L.P. Savani Circle, Adajan',
    address: 'Shop No. 9, L.P. Savani Shopping Center, Near L.P. Savani Circle, Adajan, Surat - 395009',
    phone: '9979979688',
    lat: 21.2003521,
    lng: 72.7821255,
    hours: '9:00 AM - 10:00 PM',
    badge: 'Popular',
    distance: '2.3 km',
  },
  {
    id: 2,
    name: 'Rudraksh Medical Store',
    pincode: 394101,
    area: 'VIP Circle, Mota Varacha',
    address: 'G-17m, Shreenathji Icon, Opp. Utran Power Station, VIP Circle, Mota Varacha, Surat - 394101',
    phone: '9979979688',
    lat: 21.2320897,
    lng: 72.8668198,
    hours: '24 Hours',
    badge: '24/7',
    distance: '5.1 km',
  },
  {
    id: 3,
    name: 'Rudraksh Pharmacy',
    pincode: 395006,
    area: 'Mini Bazar, Varacha',
    address: 'Shop No. 1, Mira Nagar Soc., Near Chopati, Opp. Multilevel Parking, Varacha, Surat - 395006',
    phone: '9979979688',
    lat: 21.2188437,
    lng: 72.8473839,
    hours: '9:00 AM - 9:00 PM',
    badge: 'Convenient',
    distance: '3.8 km',
  },
  {
    id: 4,
    name: 'Metro Pharmacy',
    pincode: 395009,
    area: 'L.P. Savani Circle, Adajan',
    address: 'Shop No. 12-13, L.P. Savani Shopping Center, Near L.P. Savani Circle, Adajan, Surat - 395009',
    phone: '9979979688',
    lat: 21.2003164,
    lng: 72.7802124,
    hours: '9:00 AM - 10:00 PM',
    badge: 'Convenient',
    distance: '2.1 km',
  }
];

const StoreLocatorView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState(storesSeed[0]);
  const [mapFailed, setMapFailed] = useState(false);

  const filteredStores = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return storesSeed;

    return storesSeed.filter((store) => {
      return (
        store.name.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query) ||
        store.area.toLowerCase().includes(query) ||
        String(store.pincode).includes(query)
      );
    });
  }, [searchQuery]);

  useEffect(() => {
    if (!selectedStore || !filteredStores.some((store) => store.id === selectedStore.id)) {
      setSelectedStore(filteredStores[0] ?? null);
    }
  }, [filteredStores, selectedStore]);

  const mapSrc = useMemo(() => {
    const fallback = filteredStores[0] || storesSeed[0];
    const activeStore = Number.isFinite(selectedStore?.lat) && Number.isFinite(selectedStore?.lng)
      ? selectedStore
      : fallback;
    const lat = activeStore.lat;
    const lng = activeStore.lng;
    const placeQuery = `${activeStore.name}, ${activeStore.address}`;
    const encodedPlaceQuery = encodeURIComponent(placeQuery);
    const markerQuery = encodeURIComponent(`loc:${lat},${lng} (${activeStore.name})`);

    return {
      lat,
      lng,
      googleSrc: `https://maps.google.com/maps?output=embed&q=${markerQuery}&z=15`,
      googleMapsLink: `https://www.google.com/maps/place/${encodedPlaceQuery}/@${lat},${lng},14z`,
      osmLink: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`,
    };
  }, [selectedStore, filteredStores]);

  useEffect(() => {
    setMapFailed(false);
  }, [selectedStore]);

  const handleDirections = (lat, lng) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  const handleShare = (store) => {
    const shareText = `${store.name} - ${store.address}`;
    if (navigator.share) {
      navigator.share({ title: 'Pharmacy Store', text: shareText });
      return;
    }
    window.prompt('Copy this store detail', shareText);
  };

  const handleWhatsApp = (store) => {
    const text = `Hello, I need details for ${store.name}. Address: ${store.address}`;
    window.open(`https://wa.me/919979979688?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="relative min-h-[100vh] bg-gradient-to-br from-white via-blue-50 to-blue-100 py-4 xs:py-6 sm:py-8 md:py-10 lg:py-12 lg:py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 xs:w-80 sm:w-96 h-64 xs:h-80 sm:h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 xs:w-80 sm:w-96 h-64 xs:h-80 sm:h-96 bg-blue-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-3 xs:px-4 sm:px-6 md:px-8">
        {/* Header Section */}
        <div className="mb-4 xs:mb-6 sm:mb-8 md:mb-10 lg:mb-12 lg:mb-14 text-center px-1 xs:px-2">
          <div className="inline-flex items-center justify-center gap-2 mb-2 xs:mb-3 sm:mb-4 px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-full bg-blue-100 border border-blue-300 backdrop-blur">
            <MapPinned className="h-3 xs:h-3.5 sm:h-4 lg:w-4 text-blue-600 flex-shrink-0" />
            <span className="text-xs xs:text-xs sm:text-sm font-semibold text-blue-700">Find Your Nearest Store</span>
          </div>
          <h1 className="mb-1 xs:mb-2 sm:mb-3 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 leading-tight px-2">
            Our Store Locations
          </h1>
          <p className="mx-auto max-w-3xl text-xs xs:text-xs sm:text-base md:text-lg text-slate-700 leading-relaxed px-2">
            Visit any of our conveniently located pharmacy stores for quality medications and expert healthcare advice
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid gap-4 md:gap-5 lg:gap-6 xl:gap-7 grid-cols-1 xl:grid-cols-[1fr_1.25fr] min-h-[calc(100vh-10rem)] sm:min-h-[calc(100vh-12rem)] lg:min-h-fit">
          {/* Left Column - Store List */}
          <div className="order-2 xl:order-1 flex flex-col gap-2.5 xs:gap-3 sm:gap-3.5 md:gap-4 w-full min-h-[440px] sm:min-h-[540px] lg:min-h-fit">
            {/* Search Bar */}
            <div className="sticky top-2 xs:top-3 sm:top-4 z-10">
              <label className="relative block group">
                <Search className="pointer-events-none absolute left-2.5 xs:left-3 sm:left-4 top-1/2 h-3.5 xs:h-4 sm:h-5 w-3.5 xs:w-4 sm:w-5 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-blue-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search stores..."
                  className="h-10 xs:h-11 sm:h-12 md:h-12 w-full rounded-xl border border-blue-300 bg-white backdrop-blur-sm pl-10 xs:pl-11 sm:pl-12 pr-3 sm:pr-4 text-sm sm:text-base font-medium text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] focus:ring-0"
                />
              </label>
            </div>

            {/* Store Cards */}
            <div className="store-scroll flex flex-col gap-2 xs:gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-4 xl:gap-4 max-h-[calc(100vh-16rem)] xs:max-h-[calc(100vh-16.5rem)] sm:max-h-[calc(100vh-17rem)] md:max-h-[calc(100vh-15rem)] lg:max-h-[calc(100vh-14rem)] xl:max-h-[calc(100vh-16rem)] overflow-y-auto pr-1.5 xs:pr-2 sm:pr-3">
              {filteredStores.length > 0 ? (
                filteredStores.map((store, index) => (
                  <article
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className={`store-card-animate group relative cursor-pointer rounded-xl sm:rounded-2xl border transition-all duration-300 w-full ${
                      selectedStore?.id === store.id
                        ? 'border-blue-400 bg-white shadow-[0_6px_20px_rgba(59,130,246,0.22)] ring-1 ring-blue-200'
                        : 'border-blue-100 bg-white shadow-[0_2px_10px_rgba(59,130,246,0.08)]'
                    }`}
                  >
                    {/* Card Content */}
                    <div className="store-card-content p-3 xs:p-3.5 sm:p-4 md:p-4 lg:p-5">
                      {/* Store Name */}
                      <div className="store-card-head mb-3 xs:mb-3.5 sm:mb-4 flex items-start justify-between gap-2.5 sm:gap-3">
                        <div className="store-card-head-copy min-w-0">
                          <h2 className="store-card-title text-center text-[0.98rem] xs:text-[1.06rem] sm:text-[1.16rem] md:text-[1.22rem] font-bold text-slate-900 leading-tight break-words">
                            {store.name}
                          </h2>
                          <span className="store-card-badge inline-flex mt-1.5 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                            {store.badge}
                          </span>
                        </div>
                        <div className={`store-card-pin flex h-10 xs:h-11 sm:h-12 md:h-12 w-10 xs:w-11 sm:w-12 md:w-12 items-center justify-center rounded-full ${
                          store.hours.includes('24')
                            ? 'bg-green-100'
                            : 'bg-blue-100'
                        } shadow-sm sm:shadow-md transition-all duration-300 shrink-0`}>
                          <MapPin className={`h-4 xs:h-[18px] sm:h-5 md:h-5 lg:h-6 w-4 xs:w-[18px] sm:w-5 md:w-5 lg:w-6 ${
                            store.hours.includes('24')
                              ? 'text-green-600'
                              : 'text-blue-600'
                          }`} />
                        </div>
                      </div>
                        
                      {/* Hours and Distance - Full Width Responsive */}
                      <div className="store-card-meta flex flex-wrap items-center gap-2 xs:gap-2.5 sm:gap-3.5 mb-2.5 xs:mb-3 sm:mb-3.5">
                        <div className="flex items-center gap-1 sm:gap-1.5 text-slate-600">
                          <Clock className="h-3 xs:h-3 sm:h-3.5 md:h-4 w-3 xs:w-3 sm:w-3.5 md:w-4 text-blue-600 flex-shrink-0" />
                          <span className="font-medium text-xs sm:text-sm">{store.hours}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5 text-slate-600">
                          <Zap className="h-3 xs:h-3 sm:h-3.5 md:h-4 w-3 xs:w-3 sm:w-3.5 md:w-4 text-purple-600 flex-shrink-0" />
                          <span className="font-medium text-xs sm:text-sm">{store.distance}</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="store-card-block flex gap-1.5 xs:gap-2 sm:gap-2.5 mb-3 xs:mb-3.5 sm:mb-4">
                        <MapPin className="h-3.5 xs:h-4 sm:h-4 md:h-4 w-3.5 xs:w-4 sm:w-4 md:w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="w-full">
                          <p className="text-xs sm:text-[0.82rem] font-semibold text-slate-500 mb-1 leading-tight">Location</p>
                          <p className="store-area text-sm sm:text-[1.05rem] leading-snug text-slate-800 font-semibold">{store.area}</p>
                          <p className="store-address text-xs sm:text-sm leading-snug text-slate-600 mt-1">{store.address}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="store-card-block flex gap-1.5 xs:gap-2 sm:gap-2.5">
                        <Phone className="h-3.5 xs:h-4 sm:h-4 md:h-4 w-3.5 xs:w-4 sm:w-4 md:w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div className="w-full">
                          <p className="text-xs sm:text-[0.82rem] font-semibold text-slate-500 mb-0.5 leading-tight">Call</p>
                          <a href={`tel:${store.phone}`} className="store-phone text-base sm:text-[1.08rem] font-semibold text-blue-600 break-all">{store.phone}</a>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-blue-100/40" />

                    {/* Action Buttons */}
                    <div className="store-actions-wrap p-2.5 xs:p-3 sm:p-3.5 md:p-4">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDirections(store.lat, store.lng);
                        }}
                        className="store-action-btn store-action-btn--primary"
                        aria-label="Get directions"
                      >
                        <Navigation className="h-3.5 xs:h-3.5 sm:h-4 md:h-[18px] lg:h-5 w-3.5 xs:w-3.5 sm:w-4 md:w-[18px] lg:w-5 flex-shrink-0" />
                        <span>Directions</span>
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleWhatsApp(store);
                        }}
                        className="store-action-btn store-action-btn--secondary"
                        aria-label="WhatsApp"
                      >
                        <MessageCircle className="h-3.5 xs:h-3.5 sm:h-4 md:h-[18px] lg:h-5 w-3.5 xs:w-3.5 sm:w-4 md:w-[18px] lg:w-5 flex-shrink-0" />
                        <span>Message</span>
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleShare(store);
                        }}
                        className="store-action-btn store-action-btn--icon"
                        aria-label="Share"
                      >
                        <Share2 className="h-3.5 xs:h-3.5 sm:h-4 md:h-[18px] lg:h-5 w-3.5 xs:w-3.5 sm:w-4 md:w-[18px] lg:w-5 flex-shrink-0" />
                      </button>
                    </div>
                  </article>
                )) 
              ) : (
                <div className="rounded-lg sm:rounded-2xl border border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-white backdrop-blur-sm p-4 xs:p-5 sm:p-8 md:p-12 text-center">
                  <div className="mb-3 xs:mb-4 flex justify-center">
                    <div className="flex h-12 xs:h-12 sm:h-16 w-12 xs:w-12 sm:w-16 items-center justify-center rounded-full bg-blue-100 border border-blue-300 animate-pulse">
                      <Search className="h-5 xs:h-6 sm:h-7 w-5 xs:w-6 sm:w-7 text-blue-500" />
                    </div>
                  </div>
                  <p className="text-sm xs:text-base sm:text-lg font-bold text-blue-900 mb-1 xs:mb-2">No stores found</p>
                  <p className="text-xs xs:text-xs sm:text-sm text-slate-600">Try adjusting your search or clearing filters</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="order-1 xl:order-2 flex flex-col w-full">
            <div className="h-[300px] sm:h-[380px] md:h-[460px] lg:h-[580px] xl:h-[680px] sticky top-2 xs:top-3 sm:top-4 overflow-hidden rounded-lg sm:rounded-2xl border border-blue-300 bg-white shadow-lg sm:shadow-2xl shadow-blue-500/15 sm:shadow-blue-500/20 w-full">
              {mapFailed ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-4 text-center">
                  <p className="text-sm font-semibold text-slate-800">Map preview is blocked on this network.</p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={mapSrc.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                    >
                      Open in Google Maps
                    </a>
                    <a
                      href={mapSrc.osmLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      Open in OpenStreetMap
                    </a>
                  </div>
                </div>
              ) : (
                <iframe
                  key={`google-${mapSrc.googleSrc}`}
                  title="Store location map"
                  src={mapSrc.googleSrc}
                  className="h-full w-full rounded-lg sm:rounded-2xl border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onError={() => setMapFailed(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollbar Styles */}
      <style jsx>{`
        .store-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .store-scroll::-webkit-scrollbar-track {
          background: rgba(219, 234, 254, 0.7);
          border-radius: 10px;
        }

        .store-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(59, 130, 246, 0.6), rgba(59, 130, 246, 0.4));
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        @keyframes store-card-animate {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .store-card-animate {
          animation: store-card-animate 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
        }

        .store-card-content {
          display: grid;
          gap: 0.35rem;
        }

        .store-card-head {
          align-items: flex-start;
        }

        .store-card-head-copy {
          flex: 1;
          min-width: 0;
          max-width: calc(100% - 3.25rem);
        }

        .store-card-title {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-width: 100%;
          letter-spacing: -0.01em;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .store-card-badge {
          line-height: 1.2;
        }

        .store-card-pin {
          flex-shrink: 0;
          margin-left: 0.35rem;
        }

        .store-card-meta {
          row-gap: 0.35rem;
        }

        .store-card-block {
          align-items: flex-start;
        }

        .store-area,
        .store-address {
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .store-phone {
          letter-spacing: 0.01em;
        }

        .store-actions-wrap {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
          gap: 0.6rem;
          align-items: center;
        }

        .store-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          min-height: 42px;
          border-radius: 10px;
          border: 1px solid transparent;
          font-size: 0.95rem;
          font-weight: 700;
          transition: all 0.2s ease;
          padding: 0.5rem 0.9rem;
        }

        .store-action-btn--primary {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #2563eb;
        }

        .store-action-btn--secondary {
          background: #ecfdf5;
          border-color: #bbf7d0;
          color: #15803d;
        }

        .store-action-btn--icon {
          width: 42px;
          min-width: 42px;
          padding: 0;
          background: #faf5ff;
          border-color: #e9d5ff;
          color: #7e22ce;
        }

        /* Mobile to Tablet */
        @media (max-width: 640px) {
          .store-scroll {
            max-height: calc(100vh - 180px) !important;
          }

          .store-card-title {
            font-size: 1rem;
            line-height: 1.2;
          }

          .store-card-badge {
            font-size: 0.68rem;
            padding: 0.18rem 0.48rem;
          }

          .store-card-pin {
            width: 2.5rem;
            height: 2.5rem;
          }

          .store-card-head-copy {
            max-width: calc(100% - 2.8rem);
          }

          .store-area {
            font-size: 1rem;
          }

          .store-address {
            font-size: 0.84rem;
          }

          .store-actions-wrap {
            grid-template-columns: 1fr;
          }

          .store-action-btn {
            width: 100%;
            font-size: 0.88rem;
            min-height: 40px;
          }

          .store-action-btn--icon {
            width: 100%;
            min-width: 0;
          }
        }

        /* Tablet */
        @media (min-width: 641px) and (max-width: 1024px) {
          .store-scroll {
            max-height: calc(100vh - 200px) !important;
          }

          .store-card-title {
            font-size: 1.1rem;
          }

          .store-area {
            font-size: 1.02rem;
          }
        }

        /* Desktop */
        @media (min-width: 1025px) {
          .store-scroll {
            max-height: calc(100vh - 16rem) !important;
          }
        }

        /* Extra Large */
        @media (min-width: 1536px) {
          .store-scroll {
            max-height: calc(100vh - 14rem) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default StoreLocatorView;
