'use client';

import React from 'react';
import {
    Shield,
    Search,
    Plus,
    Upload,
    Filter,
    Trash2,
    Briefcase,
    Mail,
    Phone,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit2,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SecurityStaffPage() {
    const [staff, setStaff] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedShift, setSelectedShift] = React.useState('All');
    const [selectedStatus, setSelectedStatus] = React.useState('All');

    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [newStaff, setNewStaff] = React.useState({
        full_name: '',
        email: '',
        password: 'SecurityPassword123!',
        badge_id: '',
        phone: '',
        shift: 'Day',
        role: 'security'
    });

    const fetchStaff = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/users?role=security');
            if (!response.ok) throw new Error('Failed to fetch security staff');
            const data = await response.json();
            setStaff(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchStaff();
    }, []);

    const filteredStaff = staff.filter(s =>
        (s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.badge_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedShift === 'All' || s.shift === selectedShift) &&
        (selectedStatus === 'All' || s.status === selectedStatus)
    );

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStaff)
            });
            if (!response.ok) throw new Error('Failed to add security staff');
            setIsAddModalOpen(false);
            fetchStaff();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Shield className="w-8 h-8 text-[#1e3a5f]" />
                        Security Personnel
                    </h2>
                    <p className="text-slate-500 font-medium">Manage campus security guards, supervisors, and shift assignments.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                        <Upload className="w-4 h-4" />
                        <span>Import Data</span>
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#1e3a5f]/20 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Register Guard</span>
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="dashboard-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative group flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1e3a5f] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search guards by name or Badge ID..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] focus:bg-white transition-all outline-none font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 min-w-[140px]">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shift:</span>
                        <select
                            className="bg-transparent border-none text-xs font-black text-slate-700 outline-none w-full"
                            value={selectedShift}
                            onChange={(e) => setSelectedShift(e.target.value)}
                        >
                            <option>All</option>
                            <option>Day</option>
                            <option>Night</option>
                            <option>Evening</option>
                        </select>
                    </div>
                    <button className="p-2 bg-slate-100 text-[#1e3a5f] rounded-xl hover:bg-slate-200 transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content Container */}
            <div className="dashboard-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4">
                                    <input type="checkbox" className="rounded-md border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]" />
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Personnel</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Duty Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-8 h-20 bg-slate-50/20"></td>
                                    </tr>
                                ))
                            ) : filteredStaff.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                <Shield className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No security records found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredStaff.map((s) => (
                                    <tr key={s.id || s.uid} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <input type="checkbox" className="rounded-md border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-inner">
                                                    {s.full_name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-[#1e3a5f] transition-colors">{s.full_name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ID: {s.badge_id || 'SEC-00' + s.uid?.slice(0, 4)}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 font-medium">
                                                        <Mail className="w-3 h-3 text-[#c32026]" />
                                                        {s.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-[#1e3a5f] flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {s.shift || 'Day'} Shift
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {s.phone || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="text-center">
                                                    <p className="text-sm font-black text-slate-700">98%</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase">On-Time</p>
                                                </div>
                                                <div className="w-px h-8 bg-slate-100" />
                                                <div className="text-center">
                                                    <p className="text-sm font-black text-emerald-600">24</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase">Verifications</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border",
                                                s.status === 'Offline'
                                                    ? "bg-slate-50 text-slate-400 border-slate-100"
                                                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            )}>
                                                {s.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button className="p-2.5 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 rounded-xl transition-all">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2.5 text-slate-400 hover:text-[#c32026] hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Active Guards: <span className="text-slate-900">{filteredStaff.length}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 transition-all opacity-50 cursor-not-allowed">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 text-[11px] font-black rounded-xl transition-all bg-[#1e3a5f] text-white">1</button>
                        <button className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 transition-all opacity-50 cursor-not-allowed">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border-t-8 border-[#1e3a5f]">
                        <div className="p-8 bg-slate-50 border-b border-slate-100">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Personnel Onboarding</h3>
                            <p className="text-slate-500 text-xs font-bold mt-1">Register new security guard or supervisor.</p>
                        </div>
                        <form onSubmit={handleAddStaff} className="p-8 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Identity Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter full name"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-bold"
                                    value={newStaff.full_name}
                                    onChange={e => setNewStaff({ ...newStaff, full_name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Badge ID</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="SEC-001"
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-bold"
                                        value={newStaff.badge_id}
                                        onChange={e => setNewStaff({ ...newStaff, badge_id: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Shift</label>
                                    <select
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-black text-slate-700"
                                        value={newStaff.shift}
                                        onChange={e => setNewStaff({ ...newStaff, shift: e.target.value })}
                                    >
                                        <option>Day</option>
                                        <option>Night</option>
                                        <option>Evening</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Emergency Phone</label>
                                <input
                                    required
                                    type="tel"
                                    placeholder="+91 XXXXX XXXXX"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-bold"
                                    value={newStaff.phone}
                                    onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="security@ctgroup.in"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-bold"
                                    value={newStaff.email}
                                    onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-3 text-slate-400 text-xs font-black uppercase tracking-widest rounded-2xl border-2 border-slate-100 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-2 py-3 bg-[#1e3a5f] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[#1e3a5f]/90 transition-all shadow-lg shadow-[#1e3a5f]/20 disabled:opacity-50"
                                >
                                    {isLoading ? 'Processing...' : 'Verify & Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
