
import React, { useState } from 'react';
import { Car, Mail, Lock, User, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';
import { backendService } from '../services/backendService';

const Auth = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        backendService.login(formData.email, formData.password);
      } else {
        backendService.signup(formData.name, formData.email, formData.password);
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Visual Side */}
        <div className="md:w-1/2 bg-emerald-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-white p-2 rounded-xl">
                <Car className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="text-2xl font-black tracking-tighter">EcoRide</span>
            </div>
            <h1 className="text-4xl font-black mb-6 leading-tight">
              India's Greenest Way to Commute.
            </h1>
            <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
              Join 50,000+ Indians reducing traffic and pollution every day.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                <span className="text-sm font-medium">Verified Community Members</span>
              </div>
              <div className="flex items-center gap-3">
                <Leaf className="h-5 w-5 text-emerald-300" />
                <span className="text-sm font-medium">Personal Carbon Tracking</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 pt-10">
            <p className="text-xs text-emerald-200">© 2024 EcoRide India. Built for sustainable cities.</p>
          </div>

          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-emerald-400 rounded-full blur-2xl opacity-30"></div>
        </div>

        {/* Form Side */}
        <div className="md:w-1/2 p-12">
          <div className="max-w-sm mx-auto">
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p className="text-gray-500 mb-8 font-medium">
              {isLogin ? 'Log in to manage your rides' : 'Create an account for eco-friendly rides'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Arjun Mehta"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium text-black"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium text-black"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100 animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-gray-200 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
                {!loading && <ArrowRight className="h-5 w-5" />}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-bold text-emerald-600 hover:underline"
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
