import { useState, useEffect } from 'react';
import { 
  Search, MapPin, Star, Filter, Phone, Globe, Navigation, 
  Stethoscope, Scissors, Home, GraduationCap, Footprints, 
  ShoppingBag, Pill, Truck, ExternalLink, Map as MapIcon, 
  List as ListIcon, ChevronLeft, ChevronRight, Store, Building2, Clock, Check, Heart, Loader2,
  PawPrint, Bone
} from 'lucide-react';
import { useTranslation } from '../utils/useTranslation';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ServicesProps {
  onNavigate: (view: any) => void;
}

type ServiceType = 'physical' | 'online' | 'chain';
type ViewState = 'landing' | 'category' | 'chain_details';
type FilterType = 'all' | 'online' | 'open';

interface Branch {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  isOpen: boolean;
  distance: number;
  phone?: string;
}

interface Service {
  id: string;
  name: string;
  type: ServiceType;
  category: string;
  rating: number;
  reviews: number;
  // Physical & Chain
  distance?: number; 
  address?: string;
  isOpen?: boolean;
  // Online
  deliveryDays?: string;
  websiteUrl?: string;
  // Chain Specific
  branches?: Branch[];
  hasOnlineStore?: boolean;
  // Common
  image: string;
  tags: string[];
  promoted?: boolean;
  description?: string;
  // Allow any other properties from DB
  [key: string]: any;
}

interface ServiceCategory {
  id: string;
  label: string;
  iconName: string;
  imageUrl?: string | null;
  color: string;
  desc: string;
  [key: string]: any;
}

