import { useState, useRef, type MouseEvent, type FormEvent } from 'react';
import { X, Search } from 'lucide-react';

export interface MapPoint {
  x: number;
  y: number;
  lat: number;
  lng: number;
}

export interface SearchProjectLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: {
    location: string;
    lat: string;
    lng: string;
    points: MapPoint[];
  }) => void;
  initialLocation?: string;
  initialLat?: string;
  initialLng?: string;
}

const PRESET_LOCATIONS = [
  { name: 'Kokapet, Gandipet, Hyderabad', lat: '17.3850', lng: '78.3288', x: 440, y: 380 },
  { name: 'Gachibowli, Hyderabad', lat: '17.4401', lng: '78.3489', x: 460, y: 350 },
  { name: 'Madhapur, Hitec City, Hyderabad', lat: '17.4483', lng: '78.3808', x: 500, y: 345 },
  { name: 'Financial District, Nanakramguda', lat: '17.4156', lng: '78.3427', x: 450, y: 365 },
  { name: 'Miyapur, Serilingampalle', lat: '17.4968', lng: '78.3547', x: 470, y: 290 },
  { name: 'Tellapur, Hyderabad', lat: '17.4520', lng: '78.2880', x: 380, y: 345 },
  { name: 'Narsingi, Gandipet', lat: '17.3812', lng: '78.3615', x: 490, y: 395 },
  { name: 'Mokila, Shankarpally Road', lat: '17.4100', lng: '78.2100', x: 260, y: 380 },
];

