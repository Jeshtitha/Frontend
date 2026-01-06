
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  PlusCircle, 
  Leaf, 
  User as UserIcon, 
  Menu, 
  X,
  MapPin,
  Clock,
  Car,
  ChevronRight,
  LogOut
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import FindRide from './pages/FindRide';
import OfferRide from './pages/OfferRide';
import Impact from './pages/Impact';
import Auth from './pages/Auth';
import { backendService } from './services/backendService';
import { User } from './types';

const Navbar = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Find Ride', path: '/find', icon: Search },
    { name: 'Offer Ride', path: '/offer', icon: PlusCircle },
    { name: 'Impact', path: '/impact', icon: Leaf },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tighter">
                EcoRide
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                  location.pathname === item.path
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-gray-500 hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
            
            <div className="h-8 w-px bg-gray-100 mx-2"></div>
            
            <div className="flex items-center gap-3 bg-gray-50 pl-2 pr-4 py-1.5 rounded-full border border-gray-100">
              <img src={user.avatar} className="h-8 w-8 rounded-full border border-white" alt="Profile" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Profile</span>
                <span className="text-xs font-bold text-gray-900">{user.name.split(' ')[0]}</span>
              </div>
              <button 
                onClick={() => backendService.logout()}
                className="ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-emerald-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 pb-4 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-bold ${
                location.pathname === item.path
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-500 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
          <button 
            onClick={() => backendService.logout()}
            className="flex items-center gap-3 px-3 py-3 w-full text-left rounded-xl text-red-500 font-bold hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(backendService.getCurrentUser());

  const handleAuthSuccess = () => {
    setUser(backendService.getCurrentUser());
  };

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/find" element={<FindRide />} />
            <Route path="/offer" element={<OfferRide />} />
            <Route path="/impact" element={<Impact />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p className="font-medium">&copy; 2024 EcoRide Platform. Reducing congestion, one ride at a time.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}
