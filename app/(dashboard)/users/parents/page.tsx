'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import {
    Users,
    Search,
    Plus,
    Trash2,
    Heart,
    Mail,
    Phone,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit2,
    Link2,
    ExternalLink,
    Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useUserDashboard } from '@/lib/hooks/useUserDashboard';
import { ViewUserModal } from '@/components/ViewUserModal';

export default function ParentsPage() {
    const {
        users: parents,
        isLoading,
        project,
        setProject,
        selectedUser,
        isViewModalOpen,
        setIsViewModalOpen,
        handleDelete,
        handleView
    } = useUserDashboard('parent');

    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedRelation, setSelectedRelation] = React.useState('All');

    const filteredParents = parents.filter(p =>
        (p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedRelation === 'All' || p.relation === selectedRelation)
    );

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
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                        <Database className="w-4 h-4 text-slate-400" />
                        <select
                            className="bg-transparent text-xs font-black uppercase tracking-widest text-slate-700 outline-none cursor-pointer"
                            value={project}
                            onChange={(e) => setProject(e.target.value as '1' | '2')}
                        >
                            <option value="1">GatePass (DB1)</option>
                            <option value="2">IoT System (DB2)</option>
                        </select>
                    </div>
                    <Link
                        href={`/users/parents/add?project=${project}`}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#c32026] hover:bg-[#a61a20] text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-500/20 transition-all font-black"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Register Parent</span>
                    </Link>
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
                            className="bg-transparent border-none text-xs font-black text-slate-700 outline-none cursor-pointer"
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
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">#</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Guardian Info</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Student</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse h-24 bg-slate-50/20"><td colSpan={5}></td></tr>
                                ))
                            ) : filteredParents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                        No guardian records found
                                    </td>
                                </tr>
                            ) : (
                                filteredParents.map((p, idx) => (
                                    <tr key={p.uid} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-center text-xs font-bold text-slate-400">
                                            {idx + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-red-50 text-[#c32026] rounded-xl flex items-center justify-center font-black text-lg shadow-inner">
                                                    {p.full_name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-[#c32026] transition-colors">{p.full_name}</p>
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
                                                <button
                                                    onClick={() => handleView(p)}
                                                    className="p-2.5 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 rounded-xl transition-all"
                                                    title="View Profile"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/users/parents/add?uid=${p.uid}&project=${project}`}
                                                    className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                    title="Edit Record"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(p.uid)}
                                                    className="p-2.5 text-slate-400 hover:text-[#c32026] hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete record"
                                                >
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
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Total Records: {filteredParents.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-[#1e3a5f] hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 disabled:opacity-50">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-[#1e3a5f] hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 disabled:opacity-50">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <ViewUserModal
                user={selectedUser}
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
            />
        </div>
    );
}