export function SearchProjectLocationModal({
  isOpen,
  onClose,
  onSave,
  initialLocation = 'Kokapet, Gandipet',
  initialLat = '17.3850',
  initialLng = '78.3288',
}: SearchProjectLocationModalProps) {
  const [searchLocation, setSearchLocation] = useState(initialLocation);
  const [currentLat, setCurrentLat] = useState(initialLat || '17.3850');
  const [currentLng, setCurrentLng] = useState(initialLng || '78.3288');
  const [mapType, setMapType] = useState<'map' | 'satellite'>('map');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  
  const [points, setPoints] = useState<MapPoint[]>([
    { x: 265, y: 375, lat: 17.41, lng: 78.21 }, 
    { x: 512, y: 338, lat: 17.45, lng: 78.38 }, 
    { x: 495, y: 385, lat: 17.38, lng: 78.36 }, 
  ]);

  const [marker, setMarker] = useState<{ x: number; y: number }>({ x: 495, y: 365 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  
  const handleMapClick = (e: MouseEvent<HTMLDivElement>) => {
    
    if ((e.target as HTMLElement).closest('button')) return;
    if (!mapContainerRef.current) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    
    const approxLat = (17.55 - (y / rect.height) * 0.3).toFixed(4);
    const approxLng = (78.18 + (x / rect.width) * 0.3).toFixed(4);

    const newPoint: MapPoint = {
      x,
      y,
      lat: parseFloat(approxLat),
      lng: parseFloat(approxLng),
    };

    setPoints((prev) => [...prev, newPoint]);
    setMarker({ x, y });
    setCurrentLat(approxLat);
    setCurrentLng(approxLng);
  };

  const handleUndo = () => {
    setPoints((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPoints([]);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        location: searchLocation,
        lat: currentLat,
        lng: currentLng,
        points,
      });
    }
    onClose();
  };

  const handleSelectPreset = (preset: typeof PRESET_LOCATIONS[0]) => {
    setSearchLocation(preset.name);
    setCurrentLat(preset.lat);
    setCurrentLng(preset.lng);
    setMarker({ x: preset.x, y: preset.y });
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!searchLocation.trim()) return;
    const match = PRESET_LOCATIONS.find((loc) =>
      loc.name.toLowerCase().includes(searchLocation.toLowerCase())
    );
    if (match) {
      handleSelectPreset(match);
    } else {
      setShowSuggestions(false);
    }
  };

  
  const polygonPointsStr = points.map((p) => `${p.x},${p.y}`).join(' ');

  
  const midpoints = points.map((p, idx) => {
    const next = points[(idx + 1) % points.length];
    return {
      x: (p.x + next.x) / 2,
      y: (p.y + next.y) / 2,
    };
  });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[6px] shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isFullscreen
            ? 'fixed inset-3 sm:inset-5 max-w-none max-h-none h-[calc(100vh-2rem)]'
            : 'max-w-3xl max-h-[92vh]'
        }`}
        role="dialog"
        aria-modal="true"
      >
        
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-white/10">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Search Project Location
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-[2px] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto no-scrollbar flex-1 flex flex-col">
          
          <div className="relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => {
                    setSearchLocation(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search location..."
                  className="w-full h-10 pl-3.5 pr-9 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/15 rounded-[4px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-[4px] shadow-xl max-h-48 overflow-y-auto">
                {PRESET_LOCATIONS.filter((l) =>
                  l.name.toLowerCase().includes(searchLocation.toLowerCase())
                ).map((loc) => (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => handleSelectPreset(loc)}
                    className="w-full px-3.5 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer border-b border-slate-100 dark:border-white/5 last:border-b-0"
                  >
                    <span>{loc.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {loc.lat}, {loc.lng}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          
          <div className="space-y-2.5">
            
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-[4px] border border-emerald-600 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-95"
              >
                Save Polygon
              </button>
              <button
                type="button"
                onClick={handleUndo}
                disabled={points.length === 0}
                className="px-4 py-2 rounded-[4px] border border-slate-800 dark:border-slate-700 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-white transition-all shadow-xs hover:shadow-sm cursor-pointer active:scale-95"
              >
                Undo last point
              </button>
            </div>

            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClear}
                disabled={points.length === 0}
                className="px-4 py-2 rounded-[4px] border border-rose-600 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-white transition-all shadow-xs hover:shadow-sm cursor-pointer active:scale-95"
              >
                Clear Polygon
              </button>
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium px-2.5 py-1 rounded-[4px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 select-none">
                Points: {points.length} ({points.length >= 3 ? 'drawing' : 'need 3+'})
              </span>
            </div>
          </div>

          
          <div className="px-3.5 py-2 rounded-[4px] bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-900/50 text-xs text-emerald-800 dark:text-emerald-200 font-medium">
            Click on the map to add vertices. Need at least 3 points to save.
          </div>

          
          <div
            ref={mapContainerRef}
            onClick={handleMapClick}
            className={`relative w-full rounded-[4px] border border-slate-300 dark:border-white/15 overflow-hidden select-none cursor-crosshair transition-all ${
              isFullscreen ? 'flex-1 min-h-[480px]' : 'h-[380px] sm:h-[430px]'
            } ${mapType === 'satellite' ? 'bg-[#1b2b34]' : 'bg-[#eaf4eb]'}`}
          >
            
            <div className="absolute top-3 left-3 z-20 flex rounded-[3px] shadow-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 overflow-hidden">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMapType('map');
                }}
                className={`px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  mapType === 'map'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                Map
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMapType('satellite');
                }}
                className={`px-3 py-1.5 text-xs font-semibold cursor-pointer border-l border-slate-200 dark:border-white/10 transition-colors ${
                  mapType === 'satellite'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                Satellite
              </button>
            </div>

            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen((prev) => !prev);
              }}
              className="absolute top-3 right-3 z-20 p-2 rounded-[3px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-md text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <svg className="w-4 h-4 text-slate-700 dark:text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>

            
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 800 480"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                
                <linearGradient id="satGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e322f" />
                  <stop offset="40%" stopColor="#2c3c33" />
                  <stop offset="70%" stopColor="#243329" />
                  <stop offset="100%" stopColor="#1c2b2b" />
                </linearGradient>
              </defs>

              
              {mapType === 'satellite' ? (
                <rect width="800" height="480" fill="url(#satGrad)" />
              ) : (
                <rect width="800" height="480" fill="#eaf3eb" />
              )}

              
              <g id="water-bodies">
                <path
                  d="M 240 420 Q 280 400, 340 415 T 410 440 T 430 460 Q 380 470, 310 465 Z"
                  fill={mapType === 'satellite' ? '#14384a' : '#9ecfe0'}
                />
                <path
                  d="M 60 365 Q 120 375, 180 370 T 260 380 T 380 405 T 500 420 T 680 450 T 800 445"
                  stroke={mapType === 'satellite' ? '#14384a' : '#b2daf0'}
                  strokeWidth="8"
                  fill="none"
                />
                <path
                  d="M 280 435 Q 350 420, 380 435"
                  stroke={mapType === 'satellite' ? '#14384a' : '#b2daf0'}
                  strokeWidth="12"
                  fill="none"
                />
              </g>

              
              <g id="green-zones">
                
                <path
                  d="M 370 240 Q 430 225, 450 270 T 390 295 Z"
                  fill={mapType === 'satellite' ? '#223d2e' : '#c3e6bf'}
                  stroke={mapType === 'satellite' ? 'none' : '#b2deb0'}
                  strokeWidth="1"
                />
                
                <path
                  d="M 200 395 Q 280 380, 360 400 T 430 430 T 350 475 T 220 445 Z"
                  fill={mapType === 'satellite' ? '#1b3626' : '#c6e8c4'}
                  stroke={mapType === 'satellite' ? 'none' : '#b4dfb2'}
                  strokeWidth="1"
                />
                
                <path
                  d="M 70 210 Q 150 190, 170 260 T 90 310 Z"
                  fill={mapType === 'satellite' ? '#1f3a29' : '#ccebc9'}
                  stroke={mapType === 'satellite' ? 'none' : '#bce1b9'}
                  strokeWidth="1"
                />
                
                <path
                  d="M 610 315 Q 655 295, 675 330 T 635 365 Z"
                  fill={mapType === 'satellite' ? '#223d2e' : '#bde2b9'}
                  stroke={mapType === 'satellite' ? 'none' : '#a9d7a5'}
                  strokeWidth="1"
                />
                
                <path
                  d="M 450 365 Q 495 345, 520 380 T 470 410 Z"
                  fill={mapType === 'satellite' ? '#223d2e' : '#c7e7c5'}
                  stroke={mapType === 'satellite' ? 'none' : '#b5deb3'}
                  strokeWidth="1"
                />
                <path
                  d="M 190 280 Q 240 270, 260 310 T 220 340 Z"
                  fill={mapType === 'satellite' ? '#223d2e' : '#cbeaca'}
                  stroke={mapType === 'satellite' ? 'none' : '#b9e0b8'}
                  strokeWidth="1"
                />
              </g>

              
              <g id="roads" opacity={mapType === 'satellite' ? '0.65' : '1'}>
                
                <path
                  d="M 120 100 L 180 480 M 320 80 L 350 480 M 520 80 L 530 480 M 680 120 L 710 480"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />
                <path
                  d="M 40 180 L 780 190 M 60 270 L 760 260 M 80 340 L 760 330 M 100 410 L 780 420"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />

                
                <path
                  d="M 100 80 Q 300 200, 500 220 T 780 260"
                  stroke={mapType === 'satellite' ? '#e2a336' : '#fed7aa'}
                  strokeWidth="5"
                  fill="none"
                />
                <path
                  d="M 460 80 Q 480 250, 490 380 T 520 480"
                  stroke={mapType === 'satellite' ? '#e2a336' : '#fed7aa'}
                  strokeWidth="5"
                  fill="none"
                />

                
                <path
                  d="M 210 100 Q 240 240, 265 375 T 480 460 T 720 420 T 760 200"
                  stroke="#3b82f6"
                  strokeWidth="3.5"
                  strokeDasharray="6,3"
                  fill="none"
                  opacity="0.8"
                />
              </g>

              
              <g id="labels" fontSize="11" fontFamily="sans-serif">
                
                <text x="470" y="270" fontWeight="bold" fill="#334155" textAnchor="middle">
                  Miyapur
                </text>
                <text x="470" y="284" fontSize="10" fill="#475569" textAnchor="middle">
                  మియాపూర్
                </text>

                
                <text x="560" y="315" fontWeight="bold" fill="#334155" textAnchor="middle">
                  MADHAPUR
                </text>
                <text x="560" y="328" fontSize="10" fill="#475569" textAnchor="middle">
                  మాదాపూర్
                </text>

                
                <text x="385" y="310" fontSize="10.5" fill="#475569" textAnchor="middle">
                  Serilingampalle (M)
                </text>
                <text x="385" y="323" fontSize="9.5" fill="#64748b" textAnchor="middle">
                  శేరిలింగంపల్లి
                </text>

                
                <text x="335" y="335" fontSize="10" fill="#475569" textAnchor="middle">
                  TELLAPUR
                </text>
                <text x="335" y="347" fontSize="9" fill="#64748b" textAnchor="middle">
                  తెల్లాపూర్
                </text>

                
                <text x="110" y="335" fontSize="10.5" fill="#475569" textAnchor="middle">
                  Mokila
                </text>
                <text x="110" y="347" fontSize="9.5" fill="#64748b" textAnchor="middle">
                  మొకిల
                </text>

                
                <text x="360" y="445" fontSize="11" fontWeight="bold" fill="#0284c7" textAnchor="middle">
                  Osman Sagar
                </text>
                <text x="360" y="458" fontSize="9.5" fill="#0284c7" textAnchor="middle">
                  గండిపేట్ చెరువు
                </text>

                
                <text x="505" y="425" fontSize="10.5" fill="#475569" textAnchor="middle">
                  Narsingi
                </text>
                <text x="505" y="437" fontSize="9.5" fill="#64748b" textAnchor="middle">
                  నార్సింగి
                </text>

                
                <text x="580" y="390" fontSize="10" fill="#475569" textAnchor="middle">
                  Manikonda
                </text>
                <text x="580" y="402" fontSize="9" fill="#64748b" textAnchor="middle">
                  మణికొండ
                </text>

                
                <text x="670" y="380" fontSize="20" fontWeight="bold" fill="#1e293b" textAnchor="middle">
                  Hyderabad
                </text>
                <text x="670" y="405" fontSize="16" fontWeight="bold" fill="#334155" textAnchor="middle">
                  హైదరాబాద్
                </text>

                
                <text x="700" y="325" fontSize="11" fontWeight="bold" fill="#334155" textAnchor="middle">
                  Secunderabad
                </text>
                <text x="700" y="338" fontSize="10" fill="#475569" textAnchor="middle">
                  సికింద్రాబాద్
                </text>

                
                <text x="690" y="275" fontSize="9.5" fill="#64748b" textAnchor="middle">
                  BALANAGAR
                </text>

                
                <g transform="translate(370, 280)">
                  <rect x="0" y="0" width="18" height="13" rx="2" fill="#eab308" />
                  <text x="9" y="10" fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                    65
                  </text>
                </g>
                <g transform="translate(585, 290)">
                  <rect x="0" y="0" width="18" height="13" rx="2" fill="#eab308" />
                  <text x="9" y="10" fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                    65
                  </text>
                </g>
                <g transform="translate(825, 260)">
                  <rect x="0" y="0" width="18" height="13" rx="2" fill="#eab308" />
                  <text x="9" y="10" fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                    44
                  </text>
                </g>

                
                <text x="270" y="360" fontSize="9" fill="#2563eb" transform="rotate(45, 270, 360)">
                  Nehru Outer Ring Rd
                </text>
              </g>

              
              {points.length >= 3 && (
                <polygon
                  points={polygonPointsStr}
                  fill="rgba(16, 185, 129, 0.25)"
                  stroke="#059669"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              )}

              
              {points.length === 2 && (
                <line
                  x1={points[0].x}
                  y1={points[0].y}
                  x2={points[1].x}
                  y2={points[1].y}
                  stroke="#059669"
                  strokeWidth="2.5"
                />
              )}

              
              {points.length >= 3 &&
                midpoints.map((mp, i) => (
                  <circle
                    key={`mp-${i}`}
                    cx={mp.x}
                    cy={mp.y}
                    r="4"
                    fill="#ffffff"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                ))}

              
              {points.map((pt, i) => (
                <circle
                  key={`pt-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="#ffffff"
                  stroke="#059669"
                  strokeWidth="2.5"
                  className="transition-transform hover:scale-125 cursor-pointer"
                />
              ))}

              
              <g transform={`translate(${marker.x - 12}, ${marker.y - 28})`}>
                
                <ellipse cx="12" cy="27" rx="6" ry="2.5" fill="#000000" opacity="0.25" />
                
                <path
                  d="M12 0 C5.37 0 0 5.37 0 12 C0 20.25 12 28 12 28 C12 28 24 20.25 24 12 C24 5.37 18.63 0 12 0 Z"
                  fill="#ea4335"
                />
                <circle cx="12" cy="10.5" r="4.5" fill="#7f1d1d" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchProjectLocationModal;
