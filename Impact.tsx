
import React, { useEffect, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Leaf, Wind, Droplets, Zap, IndianRupee } from 'lucide-react';
import { backendService } from '../services/backendService';
import { ImpactStats } from '../types';

const DATA_DISTRIBUTION = [
  { name: 'Work Hubs', value: 550 },
  { name: 'Leisure/Shopping', value: 250 },
  { name: 'Airport Drops', value: 150 },
];

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7'];

const Impact = () => {
  const [stats, setStats] = useState<ImpactStats | null>(null);

  useEffect(() => {
    setStats(backendService.getStats());
  }, []);

  const chartData = [
    { name: 'Mon', co2: 4 },
    { name: 'Tue', co2: 12 },
    { name: 'Wed', co2: 18 },
    { name: 'Thu', co2: stats?.totalCarbonSaved || 25 },
    { name: 'Fri', co2: (stats?.totalCarbonSaved || 25) + 5 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900">Eco-Score Dashboard</h1>
        <p className="text-gray-500 font-medium">Tracking your real contribution to India's blue skies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-emerald-100 p-4 rounded-2xl"><Leaf className="h-6 w-6 text-emerald-600" /></div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase">Carbon Offset</p>
            <p className="text-2xl font-black text-gray-900">{stats?.totalCarbonSaved.toFixed(1) || 0} kg</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-4 rounded-2xl"><Wind className="h-6 w-6 text-blue-600" /></div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase">Traffic Avoided</p>
            <p className="text-2xl font-black text-gray-900">{((stats?.totalKmShared || 0) / 10).toFixed(0)} Hrs</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-amber-100 p-4 rounded-2xl"><Droplets className="h-6 w-6 text-amber-600" /></div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase">Fuel Saved</p>
            <p className="text-2xl font-black text-gray-900">{((stats?.totalKmShared || 0) / 12).toFixed(1)} L</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-purple-100 p-4 rounded-2xl"><IndianRupee className="h-6 w-6 text-purple-600" /></div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase">Cash Savings</p>
            <p className="text-2xl font-black text-gray-900">₹{stats?.totalMoneySaved.toLocaleString('en-IN') || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black mb-6 text-gray-900 uppercase tracking-tight">Weekly Emission Offset</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#065f46' }}
                />
                <Area type="monotone" dataKey="co2" stroke="#059669" strokeWidth={4} fillOpacity={1} fill="url(#colorCo2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black mb-6 text-gray-900 uppercase tracking-tight">Route Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DATA_DISTRIBUTION} innerRadius={70} outerRadius={110} paddingAngle={8} dataKey="value">
                  {DATA_DISTRIBUTION.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} cornerRadius={8} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
               {DATA_DISTRIBUTION.map((d, i) => (
                 <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{d.name}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact;
