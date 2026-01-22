'use client';

import React from 'react';
import {
    Users,
    Search,
    Plus,
    Upload,
    Filter,
    Trash2,
    Heart,
    Mail,
    Phone,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit2,
    Link2,
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ParentsPage() {
    const [parents, setParents] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedRelation, setSelectedRelation] = React.useState('All');

    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [newParent, setNewParent] = React.useState({
        full_name: '',
        email: '',
        password: 'ParentPassword123!',
        student_id: '',
        relation: 'Father',
        phone: '',
        role: 'parent'
    });

    const fetchParents = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/users?role=parent');
            if (!response.ok) throw new Error('Failed to fetch parents');
            const data = await response.json();
            setParents(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchParents();
    }, []);

    const filteredParents = parents.filter(p =>
        (p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedRelation === 'All' || p.relation === selectedRelation)
    );

    const handleAddParent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newParent)
            });
            if (!response.ok) throw new Error('Failed to register parent');
            setIsAddModalOpen(false);
            fetchParents();
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
                        <Heart className="w-8 h-8 text-[#c32026]" />
                        Guardian Management
                    </h2>
                    <p className="text-slate-500 font-medium">Manage parent accounts and their links to student profiles.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#1e3a5f]/20 transition-all"
                        onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="w-4 h-4" />
                        <span>Register Parent</span>
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="dashboard-card p-6 bg-blue-50/50 border-blue-100 flex items-center justify-between group">
                    <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Guardians</p>
                        <h4 className="text-3xl font-black text-[#1e3a5f] mt-1">{parents.length}</h4>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm transition-transform group-hover:scale-110">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
                <div className="dashboard-card p-6 bg-emerald-50/50 border-emerald-100 flex items-center justify-between group">
                    <div>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Linked Students</p>
                        <h4 className="text-3xl font-black text-emerald-600 mt-1">{parents.filter(p => p.student_id).length}</h4>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm transition-transform group-hover:scale-110">
                        <Link2 className="w-6 h-6" />
                    </div>
                </div>
                <div className="dashboard-card p-6 bg-red-50/50 border-red-100 flex items-center justify-between group">
                    <div>
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">App Adoption</p>
                        <h4 className="text-3xl font-black text-[#c32026] mt-1">84%</h4>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm transition-transform group-hover:scale-110">
                        <ExternalLink className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="dashboard-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative group flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1e3a5f] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by parent name or Student ID..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Relation:</span>
                        <select
                            className="bg-transparent border-none text-xs font-black text-slate-700 outline-none"
                            value={selectedRelation}
                            onChange={(e) => setSelectedRelation(e.target.value)}
                        >
                            <option>All</option>
                            <option>Father</option>
                            <option>Mother</option>
                            <option>Legal Guardian</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Guardian Info</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Student</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse h-20 bg-slate-50/20"><td colSpan={4}></td></tr>
                                ))
                            ) : filteredParents.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                <Heart className="w-8 h-8 text-slate-200" />
                                            </div>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No guardian records found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredParents.map((p) => (
                                    <tr key={p.id || p.uid} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-red-50 text-[#c32026] rounded-xl flex items-center justify-center font-black text-lg">
                                                    {p.full_name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{p.full_name}</p>
                                                    <span className="text-[10px] font-black text-red-500 uppercase bg-red-50 px-2 py-0.5 rounded-md mt-1 inline-block">{p.relation || 'Father'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-black text-[#1e3a5f] flex items-center gap-1.5">
                                                    <Link2 className="w-3 h-3" />
                                                    {p.student_id || 'Not Linked'}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Primary Student</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-600">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-[#1e3a5f]" /> {p.email}</div>
                                                <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-[#c32026]" /> {p.phone || '+91 98765 43210'}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button className="p-2.5 text-slate-400 hover:text-[#1e3a5f] transition-all"><Eye className="w-4 h-4" /></button>
                                                <button className="p-2.5 text-slate-400 hover:text-emerald-600 transition-all"><Edit2 className="w-4 h-4" /></button>
                                                <button className="p-2.5 text-slate-400 hover:text-[#c32026] transition-all"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Registration Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 bg-[#c32026] text-white">
                            <h3 className="text-xl font-black uppercase tracking-widest">Guardian Enrollment</h3>
                            <p className="text-red-100 text-[10px] font-bold mt-1 uppercase tracking-widest">Linking Secure Access for Families</p>
                        </div>
                        <form onSubmit={handleAddParent} className="p-8 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Guardian Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/5 focus:border-[#c32026] outline-none font-bold"
                                    value={newParent.full_name}
                                    onChange={e => setNewParent({ ...newParent, full_name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Student Roll ID</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/5 focus:border-[#c32026] outline-none font-bold"
                                        value={newParent.student_id}
                                        onChange={e => setNewParent({ ...newParent, student_id: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Relation</label>
                                    <select
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-slate-700"
                                        value={newParent.relation}
                                        onChange={e => setNewParent({ ...newParent, relation: e.target.value })}
                                    >
                                        <option>Father</option>
                                        <option>Mother</option>
                                        <option>Legal Guardian</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Guardian Phone No.</label>
                                <input
                                    required
                                    type="tel"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/5 focus:border-[#c32026] outline-none font-bold"
                                    value={newParent.phone}
                                    onChange={e => setNewParent({ ...newParent, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Account Email</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/5 focus:border-[#c32026] outline-none font-bold"
                                    value={newParent.email}
                                    onChange={e => setNewParent({ ...newParent, email: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border-2 border-slate-100 hover:bg-slate-50 transition-all font-black"
                                >
                                    Dismiss
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-2 py-4 bg-[#c32026] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#a61a20] transition-all shadow-xl shadow-red-500/20 disabled:opacity-50"
                                >
                                    {isLoading ? 'Sending...' : 'Register Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
