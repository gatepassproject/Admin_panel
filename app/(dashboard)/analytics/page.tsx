'use client';

import React from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    DoorOpen,
    Clock,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Download
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { cn } from '@/lib/utils';

const trafficData = [
    { name: 'Mon', entries: 450, exits: 380 },
    { name: 'Tue', entries: 520, exits: 490 },
    { name: 'Wed', entries: 610, exits: 580 },
    { name: 'Thu', entries: 590, exits: 540 },
    { name: 'Fri', entries: 720, exits: 680 },
    { name: 'Sat', entries: 310, exits: 290 },
    { name: 'Sun', entries: 240, exits: 210 },
];

const peakHoursData = [
    { hour: '08:00', load: 85 },
    { hour: '10:00', load: 45 },
    { hour: '12:00', load: 65 },
    { hour: '14:00', load: 95 },
    { hour: '16:00', load: 75 },
    { hour: '18:00', load: 80 },
    { hour: '20:00', load: 40 },
];

const passTypeData = [
    { name: 'Local Outing', value: 65, color: '#1e3a5f' },
    { name: 'Night Stay', value: 20, color: '#c32026' },
    { name: 'Emergency', value: 10, color: '#fec20f' },
    { name: 'Official', value: 5, color: '#64748b' },
];

export default function AnalyticsOverviewPage() {
    return (
        <div className="space-y-8 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-[#1e3a5f]" />
                        Analytics Insights
                    </h2>
                    <p className="text-slate-500 font-medium">Deep-dive into campus mobility patterns and security metrics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                        <Calendar className="w-4 h-4" />
                        <span>Last 7 Days</span>
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#1e3a5f]/20 transition-all">
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Mobility', value: '12,482', trend: '+14%', up: true, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Unique Visitors', value: '4,102', trend: '+8%', up: true, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Gate Violations', value: '12', trend: '-24%', up: false, icon: DoorOpen, color: 'text-[#c32026]', bg: 'bg-red-50' },
                    { label: 'Avg Stay Time', value: '4.5h', trend: '+2%', up: true, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat, idx) => (
                    <div key={idx} className="dashboard-card p-6 group hover:translate-y-[-4px] transition-all duration-300">
                        <div className="flex items-start justify-between">
                            <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full",
                                stat.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                            )}>
                                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.trend}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Mobility Flow Chart */}
                <div className="lg:col-span-2 dashboard-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Mobility Flow</h3>
                            <p className="text-xs text-slate-500 font-medium tracking-tight">Daily Entry vs Exit volume distribution</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#1e3a5f]" />
                                <span className="text-[10px] font-black text-slate-400 uppercase">Entries</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#c32026]" />
                                <span className="text-[10px] font-black text-slate-400 uppercase">Exits</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorEntries" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#c32026" stopOpacity={0.05} />
                                        <stop offset="95%" stopColor="#c32026" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="entries" stroke="#1e3a5f" strokeWidth={3} fillOpacity={1} fill="url(#colorEntries)" />
                                <Area type="monotone" dataKey="exits" stroke="#c32026" strokeWidth={3} fillOpacity={1} fill="url(#colorExits)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pass Distribution Pie */}
                <div className="dashboard-card p-8">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-8">Pass Types</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={passTypeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {passTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-4">
                        {passTypeData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">{item.name}</span>
                                </div>
                                <span className="text-xs font-black text-slate-900">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Peak Hours Histogram */}
                <div className="dashboard-card p-8">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-8">Peak Load Hours</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={peakHoursData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                <YAxis hide />
                                <Bar dataKey="load" radius={[6, 6, 0, 0]} barSize={24}>
                                    {peakHoursData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.load > 80 ? '#c32026' : '#1e3a5f'} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Efficiency Metrics */}
                <div className="dashboard-card p-8 bg-slate-900 text-white relative overflow-hidden">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-tight mb-2">Efficiency Rating</h3>
                            <p className="text-slate-400 text-xs font-medium leading-relaxed">System performance based on auto-approval accuracy and hardware uptime.</p>
                        </div>
                        <div className="flex flex-col items-center py-6">
                            <h4 className="text-6xl font-black tracking-tighter text-[#fec20f]">98.2</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Scale: 0 - 100</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                            <div className="text-center">
                                <p className="text-[9px] font-black text-slate-500 uppercase">Latency</p>
                                <p className="text-sm font-black text-emerald-400">12ms</p>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="text-center">
                                <p className="text-[9px] font-black text-slate-500 uppercase">Uptime</p>
                                <p className="text-sm font-black text-emerald-400">99.9%</p>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="text-center">
                                <p className="text-[9px] font-black text-slate-500 uppercase">Errors</p>
                                <p className="text-sm font-black text-red-400">0.02%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
