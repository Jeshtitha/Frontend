
import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Car, 
  Users, 
  IndianRupee, 
  Leaf,
  Info,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { getRouteSuggestions } from '../services/geminiService';
import { backendService } from '../services/backendService';

const OfferRide = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<{text: string, links: any[]}>({ text: '', links: [] });
  
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    seats: 3,
    price: 150
  });

  const handleGetSuggestions = async () => {
    if (!formData.origin || !formData.destination) return;
    setLoadingSuggestions(true);
    const data = await getRouteSuggestions(formData.origin, formData.destination);
    setSuggestions(data);
    setLoadingSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = backendService.getCurrentUser();
    
    backendService.offerRide({
      driverId: user.id,
      driverName: user.name,
      driverAvatar: user.avatar,
      origin: formData.origin,
      destination: formData.destination,
      departureTime: `${formData.date} at ${formData.time}`,
      availableSeats: Number(formData.seats),
      price: Number(formData.price),
      distanceKm: 20 
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Shabaash! Ride Posted.</h2>
        <p className="text-gray-600 mb-8 px-10">
          Your ride from <span className="font-bold text-emerald-600">{formData.origin}</span> to <span className="font-bold text-emerald-600">{formData.destination}</span> is now visible to commuters in your city.
        </p>
        <button onClick={() => setSubmitted(false)} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-100 hover:scale-105 transition-transform">
          Publish Another Ride
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Offer a Ride</h1>
        <p className="text-gray-500 mb-10">Help reduce India's traffic and fuel consumption while splitting your travel costs.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-emerald-500" />
                    <input required type="text" value={formData.origin} onChange={(e) => setFormData({...formData, origin: e.target.value})} onBlur={handleGetSuggestions} placeholder="e.g. Indiranagar Metro" className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Dropoff Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-blue-500" />
                    <input required type="text" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} onBlur={handleGetSuggestions} placeholder="e.g. ITPL, Whitefield" className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-black" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Date</label>
                  <input required type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-black" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Start Time</label>
                  <input required type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-black" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Seats Offered</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input required type="number" value={formData.seats} onChange={(e) => setFormData({...formData, seats: Number(e.target.value)})} min="1" max="6" className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Price per Seat (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3.5 h-5 w-5 text-emerald-600" />
                    <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} step="10" className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-black" />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-2xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">
                <Car className="h-6 w-6" /> Publish My Ride
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <h3 className="font-black text-emerald-600 flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                <Info className="h-5 w-5" /> Smart Route AI
              </h3>
              {loadingSuggestions ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
                </div>
              ) : suggestions.text ? (
                <div className="space-y-4">
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {suggestions.text}
                  </p>
                  {suggestions.links.length > 0 && (
                    <div className="pt-2">
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Mapped Landmarks:</p>
                       {suggestions.links.map((link, i) => (
                         <a key={i} href={link.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold hover:underline mb-1">
                           <ExternalLink className="h-3 w-3" /> {link.title}
                         </a>
                       ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-xs italic">Enter your route to see AI-powered traffic optimization tips and pickup points.</p>
              )}
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
               <h4 className="text-emerald-900 font-bold mb-2">Safety Tip</h4>
               <p className="text-xs text-emerald-700 leading-relaxed">
                  Always confirm the passenger's ID through the app before starting your journey. Use major Metro station exits for safer evening pickups.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferRide;
