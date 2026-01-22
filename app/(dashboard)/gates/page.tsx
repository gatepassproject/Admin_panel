'use client';

import React from 'react';
import {
    DoorOpen,
    Plus,
    RefreshCw,
    Settings,
    Activity,
    AlertTriangle,
    CheckCircle2,
    Wifi,
    WifiOff,
    MoreVertical,
    History,
    Cpu,
    Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function GatePage() {
    const [gates, setGates] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [newGate, setNewGate] = React.useState({
        id: '',
        name: '',
        location: 'Main Entry',
        status: 'Online'
    });

    const fetchGates = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/gates');
            if (!response.ok) throw new Error('Failed to fetch gates');
            const data = await response.json();
            setGates(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchGates();
        // Setup polling for live status
        const interval = setInterval(fetchGates, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleAddGate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await fetch('/api/gates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGate)
            });
            if (!response.ok) throw new Error('Failed to add gate');
            setIsAddModalOpen(false);
            fetchGates();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-xl font-bold">Hardware Connection Error</h3>
                <p className="text-slate-500">{error}</p>
                <button onClick={fetchGates} className="mt-4 px-6 py-2 bg-[#1e3a5f] text-white rounded-xl font-bold">Reconnect</button>
            </div>
        );
    }

    return (
        <div className="space-y-8 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <DoorOpen className="w-8 h-8 text-[#1e3a5f]" />
                        Gate & Device Management
                    </h2>
                    <p className="text-slate-500 font-medium">Real-time status monitoring for all campus entry points.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchGates} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm group">
                        <RefreshCw className={cn("w-5 h-5 text-slate-500 group-hover:text-[#1e3a5f] transition-colors", isLoading && "animate-spin")} />
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#1e3a5f]/20 transition-all font-inter"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Gate</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="dashboard-card p-6 border-l-4 border-l-emerald-500 bg-emerald-50/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <Wifi className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Devices</p>
                            <h3 className="text-2xl font-black text-slate-900">{gates.filter(g => g.status === 'Online' || g.status === 'OPEN').length} Online</h3>
                        </div>
                    </div>
                </div>
                <div className="dashboard-card p-6 border-l-4 border-l-[#c32026] bg-red-50/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 text-[#c32026] rounded-2xl flex items-center justify-center">
                            <WifiOff className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Down Nodes</p>
                            <h3 className="text-2xl font-black text-slate-900">{gates.filter(g => g.status === 'Offline' || g.status === 'CLOSED').length} Requiring Attention</h3>
                        </div>
                    </div>
                </div>
                <div className="dashboard-card p-6 border-l-4 border-l-[#fec20f] bg-amber-50/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 text-[#f6a100] rounded-2xl flex items-center justify-center">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Scans Today</p>
                            <h3 className="text-2xl font-black text-slate-900">842</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading && gates.length === 0 ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse"></div>
                    ))
                ) : gates.map((gate) => {
                    const isOnline = gate.status === 'Online' || gate.status === 'OPEN';
                    return (
                        <div key={gate.id} className={cn(
                            "dashboard-card p-8 group relative overflow-hidden transition-all duration-500",
                            !isOnline && "ring-2 ring-red-500/20 bg-red-50/5"
                        )}>
                            <div className="flex items-start justify-between relative z-10">
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500",
                                    isOnline ? "bg-[#1e3a5f] text-[#fec20f]" : "bg-[#c32026] text-white"
                                )}>
                                    <DoorOpen className="w-8 h-8" />
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={cn(
                                        "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5",
                                        isOnline ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"
                                    )}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full", isOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
                                        {isOnline ? 'Active' : 'Offline'}
                                    </span>
                                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                                        <Settings className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 relative z-10">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{gate.name || 'External Gate'}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Device ID: {gate.id}</p>

                                <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-slate-400 uppercase">Hardware</span>
                                        <span className="text-slate-700 flex items-center gap-1.5"><Cpu className="w-3 h-3" /> ESP32-Node</span>
                                    </div>
                                    <div className="flex flex-col gap-1 text-right">
                                        <span className="text-[10px] text-slate-400 uppercase">Last Sync</span>
                                        <span className="text-slate-700 font-black">{new Date(gate.last_active || gate.updated_at).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative background element */}
                            <div className={cn(
                                "absolute -right-8 -bottom-8 w-32 h-32 opacity-[0.03] transition-transform group-hover:scale-125 duration-700 font-black text-9xl pointer-events-none",
                                isOnline ? "text-[#1e3a5f]" : "text-[#c32026]"
                            )}>
                                {gate.id.slice(-1)}
                            </div>

                            {!isOnline && (
                                <div className="mt-6 pt-4 relative z-10">
                                    <button className="w-full py-3 bg-[#c32026] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#a61a20] transition-all shadow-lg shadow-red-500/20">
                                        Force Reconnect Node
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* System Logs */}
            <div className="dashboard-card p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <History className="w-5 h-5 text-[#1e3a5f]" />
                            Device Event Logs
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">Real-time system health and connectivity logs.</p>
                    </div>
                    <button className="text-xs font-bold text-[#1e3a5f] uppercase tracking-widest hover:underline">View All Logs</button>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#1e3a5f]/20 transition-all group">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                i === 2 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                            )}>
                                <Activity className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-900">
                                    {i === 2 ? 'Connection lost with Gate 3 - Backend' : 'Gate 1 processed successfully'}
                                </p>
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter mt-0.5">
                                    {i === 2 ? 'Node reported timeout after 3 retries' : 'RFID Scan - Student Access Point'}
                                </p>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase">2 mins ago</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Gate Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-10 bg-[#1e3a5f] text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black uppercase tracking-widest">Register Access Point</h3>
                                <p className="text-blue-200 text-xs font-bold mt-1 uppercase tracking-widest opacity-80">Connected Hardware Setup</p>
                            </div>
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        </div>
                        <form onSubmit={handleAddGate} className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Gate Identification Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g., Main Entrance North"
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-bold placeholder:text-slate-300"
                                    value={newGate.name}
                                    onChange={e => setNewGate({ ...newGate, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hardware ID / MAC</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="GATE-NODE-00X"
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-bold placeholder:text-slate-300"
                                    value={newGate.id}
                                    onChange={e => setNewGate({ ...newGate, id: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Location</label>
                                <select
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-black text-slate-700"
                                    value={newGate.location}
                                    onChange={e => setNewGate({ ...newGate, location: e.target.value })}
                                >
                                    <option>Main Entry</option>
                                    <option>Hostel Block A</option>
                                    <option>Hostel Block B</option>
                                    <option>Library Entry</option>
                                    <option>Back Gate</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-4 border-2 border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-3 py-4 bg-[#c32026] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#a61a20] transition-all shadow-xl shadow-red-500/20 disabled:opacity-50"
                                >
                                    {isLoading ? 'Connecting...' : 'Deploy Node'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
