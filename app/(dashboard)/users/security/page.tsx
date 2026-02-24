'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import {
    Shield,
    Search,
    Plus,
    Trash2,
    Mail,
    Phone,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit2,
    Clock,
    Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useUserDashboard } from '@/lib/hooks/useUserDashboard';
import { ViewUserModal } from '@/components/ViewUserModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { BulkUserUpload } from '@/components/users/BulkUserUpload';
export default function SecurityStaffPage() {
    const { user: currentUser } = useCurrentUser();
    const {
        users: staff,
        isLoading,
        project,
        setProject,
        selectedUser,
        isViewModalOpen,
        setIsViewModalOpen,
        handleDelete,
        handleView,
        // Deletion
        confirmDelete,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        isDeleting,
        userToDelete,
        refresh
    } = useUserDashboard('security', '1', currentUser?.department || undefined);

    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedShift, setSelectedShift] = React.useState('All');

    const filteredStaff = staff.filter(s => {
        const search = searchTerm.toLowerCase();
        const matchesSearch = !search ||
            (s.full_name?.toLowerCase() || '').includes(search) ||
            (s.badge_id?.toLowerCase() || '').includes(search) ||
            (s.email?.toLowerCase() || '').includes(search);

        const matchesShift = selectedShift === 'All' || (s.shift || '') === selectedShift;

        return matchesSearch && matchesShift;
    });

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
                    <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm ring-1 ring-[#c32026]/5">
                        <Database className="w-4 h-4 text-[#c32026]" />
                        <span className="text-xs font-black uppercase tracking-widest text-[#c32026]">
                            Mobile Apps (GatePass DB)
                        </span>
                    </div>
                    <BulkUserUpload
                        role="security"
                        project="1"
                        buttonLabel="Import Security CSV"
                        onImported={refresh}
                    />
                    <Link
                        href={`/users/security/add?project=${project}`}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#1e3a5f]/20 transition-all font-black"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Register Guard</span>
                    </Link>
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
                            className="bg-transparent border-none text-xs font-black text-slate-700 outline-none w-full cursor-pointer"
                            value={selectedShift}
                            onChange={(e) => setSelectedShift(e.target.value)}
                        >
                            <option>All</option>
                            <option>Day</option>
                            <option>Night</option>
                            <option>Evening</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="dashboard-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">#</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Personnel</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Duty Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse h-24 bg-slate-50/20"><td colSpan={6}></td></tr>
                                ))
                            ) : filteredStaff.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                        No security records found
                                    </td>
                                </tr>
                            ) : (
                                filteredStaff.map((s, idx) => (
                                    <tr key={s.uid} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-center text-xs font-bold text-slate-400">
                                            {idx + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-inner">
                                                    {s.full_name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-[#1e3a5f] transition-colors">{s.full_name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ID: {s.badge_id || 'SEC-' + s.uid?.slice(0, 4)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-[#1e3a5f] flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {s.shift || 'Day'} Shift
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                    {s.gate || 'Main Gate'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-600">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-[#1e3a5f]" /> {s.email}</div>
                                                <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-[#c32026]" /> {s.phone || 'N/A'}</div>
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
                                                <button
                                                    onClick={() => handleView(s)}
                                                    className="p-2.5 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 rounded-xl transition-all"
                                                    title="View Profile"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/users/security/add?uid=${s.uid}&project=${project}`}
                                                    className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                    title="Edit Record"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(s.uid)}
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

                {/* Footer Controls */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Total Records: {filteredStaff.length}
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

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                user={userToDelete}
            />
        </div>
    );
}
