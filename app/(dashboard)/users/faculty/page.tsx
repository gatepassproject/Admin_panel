'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import {
    Users,
    Search,
    Plus,
    Download,
    Upload,
    Filter,
    MoreHorizontal,
    Trash2,
    Briefcase,
    Mail,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit2,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FacultyPage() {
    const [faculty, setFaculty] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedDept, setSelectedDept] = React.useState('All');
    const [selectedStatus, setSelectedStatus] = React.useState('All');

    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [newFaculty, setNewFaculty] = React.useState({
        full_name: '',
        email: '',
        password: 'FacultyPassword123!',
        faculty_id: '',
        dept: 'CS',
        designation: 'Professor',
        role: 'faculty'
    });

    const fetchFaculty = async () => {
        try {
            setIsLoading(true);
            const url = selectedDept === 'All'
                ? '/api/users?role=faculty,hod,principal'
                : `/api/users?role=faculty,hod,principal&dept=${selectedDept}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch faculty');
            const data = await response.json();
            setFaculty(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchFaculty();
    }, [selectedDept]);

    const filteredFaculty = faculty.filter(f =>
        (f.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.uid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedStatus === 'All' || f.status === selectedStatus)
    );

    const handleAddFaculty = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFaculty)
            });
            if (!response.ok) throw new Error('Failed to add faculty');
            setIsAddModalOpen(false);
            fetchFaculty();
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
                        <ShieldCheck className="w-8 h-8 text-[#1e3a5f]" />
                        Faculty Management
                    </h2>
                    <p className="text-slate-500 font-medium">Manage academic staff and department heads access control.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                        <Upload className="w-4 h-4" />
                        <span>Bulk Import</span>
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#1e3a5f]/20 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Faculty</span>
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="dashboard-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative group flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1e3a5f] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search faculty by name or ID..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] focus:bg-white transition-all outline-none font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 min-w-[140px]">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dept:</span>
                        <select
                            className="bg-transparent border-none text-xs font-black text-slate-700 outline-none w-full"
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                        >
                            <option>All</option>
                            <option>CS</option>
                            <option>ME</option>
                            <option>EC</option>
                            <option>CE</option>
                        </select>
                    </div>
                    <button className="p-2 bg-slate-100 text-[#1e3a5f] rounded-xl hover:bg-slate-200 transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="dashboard-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4">
                                    <input type="checkbox" className="rounded-md border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]" />
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty Member</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department & Role</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Logs</th>
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
                            ) : filteredFaculty.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                <Briefcase className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No faculty records found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredFaculty.map((f) => (
                                    <tr key={f.id || f.uid} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <input type="checkbox" className="rounded-md border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#1e3a5f]/5 rounded-xl flex items-center justify-center text-[#1e3a5f] font-black text-lg shadow-inner">
                                                    {f.full_name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-[#1e3a5f] transition-colors">{f.full_name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{f.faculty_id || f.uid?.slice(0, 8)}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 font-medium">
                                                        <Mail className="w-3 h-3 text-[#c32026]" />
                                                        {f.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-[#1e3a5f]">{f.dept || 'CS'}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{f.designation || 'Professor'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="text-center">
                                                    <p className="text-sm font-black text-slate-700">124</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase">Entries</p>
                                                </div>
                                                <div className="w-px h-8 bg-slate-100" />
                                                <div className="text-center">
                                                    <p className="text-sm font-black text-emerald-600">0</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase">Violations</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border",
                                                f.status === 'Outside'
                                                    ? "bg-amber-50 text-amber-600 border-amber-100"
                                                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            )}>
                                                {f.status || 'Inside'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button className="p-2.5 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 rounded-xl transition-all" title="View Profile">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Edit Faculty">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2.5 text-slate-400 hover:text-[#c32026] hover:bg-red-50 rounded-xl transition-all" title="Delete record">
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

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Total Staff: <span className="text-slate-900">{filteredFaculty.length}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex gap-1">
                            <button className="w-8 h-8 text-[11px] font-black rounded-xl transition-all bg-[#1e3a5f] text-white shadow-lg shadow-[#1e3a5f]/20">1</button>
                        </div>
                        <button className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50" disabled>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Faculty Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-10 bg-[#1e3a5f] text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black uppercase tracking-widest">Faculty Entry</h3>
                                <p className="text-blue-200 text-xs font-bold mt-1 uppercase tracking-widest opacity-80">New Staff Registration</p>
                            </div>
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        </div>
                        <form onSubmit={handleAddFaculty} className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Staff Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter full name"
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-bold placeholder:text-slate-300"
                                    value={newFaculty.full_name}
                                    onChange={e => setNewFaculty({ ...newFaculty, full_name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Staff / ID Code</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="EMP-100X"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-bold placeholder:text-slate-300"
                                        value={newFaculty.faculty_id}
                                        onChange={e => setNewFaculty({ ...newFaculty, faculty_id: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Department</label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-black text-slate-700"
                                        value={newFaculty.dept}
                                        onChange={e => setNewFaculty({ ...newFaculty, dept: e.target.value })}
                                    >
                                        <option>CS</option>
                                        <option>ME</option>
                                        <option>EC</option>
                                        <option>CE</option>
                                        <option>IT</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Designation</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="E.g. Asst. Professor"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-bold placeholder:text-slate-300"
                                        value={newFaculty.designation}
                                        onChange={e => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Role</label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-black text-slate-700"
                                        value={newFaculty.role}
                                        onChange={e => setNewFaculty({ ...newFaculty, role: e.target.value })}
                                    >
                                        <option value="faculty">Faculty</option>
                                        <option value="hod">Dept. Head (HOD)</option>
                                        <option value="principal">Principal</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Official Email</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="staff@ctgroup.in"
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-bold placeholder:text-slate-300"
                                    value={newFaculty.email}
                                    onChange={e => setNewFaculty({ ...newFaculty, email: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-4 border-2 border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all"
                                >
                                    Dismiss
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-3 py-4 bg-[#c32026] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#a61a20] transition-all shadow-xl shadow-red-500/20 disabled:opacity-50"
                                >
                                    {isLoading ? 'Wait...' : 'Confirm Registration'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
