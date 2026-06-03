'use client';

import React, { useEffect, useState } from 'react';
import {
    Activity,
    Cpu,
    Thermometer,
    MemoryStick as Memory,
    Signal,
    DoorOpen,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    LogOut,
    LogIn,
    Map,
    ShieldAlert,
    Zap,
    HardDrive,
    User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

const healthHistory = [
    { time: '12:00', cpu: 23, temp: 45, mem: 42 },
    { time: '12:05', cpu: 34, temp: 46, mem: 42 },
    { time: '12:10', cpu: 28, temp: 47, mem: 43 },
    { time: '12:15', cpu: 56, temp: 52, mem: 45 },
    { time: '12:20', cpu: 42, temp: 50, mem: 44 },
    { time: '12:25', cpu: 38, temp: 48, mem: 44 },
];

export default function RealTimeMonitorPage() {
    const [gates, setGates] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const fetchData = async () => {
        try {
            const [gatesRes, logsRes] = await Promise.all([
                fetch('/api/gates'),
                fetch('/api/logs?limit=5')
            ]);
            
            if (gatesRes.ok) {
                const gatesData = await gatesRes.json();
                setGates(gatesData);
            }
            if (logsRes.ok) {
                const logsData = await logsRes.json();
                setLogs(logsData.logs || []);
            }
            setLastRefresh(new Date());
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // 10s refresh
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6 page-transition">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Activity className="w-8 h-8 text-emerald-500" />
                        Real-time Monitoring
                    </h2>
                    <p className="text-slate-500 font-medium">Live IoT hardware status and gate activity stream.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">System Live</span>
                    </div>
                    <button onClick={fetchData} className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                        <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Column: Stats & Health */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Quick Hardware Health */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="dashboard-card p-6 bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <Cpu className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg CPU Load</p>
                                    <h3 className="text-2xl font-black text-slate-900">34.2%</h3>
                                    <div className="w-24 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[34%]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard-card p-6 bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                                    <Thermometer className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Temp</p>
                                    <h3 className="text-2xl font-black text-slate-900">48°C</h3>
                                    <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Normal Range</p>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard-card p-6 bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                                    <Memory className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RAM Usage</p>
                                    <h3 className="text-2xl font-black text-slate-900">1.2/4GB</h3>
                                    <div className="w-24 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-purple-500 w-[30%]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Chart */}
                    <div className="dashboard-card p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Hardware Performance History</h3>
                                <p className="text-xs text-slate-500 font-medium">Last 30 minutes of system telemetry</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">CPU</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">Temp</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={healthHistory}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey="cpu" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Gate Layout Map Simulation */}
                    <div className="dashboard-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 text-balance">Gate Connectivity Map</h3>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                    <span className="text-[10px] font-bold text-slate-400">Stable</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                    <span className="text-[10px] font-bold text-slate-400">Unstable</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {gates.length > 0 ? gates.map((gate, idx) => {
                                const isOffline = gate.status === 'Offline' || gate.status === 'error';
                                return (
                                <div key={gate.id || idx} className={cn(
                                    "p-6 rounded-3xl border transition-all duration-300 group relative overflow-hidden",
                                    isOffline ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100 hover:border-blue-200"
                                )}>
                                    <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                                        <Signal className={cn(
                                            "w-8 h-8",
                                            isOffline ? "text-red-500" : "text-blue-500"
                                        )} />
                                        <div>
                                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{gate.name || `Gate 0${idx + 1}`}</h4>
                                            <p className="text-[10px] font-medium text-slate-500 line-clamp-1">{gate.location || 'Entrance'}</p>
                                        </div>
                                        <div className={cn(
                                            "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                                            isOffline ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
                                        )}>
                                            {isOffline ? 'Offline' : gate.status || 'Online'}
                                        </div>
                                    </div>
                                    <div className="absolute top-[-10%] right-[-10%] w-20 h-20 opacity-[0.05] group-hover:scale-125 transition-transform">
                                        <Zap className="w-full h-full" />
                                    </div>
                                </div>
                            )}) : (
                                <div className="col-span-full text-center py-8 text-slate-500">No gates found or loading...</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Live Activity Feed */}
                <div className="lg:col-span-1 border-l border-slate-200 pl-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Live Activity</h3>
                        <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">LIVE</span>
                    </div>

                    <div className="space-y-6">
                        {logs.length > 0 ? logs.map((item) => {
                            const isAlert = item.status === 'Denied' || item.status === 'Rejected';
                            const type = isAlert ? 'alert' : (item.type?.toLowerCase() === 'exit' ? 'exit' : 'entry');

                            return (
                            <div key={item.id} className="relative pl-6 pb-6 border-l border-slate-100 last:border-0 last:pb-0">
                                {/* Connector Dot */}
                                <div className={cn(
                                    "absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-white ring-4 ring-slate-50",
                                    type === 'entry' && "bg-emerald-500",
                                    type === 'exit' && "bg-blue-500",
                                    type === 'alert' && "bg-red-500"
                                )} />

                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.time}</span>
                                        {type === 'entry' ? (
                                            <div className="flex items-center gap-1 text-[8px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-widest border border-emerald-100">
                                                <LogIn className="w-2.5 h-2.5" />
                                                Entry
                                            </div>
                                        ) : type === 'exit' ? (
                                            <div className="flex items-center gap-1 text-[8px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-widest border border-blue-100">
                                                <LogOut className="w-2.5 h-2.5" />
                                                Exit
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-[8px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-widest border border-red-100">
                                                <ShieldAlert className="w-2.5 h-2.5" />
                                                Alert
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm group hover:border-blue-200 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-900 truncate tracking-tight">{item.user}</p>
                                                <p className="text-[10px] text-slate-500 font-medium truncate">{item.gate}</p>
                                            </div>
                                        </div>
                                        {type === 'alert' && (
                                            <div className="mt-2 text-[10px] font-bold text-red-500 bg-red-50/50 p-1.5 rounded-lg border border-red-100/50">
                                                Status: {item.status}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}) : (
                            <div className="text-center py-4 text-slate-500 text-sm">No recent activity</div>
                        )}
                    </div>

                    <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-400 hover:text-blue-500 transition-all">
                        View Historical Logs
                    </button>
                </div>
            </div>
        </div>
    );
}