export function Services({ onNavigate }: ServicesProps) {
  const { t } = useTranslation();
  
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [selectedCategory, setSelectedCategory] = useState<string>('shop');
  const [selectedChain, setSelectedChain] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filterType, setFilterType] = useState<FilterType>('all');
  
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping helper
  const getIcon = (name: string) => {
    const icons: Record<string, any> = {
      ShoppingBag, Stethoscope, Pill, Scissors, Home, GraduationCap, Footprints,
      PawPrint, Bone, Store
    };
    // Normalize name just in case
    const normalized = name ? name.replace(/-/g, '') : '';
    // Find key case-insensitive
    const foundKey = Object.keys(icons).find(k => k.toLowerCase() === normalized.toLowerCase());
    return foundKey ? icons[foundKey] : ShoppingBag;
  };

  // Ultra-smart image extractor that searches by key pattern
  const extractImage = (item: any, depth = 0): string | null => {
    if (!item || depth > 2) return null;

    // 1. Direct priority check (common fields)
    const priority = ['logo', 'image', 'imageUrl', 'url', 'src', 'cover', 'thumbnail', 'icon'];
    for (const p of priority) {
        if (item[p] && typeof item[p] === 'string' && (item[p].startsWith('http') || item[p].startsWith('/'))) return item[p];
        if (item[p] && typeof item[p] === 'object') {
             if (item[p].url) return item[p].url;
             if (item[p].src) return item[p].src;
        }
    }

    // 2. Scan ALL keys for keywords (e.g. "serviceLogo", "category_icon", "branding_image")
    const keys = Object.keys(item);
    for (const key of keys) {
        const k = key.toLowerCase();
        // Skip keys that are definitely not images
        if (k.includes('id') || k.includes('name') || k.includes('desc') || k.includes('date')) continue;

        if (k.includes('logo') || k.includes('image') || k.includes('img') || k.includes('icon') || k.includes('photo') || k.includes('file') || k.includes('pic')) {
            const val = item[key];
            
            // If string
            if (typeof val === 'string' && (val.startsWith('http') || val.startsWith('/') || val.includes('data:image'))) {
                return val;
            }
            // If object with url/src
            if (val && typeof val === 'object') {
                if (val.url) return val.url;
                if (val.src) return val.src;
                if (val.path) return val.path;
            }
            // If array
            if (Array.isArray(val) && val.length > 0) {
                if (typeof val[0] === 'string') return val[0];
                if (val[0].url) return val[0].url;
            }
        }
    }

    // 3. Recursive check in specific container objects
    const containers = ['details', 'media', 'branding', 'assets', 'files', 'settings'];
    for (const c of containers) {
        if (item[c] && typeof item[c] === 'object') {
            const found = extractImage(item[c], depth + 1);
            if (found) return found;
        }
    }

    return null;
  };


  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3d55d0fe`;
        
        const [servicesRes, categoriesRes] = await Promise.all([
            fetch(`${baseUrl}/services`, { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }),
            fetch(`${baseUrl}/service-categories`, { headers: { 'Authorization': `Bearer ${publicAnonKey}` } })
        ]);

        // Process Services
        if (servicesRes.ok) {
           const data = await servicesRes.json();
           
           if (Array.isArray(data)) {
               // Map incoming data safely but KEEP ALL ORIGINAL FIELDS
               const mapped = data.map((item: any) => {
                   // Smart extraction
                   let img = extractImage(item);
                   
                   // Determine tags/pet types
                   const rawTags = Array.isArray(item.tags) ? [...item.tags] : [];
                   // Look for specific pet flags in the whole object
                   const jsonStr = JSON.stringify(item).toLowerCase();
                   if (item.dogs || item.for_dogs || item.allows_dogs || jsonStr.includes('dog') || jsonStr.includes('šun')) rawTags.push('Dogs');
                   if (item.cats || item.for_cats || item.allows_cats || jsonStr.includes('cat') || jsonStr.includes('kat')) rawTags.push('Cats');
                   
                   const uniqueTags = Array.from(new Set(rawTags));

                   return {
                       ...item, // SPREAD ALL ORIGINAL DATA so we don't lose anything
                       id: String(item.id),
                       name: item.name || item.title || item.label || 'Unnamed Service',
                       type: item.type || 'physical',
                       category: String(item.categoryId || item.category || 'other'),
                       rating: Number(item.rating) || 0,
                       reviews: Number(item.reviews) || 0,
                       image: img,
                       tags: uniqueTags,
                       address: item.address || item.location || '',
                       distance: Number(item.distance) || (Math.random() * 5).toFixed(1),
                       isOpen: item.isOpen ?? true,
                       promoted: item.promoted || false,
                       description: item.description || item.desc || item.about || item.info || item.details || '',
                       branches: item.branches || [],
                       websiteUrl: item.websiteUrl || item.url || item.website || '',
                       deliveryDays: item.deliveryDays || '1-2'
                   };
               });
               setServices(mapped);
           }
        }

        // Process Categories
        if (categoriesRes.ok) {
             const data = await categoriesRes.json();
             if (Array.isArray(data)) {
                 const mapped = data.map((item: any) => {
                    const imgUrl = extractImage(item);
                    return {
                        ...item, // Keep all original fields
                        id: String(item.id),
                        label: item.label || item.name || item.title || item.categoryName || item.displayName || 'Unnamed Category',
                        iconName: item.iconName || item.icon || 'ShoppingBag',
                        imageUrl: imgUrl,
                        color: item.color || 'bg-slate-100 text-slate-900',
                        desc: item.desc || item.description || ''
                    };
                 });
                 setCategories(mapped);
             }
        }

      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Handlers
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setViewState('category');
    setFilterType('all');
    window.scrollTo(0, 0);
  };

  const handleChainSelect = (service: Service) => {
    setSelectedChain(service);
    setViewState('chain_details');
    window.scrollTo(0, 0);
  };

  const handleBackToLanding = () => {
    setViewState('landing');
    setSearchQuery('');
    setFilterType('all');
  };

  const handleBackToCategory = () => {
    setViewState('category');
    setSelectedChain(null);
  };

  // Filter Logic
  const filteredServices = services.filter(service => {
    // 1. Category Filter (Robust comparison)
    // Normalize both sides to string to handle number/string mismatch safely
    const serviceCat = String(service.category || '');
    const selectedCat = String(selectedCategory || '');
    
    // If exact match doesn't work, try finding if the service belongs to this category via loose check
    // but ensure we don't match "1" with "12" purely by substring unless intended
    const match = serviceCat === selectedCat;
    
    if (!match) return false;
    
    // 2. Type Filter
    if (filterType === 'online') {
      if (service.type !== 'online' && !service.hasOnlineStore) return false;
    }
    
    if (filterType === 'open') {
      if (service.type === 'online') return false;
      if (!service.isOpen) return false;
    }

    // 3. Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        service.name.toLowerCase().includes(q) || 
        service.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Sort: Promoted first
  filteredServices.sort((a, b) => {
    if (a.promoted && !b.promoted) return -1;
    if (!a.promoted && b.promoted) return 1;
    return 0;
  });

  // --- RENDERERS ---

  const renderLanding = () => (
    <div className="min-h-screen bg-slate-50 pb-24 px-5 pt-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('services.title')}</h1>
        <p className="text-slate-500 font-medium text-lg">Find the best for your pet</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {loading ? (
            <div className="col-span-2 py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="animate-spin text-teal-600 w-10 h-10 mb-3" />
                <span className="text-sm font-medium">Loading categories...</span>
            </div>
        ) : categories.length > 0 ? (
            categories.map((cat) => {
                const Icon = getIcon(cat.iconName);
                const hasImage = !!cat.imageUrl;
                // Extract clean colors if needed, or default
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="relative group flex flex-col items-start p-5 bg-white rounded-[1.5rem] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 border border-slate-100 hover:-translate-y-1 active:scale-[0.98] text-left overflow-hidden"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors overflow-hidden ${hasImage ? 'bg-white' : (cat.color.includes('bg-') ? cat.color : 'bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white')}`}>
                      {hasImage ? (
                        <img src={cat.imageUrl!} alt={cat.label} className="w-full h-full object-cover" />
                      ) : (
                        <Icon className="w-6 h-6" strokeWidth={1.5} />
                      )}
                    </div>
                    <span className="text-lg font-bold text-slate-900 leading-tight mb-1 group-hover:text-teal-600 transition-colors">{cat.label}</span>
                    <span className="text-xs text-slate-400 font-medium line-clamp-1">{cat.desc}</span>
                    
                    {/* Decorative Blob */}
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                  </button>
                );
            })
        ) : (
            <div className="col-span-2 text-center py-10 text-slate-400">
                <p>No categories found.</p>
            </div>
        )}
      </div>
    </div>
  );

  const renderChainDetails = () => {
    if (!selectedChain) return null;

    return (
      <div className="min-h-screen bg-white pb-24 font-sans relative z-50">
         {/* Hero Image */}
         <div className="relative h-64 w-full bg-slate-100">
            {selectedChain.image ? (
                <img src={selectedChain.image} alt={selectedChain.name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-200">
                    <span className="text-6xl font-black text-slate-300 select-none">
                        {selectedChain.name.charAt(0).toUpperCase()}
                    </span>
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            
            <button 
              onClick={handleBackToCategory}
              className="absolute top-12 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
         </div>

         {/* Content */}
         <div className="px-5 -mt-10 relative">
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-50">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">{selectedChain.name}</h1>
                        <div className="flex gap-2">
                             {selectedChain.tags?.map(tag => (
                                 <span key={tag} className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{tag}</span>
                             ))}
                        </div>
                    </div>
                    <div className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl font-bold text-sm flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        {selectedChain.rating}
                    </div>
                </div>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {selectedChain.description || `Welcome to ${selectedChain.name}. We provide top-quality services for your beloved pets across multiple locations.`}
                </p>

                {selectedChain.hasOnlineStore && (
                  <a 
                    href={selectedChain.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-slate-900 text-white h-12 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-slate-200 active:scale-[0.98] transition-all mb-8"
                  >
                    <Globe className="w-5 h-5" />
                    Visit Online Store
                  </a>
                )}

                <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-teal-600" />
                      Locations ({selectedChain.branches?.length || 0})
                    </h3>

                    <div className="space-y-4">
                      {selectedChain.branches?.map((branch) => (
                        <div key={branch.id} className="group bg-slate-50 p-4 rounded-2xl hover:bg-white hover:shadow-md hover:border-slate-100 border border-transparent transition-all cursor-pointer">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-slate-900">{branch.name}</h4>
                              <p className="text-sm text-slate-500 mt-0.5">{branch.address}</p>
                            </div>
                            <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${branch.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {branch.isOpen ? 'Open' : 'Closed'}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                             <span>{branch.distance} km away</span>
                             <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 bg-white shadow-sm rounded-lg text-slate-900 hover:text-teal-600">
                                    <Navigation className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 bg-white shadow-sm rounded-lg text-slate-900 hover:text-teal-600">
                                    <Phone className="w-4 h-4" />
                                </button>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                </div>
            </div>
         </div>
      </div>
    );
  };

  const renderCategoryList = () => {
    // Find current category label safely
    const currentCat = categories.find(c => c.id === selectedCategory) || { label: 'Services', id: 'all' };
    
    return (
    <div className="min-h-screen bg-white pb-24 font-sans relative">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-gray-100">
        <div className="px-4 pt-12 pb-3">
          {/* Top Nav Row */}
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={handleBackToLanding}
              className="flex items-center gap-2 text-slate-900 hover:text-teal-600 transition-colors font-bold text-lg"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                 <ChevronLeft className="w-5 h-5" />
              </div>
              {currentCat.label}
            </button>
            
            {/* View Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'map' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative mb-4 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${currentCat.label.toLowerCase()}...`}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl text-sm font-medium text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all shadow-sm border border-transparent focus:border-teal-100"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
             {['all', 'open', 'online'].map((ft) => {
                 if (ft === 'online' && !['shop', 'pharmacy', 'vet'].includes(selectedCategory) && selectedCategory !== 'all') return null;
                 
                 const isActive = filterType === ft;
                 let label = t('services.filter.all');
                 let Icon = Filter;
                 
                 if (ft === 'open') { label = 'Open Now'; Icon = Clock; }
                 if (ft === 'online') { label = 'Online'; Icon = Globe; }

                 return (
                    <button
                        key={ft}
                        onClick={() => setFilterType(ft as FilterType)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap flex items-center gap-1.5 ${
                        isActive
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        {ft !== 'all' && <Icon className="w-3.5 h-3.5" />}
                        {label}
                    </button>
                 );
             })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'list' ? (
        <div className="px-5 py-6 space-y-6 bg-slate-50 min-h-[calc(100vh-200px)]">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-400">
               <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-2" />
               <span className="text-xs font-medium uppercase tracking-wider">Finding Services...</span>
             </div>
          ) : filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div 
                key={service.id}
                onClick={() => service.type === 'chain' ? handleChainSelect(service) : null}
                className="group bg-white rounded-[1.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/60 border border-slate-100 overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Area */}
                <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                  {service.image ? (
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 transition-colors group-hover:bg-slate-200">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-2">
                             <span className="text-2xl font-black text-slate-300 group-hover:text-teal-500 transition-colors">
                                 {service.name.charAt(0).toUpperCase()}
                             </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                      {service.promoted && (
                        <div className="bg-white/95 backdrop-blur text-slate-900 text-[10px] font-extrabold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">
                          Promoted
                        </div>
                      )}
                      {service.isOpen ? (
                          <div className="bg-emerald-500/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Open
                          </div>
                      ) : (
                          <div className="bg-rose-500/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Closed
                          </div>
                      )}
                  </div>

                  <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-rose-500 transition-all">
                      <Heart className="w-4 h-4" />
                  </button>

                  {/* Bottom Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                     <div>
                        <h3 className="text-xl font-bold text-white leading-tight drop-shadow-md mb-1">{service.name}</h3>
                        <p className="text-white/80 text-xs font-medium flex items-center gap-1">
                           <MapPin className="w-3.5 h-3.5" />
                           {service.distance} km • {service.address}
                        </p>
                     </div>
                     
                     <div className="flex items-center gap-1 bg-white/95 backdrop-blur text-slate-900 px-2 py-1 rounded-lg font-bold text-xs shadow-lg">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {service.rating}
                     </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-4">
                  {/* Tags & Action */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1.5 flex-wrap">
                        {service.tags?.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-md border border-slate-100 font-bold uppercase tracking-wide">
                            {tag}
                        </span>
                        ))}
                    </div>
                    {service.type === 'chain' && (
                        <span className="text-xs font-bold text-teal-600 flex items-center gap-1">
                            See Locations <ChevronRight className="w-3 h-3" />
                        </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-10">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-dashed border-slate-300">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No results found</h3>
              <p className="text-sm text-gray-500 max-w-[200px] mx-auto">
                Try adjusting filters or checking a different category.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Map View (Mock) */
        <div className="relative h-[calc(100vh-200px)] bg-slate-100">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
             <MapIcon className="w-16 h-16 mb-4 opacity-20" />
             <p className="text-sm font-medium opacity-60">Map view is loading...</p>
          </div>
        </div>
      )}
    </div>
    );
  };

  return (
    <>
      {viewState === 'landing' && renderLanding()}
      {viewState === 'category' && renderCategoryList()}
      {viewState === 'chain_details' && renderChainDetails()}
      {/* Temporary Debug View - Commented out for production */}
      {/* {renderDebug()} */}
    </>
  );
}
