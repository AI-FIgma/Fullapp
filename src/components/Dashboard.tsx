import { 
  ShoppingCart, Store, Stethoscope, GraduationCap, Scissors, 
  Bell, ChevronDown, MapPin, Heart, PawPrint 
} from 'lucide-react';
import { useState } from 'react';
import heroImage from 'figma:asset/3b825747bf85c46f9e1be6eb7f0ac3e3e9e30e3c.png';

// Icons for gender
const MaleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="14" r="6" />
    <path d="M20 4l-6.5 6.5" />
    <path d="M20 4v5" />
    <path d="M20 4h-5" />
  </svg>
);

const FemaleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="10" r="6" />
    <path d="M12 16v6" />
    <path d="M9 19h6" />
  </svg>
);

interface DashboardProps {
  onNavigate: (view: any) => void;
}

export function Dashboard({ 
  onNavigate 
}: DashboardProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const services = [
    { name: 'Internetinės...', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100', id: 'online' },
    { name: 'Fizinės...', icon: Store, color: 'text-orange-600', bg: 'bg-orange-100', id: 'physical' },
    { name: 'Veterinarijos', icon: Stethoscope, color: 'text-red-600', bg: 'bg-red-100', id: 'vet' },
    { name: 'Dresūra', icon: GraduationCap, color: 'text-pink-600', bg: 'bg-pink-100', id: 'training' },
    { name: 'Kirpyklos', icon: Scissors, color: 'text-teal-600', bg: 'bg-teal-100', id: 'grooming' },
  ];

  const categories = ['All', 'Cats', 'Dogs'];

  const pets = [
    {
      id: '1',
      name: 'Morengas',
      status: 'deceased',
      gender: 'male',
      age: '2.7 years',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80', // Bulldog/Boxer mix similar to screenshot
      breed: 'Mixed',
      type: 'dog'
    },
    {
      id: '2',
      name: 'Pamela',
      status: 'adopted',
      gender: 'female',
      age: '2 months',
      image: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=800&q=80', // Golden retriever puppy
      breed: 'Golden Retriever',
      type: 'dog'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-slate-900">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-transparent">
        {/* Avatar -> Personal Profile */}
        <button 
          onClick={() => onNavigate('personalProfile')} 
          className="w-10 h-10 rounded-full bg-[#D64B74] flex items-center justify-center text-white font-medium text-lg shadow-sm"
        >
          M
        </button>

        {/* Location */}
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4 text-gray-400 fill-gray-400" />
          <span className="text-slate-800 font-bold text-sm">Riešė</span>
          <ChevronDown className="w-4 h-4 text-teal-500" />
        </div>

        {/* Notification Bell */}
        <button 
          onClick={() => onNavigate('notifications')}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
        >
          <Bell className="w-5 h-5 text-slate-800" />
        </button>
      </div>

      <div className="px-5 space-y-6">
        
        {/* Hero Image */}
        <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-sm relative bg-gray-900">
          <img 
            src={heroImage} 
            alt="Black cat" 
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        {/* Services Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Services</h2>
            <button 
              onClick={() => onNavigate('services')}
              className="text-xs font-medium text-gray-400 hover:text-teal-600 transition-colors"
            >
              See All
            </button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5">
            {services.map((service) => (
              <button 
                key={service.id}
                onClick={() => onNavigate('services')}
                className="flex flex-col items-center gap-2 min-w-[72px]"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${service.bg} ${service.color} border border-white shadow-sm`}>
                  <service.icon className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] text-gray-500 font-medium text-center leading-tight truncate w-full">
                  {service.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Categories</h2>
            <button 
              onClick={() => onNavigate('explore')}
              className="text-xs font-medium text-gray-400 hover:text-teal-600 transition-colors"
            >
              See All
            </button>
          </div>
          
          <div className="flex gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm border ${
                  activeCategory === cat 
                    ? 'bg-[#64A6A6] text-white border-[#64A6A6]' 
                    : 'bg-gray-50 text-slate-700 border-transparent hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Pets Grid */}
        <div className="grid grid-cols-2 gap-4 pb-6">
          {pets.map((pet) => (
            <div 
              key={pet.id} 
              onClick={() => onNavigate('explore')}
              className="bg-[#F0F2F5] rounded-[1.5rem] p-3 shadow-sm flex flex-col gap-3 group active:scale-95 transition-transform"
            >
              {/* Image Container */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200">
                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-teal-700 hover:bg-white/60 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="px-1 pb-1">
                {/* Status Badge */}
                <div className="inline-block px-3 py-1 rounded-full bg-[#E5E7EB] mb-2">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                    {pet.status}
                  </span>
                </div>

                <h3 className="text-slate-800 font-bold text-base mb-2">{pet.name}</h3>

                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-1.5 ${
                    pet.gender === 'male' ? 'text-[#40E0D0]' : 'text-[#FF94C2]'
                  }`}>
                    {pet.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
                    <span className="text-xs font-medium capitalize">{pet.gender === 'male' ? 'Male' : 'Female'}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-orange-400">
                    <PawPrint className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-medium text-gray-500">{pet.age}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}