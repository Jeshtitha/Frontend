
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Filter, Star, Clock, UserCheck, Leaf, Car, ExternalLink } from 'lucide-react';
import { Ride } from '../types';
import { backendService } from '../services/backendService';
import { getRouteSuggestions } from '../services/geminiService';

const FindRide = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookedId, setBookedId] = useState<string | null>(null);
  const [mapSuggestions, setMapSuggestions] = useState<{text: string, links: any[]}>({ text: '', links: [] });

  useEffect(() => {
    const fetchRides = () => {
      const data = backendService.getRides();
      setRides(data.filter(r => r.status === 'active' && r.availableSeats > 0));
      setLoading(false);
    };
    fetchRides();
  }, [bookedId]);

  const handleBook = (id: string) => {
    const success = backendService.bookRide(id);
    if (success) {
      setBookedId(id);
      setTimeout(() => setBookedId(null), 3000);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    // Real-time AI Route Matching
    const res = await getRouteSuggestions("Koramangala", "Whitefield");
    setMapSuggestions(res);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find a Ride</h1>
        <span className="text-sm text-gray-500 bg-white border border-gray-100 px-4 py-2 rounded-full font-medium shadow-sm">
          {rides.length} rides available across your city
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 sticky top-24">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="text" placeholder="Starting point (e.g. Noida)" className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-black" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="text" placeholder="Destination (e.g. Gurgaon)" className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-black" />
              </div>
            </div>
            <button 
              onClick={handleSearch}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
            >
              Search Rides
            </button>
            
            {mapSuggestions.text && (
              <div className="pt-4 border-t border-gray-50">
                <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl leading-relaxed">
                  <span className="font-bold block mb-1 uppercase tracking-tight">AI Route Advisor:</span>
                  {mapSuggestions.text.slice(0, 150)}...
                </p>
                {mapSuggestions.links.map((link, i) => (
                  <a key={i} href={link.uri} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-1 text-[10px] text-blue-600 font-bold hover:underline">
                    <ExternalLink className="h-3 w-3" /> {link.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {loading ? (
             <div className="text-center py-20 animate-pulse">
                <Car className="h-10 w-10 text-emerald-200 mx-auto mb-2" />
                <p className="text-gray-400 font-medium italic">Scanning for best route matches...</p>
             </div>
          ) : rides.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
               <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-gray-900">No rides found in this sector</h3>
               <p className="text-gray-500">Try searching for broader hubs like Metro stations.</p>
            </div>
          ) : (
            rides.map((ride) => (
              <div key={ride.id} className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${bookedId === ride.id ? 'border-emerald-500 bg-emerald-50 scale-[0.98]' : 'border-gray-100 hover:border-emerald-300'}`}>
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <img src={ride.driverAvatar} className="w-10 h-10 rounded-full border border-emerald-100" alt="" />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-gray-900">{ride.driverName}</span>
                          <UserCheck className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold flex items-center gap-1 uppercase">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.9 • 50+ Rides
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <div className="bg-emerald-50 p-1.5 rounded-lg"><MapPin className="h-4 w-4 text-emerald-600" /></div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Route</p>
                          <p className="text-gray-800 text-sm font-semibold">{ride.origin} → {ride.destination}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="bg-blue-50 p-1.5 rounded-lg"><Clock className="h-4 w-4 text-blue-600" /></div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Departure</p>
                          <p className="text-gray-800 text-sm font-semibold">{ride.departureTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between md:items-end min-w-[140px] border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                    <div>
                      <div className="text-3xl font-black text-gray-900">₹{ride.price}</div>
                      <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase">{ride.availableSeats} SEATS AVAILABLE</p>
                      <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                        <Leaf className="h-3 w-3" /> -{ride.carbonSavedKg}kg CO2 OFFSET
                      </div>
                    </div>
                    <button 
                      onClick={() => handleBook(ride.id)}
                      disabled={bookedId === ride.id}
                      className={`mt-4 w-full md:w-auto px-6 py-3 rounded-xl font-bold transition-all ${bookedId === ride.id ? 'bg-emerald-600 text-white shadow-inner scale-95' : 'bg-gray-900 text-white hover:bg-emerald-600 hover:shadow-lg'}`}
                    >
                      {bookedId === ride.id ? 'Seat Confirmed!' : 'Request Ride'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FindRide;
