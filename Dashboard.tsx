
import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  Wind,
  ChevronRight,
  Leaf,
  Car
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getEcoInsights } from '../services/geminiService';
import { backendService } from '../services/backendService';
import { User, ImpactStats, Ride } from '../types';

const Dashboard = () => {
  const [ecoTip, setEcoTip] = useState("Loading green insights...");
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [activeRides, setActiveRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const currentUser = backendService.getCurrentUser();
      const currentStats = backendService.getStats();
      const allRides = backendService.getRides();
      
      setUser(currentUser);
      setStats(currentStats);
      setActiveRides(allRides.filter(r => r.status === 'active').slice(0, 3));
      setLoading(false);

      if (currentUser) {
        const tip = await getEcoInsights(currentStats.totalKmShared || 10, 2);
        setEcoTip(tip);
      }
    };
    loadData();
  }, []);

  const statCards = [
    { label: 'CO2 Offset', value: `${stats?.totalCarbonSaved.toFixed(1) || 0} kg`, icon: Wind, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Money Saved', value: `₹${stats?.totalMoneySaved.toLocaleString('en-IN') || 0}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total KM', value: `${stats?.totalKmShared.toLocaleString('en-IN') || 0}`, icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Trips', value: `${stats?.tripsCount || 0}`, icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Preparing your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Hero */}
      <div className="mb-10 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-black mb-2 tracking-tight">Namaste, {user.name.split(' ')[0]}!</h1>
          <p className="text-emerald-50 text-lg mb-6 font-medium">
            Your carpooling efforts have offset carbon equivalent to planting {( (stats?.totalCarbonSaved || 0) / 15).toFixed(1)} saplings across India.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/find" className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-black hover:bg-emerald-50 transition-all flex items-center gap-2">
              Find a Ride <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/offer" className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-black hover:bg-emerald-400 transition-all">
              Offer a Ride
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Popular Local Routes</h2>
          {activeRides.length > 0 ? activeRides.map((ride) => (
            <div key={ride.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img src={ride.driverAvatar} className="w-12 h-12 rounded-full border-2 border-emerald-100" alt="User" />
                  <div>
                    <h3 className="font-bold text-gray-900">{ride.driverName}</h3>
                    <div className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Verified Member</div>
                  </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-black text-gray-900">₹{ride.price}</span>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{ride.availableSeats} seats left</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-2xl mb-6 space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></div>
                    <p className="text-sm text-gray-700 font-bold">{ride.origin}</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-100"></div>
                    <p className="text-sm text-gray-700 font-bold">{ride.destination}</p>
                 </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div className="flex items-center gap-4 text-[10px] text-gray-400 font-black tracking-widest">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-emerald-500" /> {ride.departureTime}</span>
                  <span className="flex items-center gap-1 text-emerald-600"><Leaf className="h-4 w-4" /> -{ride.carbonSavedKg}KG CO2</span>
                </div>
                <Link to="/find" className="text-emerald-600 font-black text-sm flex items-center gap-1 hover:underline">
                  BOOK <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center">
                <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 font-bold">No active rides posted yet.</p>
                <Link to="/offer" className="mt-4 inline-block text-emerald-600 font-black uppercase text-xs tracking-widest">Offer a Ride &rarr;</Link>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-emerald-700">
              <Leaf className="h-5 w-5" />
              <h3 className="font-black text-xs uppercase tracking-widest">India Eco Insight</h3>
            </div>
            <p className="text-emerald-800 text-sm italic leading-relaxed font-bold">"{ecoTip}"</p>
          </div>

          <div className="bg-gray-900 p-8 rounded-3xl text-white relative overflow-hidden">
            <h3 className="font-black mb-4 text-emerald-400 text-sm uppercase tracking-widest">Carpool Hotspots</h3>
            <div className="space-y-3 relative z-10">
               <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5">
                  <span className="text-sm font-bold">Silk Board, Bangalore</span>
                  <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black">BUSY</span>
               </div>
               <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5">
                  <span className="text-sm font-bold">Rajiv Chowk, Delhi</span>
                  <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black">ACTIVE</span>
               </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500 opacity-10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
