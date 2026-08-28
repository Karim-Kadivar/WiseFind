import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { Product } from '../types';
import { MapPin, Phone, Clock, Compass, AlertCircle, Sparkles, Building, Star } from 'lucide-react';

interface LocalStore {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  hours: string;
  rating: number;
  stockStatus: 'In Stock' | 'Limited Stock' | 'Out of Stock';
  distance: string;
}

interface LocalStoreFinderProps {
  product: Product;
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY.trim() !== '';

export default function LocalStoreFinder({ product }: LocalStoreFinderProps) {
  const [selectedCity, setSelectedCity] = useState<'Mumbai' | 'Bengaluru' | 'Delhi'>('Bengaluru');
  const [stores, setStores] = useState<LocalStore[]>([]);
  const [activeStore, setActiveStore] = useState<LocalStore | null>(null);
  const [openInfoWindow, setOpenInfoWindow] = useState(false);

  // Dynamic store generator based on category & city
  useEffect(() => {
    const isSmartphone = product.category.toLowerCase().includes('phone');
    const isLaptop = product.category.toLowerCase().includes('laptop');
    
    const storeTemplates = {
      Bengaluru: [
        {
          id: 'blr-1',
          name: 'Croma - Indiranagar',
          address: '100 Feet Rd, Hal 2nd Stage, Indiranagar, Bengaluru, KA 560038',
          lat: 12.9716,
          lng: 77.6412,
          phone: '+91 80 4647 8000',
          hours: '11:00 AM - 9:30 PM',
          rating: 4.4,
          stockStatus: isSmartphone ? 'In Stock' : 'Limited Stock',
          distance: '1.2 km'
        },
        {
          id: 'blr-2',
          name: 'Reliance Digital - Whitefield',
          address: 'Phoenix Marketcity, ITPL Main Rd, Bengaluru, KA 560048',
          lat: 12.9958,
          lng: 77.6963,
          phone: '+91 80 6726 1000',
          hours: '10:00 AM - 10:00 PM',
          rating: 4.2,
          stockStatus: isLaptop ? 'In Stock' : 'In Stock',
          distance: '4.8 km'
        },
        {
          id: 'blr-3',
          name: 'Apple Premium Reseller (Imagine) - Koramangala',
          address: 'Forum Mall, Hosur Rd, Koramangala, Bengaluru, KA 560095',
          lat: 12.9345,
          lng: 77.6113,
          phone: '+91 80 2206 7888',
          hours: '10:30 AM - 9:30 PM',
          rating: 4.6,
          stockStatus: product.brand.toLowerCase() === 'apple' ? 'In Stock' : 'Out of Stock',
          distance: '3.1 km'
        }
      ],
      Mumbai: [
        {
          id: 'mum-1',
          name: 'Vijay Sales - Bandra West',
          address: 'Linking Rd, Santacruz West, Mumbai, MH 400054',
          lat: 19.0831,
          lng: 72.8360,
          phone: '+91 22 2648 8800',
          hours: '11:00 AM - 9:30 PM',
          rating: 4.3,
          stockStatus: 'In Stock',
          distance: '0.8 km'
        },
        {
          id: 'mum-2',
          name: 'Croma - Juhu',
          address: 'Juhu Tara Rd, Santacruz West, Mumbai, MH 400049',
          lat: 19.0896,
          lng: 72.8273,
          phone: '+91 22 6647 8000',
          hours: '11:00 AM - 10:00 PM',
          rating: 4.5,
          stockStatus: isSmartphone ? 'Limited Stock' : 'In Stock',
          distance: '2.5 km'
        }
      ],
      Delhi: [
        {
          id: 'del-1',
          name: 'Reliance Digital - Connaught Place',
          address: 'E-Block, Rajiv Chowk, Connaught Place, New Delhi, DL 110001',
          lat: 28.6304,
          lng: 77.2177,
          phone: '+91 11 4150 9000',
          hours: '10:00 AM - 9:30 PM',
          rating: 4.1,
          stockStatus: 'In Stock',
          distance: '1.5 km'
        },
        {
          id: 'del-2',
          name: 'Vijay Sales - Karol Bagh',
          address: 'Arya Samaj Rd, Karol Bagh, New Delhi, DL 110005',
          lat: 28.6514,
          lng: 77.1906,
          phone: '+91 11 4545 8800',
          hours: '11:00 AM - 9:30 PM',
          rating: 4.3,
          stockStatus: 'Limited Stock',
          distance: '3.9 km'
        }
      ]
    };

    const list = storeTemplates[selectedCity] || storeTemplates['Bengaluru'];
    setStores(list as LocalStore[]);
    setActiveStore(list[0] as LocalStore);
  }, [selectedCity, product]);

  const getCityCoordinates = () => {
    switch (selectedCity) {
      case 'Mumbai': return { lat: 19.0760, lng: 72.8777 };
      case 'Delhi': return { lat: 28.6139, lng: 77.2090 };
      case 'Bengaluru':
      default: return { lat: 12.9716, lng: 77.5946 };
    }
  };

  const currentCenter = activeStore ? { lat: activeStore.lat, lng: activeStore.lng } : getCityCoordinates();

  return (
    <div className="border-t border-slate-200 pt-6 mt-6" id="local-store-finder-widget">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[#2563EB]" />
            <span>Store Availability & Local Maps Grounding</span>
          </h4>
          <p className="text-xs text-slate-500 mt-1 font-semibold">Verify physical demo stock and instant delivery options at regional dealers.</p>
        </div>

        {/* City Filter Selection */}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {(['Bengaluru', 'Mumbai', 'Delhi'] as const).map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                selectedCity === city
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Left pane: Stores list */}
        <div className="md:col-span-5 space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {stores.map((store) => {
            const isActive = activeStore?.id === store.id;
            return (
              <div
                key={store.id}
                onClick={() => {
                  setActiveStore(store);
                  setOpenInfoWindow(true);
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-blue-50/50 border-[#2563EB]'
                    : 'bg-white border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-extrabold text-[#111827] text-xs sm:text-sm flex items-center gap-1.5">
                      <span>{store.name}</span>
                    </h5>
                    <p className="text-[11px] text-slate-500 font-semibold line-clamp-1 mt-1">{store.address}</p>
                  </div>
                  <span className="text-[9px] font-black text-[#2563EB] bg-[#EFF6FF] px-2 py-1 rounded-md flex-shrink-0">
                    {store.distance}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 pt-3 border-t border-slate-100/60 text-[11px] text-slate-500 font-bold">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{store.hours}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-slate-700">{store.rating}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    store.stockStatus === 'In Stock'
                      ? 'bg-[#ECFDF5] text-[#22C55E]'
                      : store.stockStatus === 'Limited Stock'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-red-50 text-red-500'
                  }`}>
                    {store.stockStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right pane: Interactive Map Frame */}
        <div className="md:col-span-7 bg-slate-50 border-2 border-slate-100 rounded-3xl overflow-hidden relative min-h-[300px] md:min-h-auto flex flex-col">
          {hasValidKey ? (
            <div className="w-full flex-grow relative" style={{ height: '350px' }}>
              <APIProvider apiKey={API_KEY} version="weekly">
                <Map
                  center={currentCenter}
                  zoom={14}
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%' }}
                >
                  {stores.map((s) => (
                    <AdvancedMarker
                      key={s.id}
                      position={{ lat: s.lat, lng: s.lng }}
                      onClick={() => {
                        setActiveStore(s);
                        setOpenInfoWindow(true);
                      }}
                    >
                      <Pin 
                        background={s.id === activeStore?.id ? "#2563EB" : "#94A3B8"} 
                        glyphColor="#fff" 
                      />
                    </AdvancedMarker>
                  ))}

                  {openInfoWindow && activeStore && (
                    <InfoWindow
                      position={{ lat: activeStore.lat, lng: activeStore.lng }}
                      onCloseClick={() => setOpenInfoWindow(false)}
                    >
                      <div className="p-1 max-w-[200px]">
                        <strong className="text-xs text-slate-900 font-extrabold block">{activeStore.name}</strong>
                        <p className="text-[10px] text-slate-500 mt-1">{activeStore.address}</p>
                        <p className="text-[10px] font-black text-[#2563EB] mt-1">Status: {activeStore.stockStatus}</p>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
            </div>
          ) : (
            <div className="flex-grow p-6 flex flex-col justify-center items-center text-center relative overflow-hidden" style={{ minHeight: '320px' }}>
              {/* Decorative grid overlay */}
              <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] pointer-events-none"></div>
              
              <div className="relative z-10 max-w-sm space-y-4">
                <div className="h-12 w-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-[#2563EB] mx-auto shadow-sm animate-pulse">
                  <Compass className="h-6 w-6" />
                </div>
                
                <div>
                  <h5 className="font-extrabold text-[#111827] text-sm">Interactive Store Map Locked</h5>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-semibold">
                    To render our precision vector dealer maps, grab a Google Maps Platform API key and paste it as a secret:
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-left text-[11px] leading-relaxed text-slate-600 font-medium space-y-1.5 shadow-sm">
                  <p><strong>Step 1:</strong> Get a key at <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline">Google Cloud Console</a></p>
                  <p><strong>Step 2:</strong> Go to <strong>Settings</strong> (⚙️ gear, top-right) → <strong>Secrets</strong> → add <code>GOOGLE_MAPS_PLATFORM_KEY</code></p>
                </div>
              </div>
            </div>
          )}

          {/* Quick static details footer */}
          {activeStore && (
            <div className="bg-white border-t border-slate-100 p-4 text-xs font-bold text-slate-700 grid grid-cols-2 gap-4 flex-shrink-0">
              <a href={`tel:${activeStore.phone}`} className="flex items-center gap-2 hover:text-[#2563EB] transition-colors">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{activeStore.phone}</span>
              </a>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>{activeStore.hours}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
