'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import {
    Search,
    Plus,
    Users,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Database,
    Mail,
    Briefcase,
    Edit2,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useUserDashboard } from '@/lib/hooks/useUserDashboard';
import { ViewUserModal } from '@/components/ViewUserModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';

export default function FacultyPage() {
    const { user: currentUser } = useCurrentUser();
    const [searchTerm, setSearchTerm] = React.useState('');


    const {
        users: faculty,
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
        userToDelete
    } = useUserDashboard('faculty', '1');

    const filteredFaculty = faculty.filter(f => {
        const search = searchTerm.toLowerCase();
        return !search ||
            (f.full_name?.toLowerCase() || '').includes(search) ||
            (f.uid?.toLowerCase() || '').includes(search) ||
            (f.email?.toLowerCase() || '').includes(search);
    });

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
                    <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm ring-1 ring-[#c32026]/5">
                        <Database className="w-4 h-4 text-[#c32026]" />
                        <span className="text-xs font-black uppercase tracking-widest text-[#c32026]">
                            Mobile Apps (GatePass DB)
                        </span>
                    </div>
                    <Link
                        href={`/users/faculty/add?project=${project}`}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#1e3a5f]/20 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Faculty</span>
                    </Link>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="dashboard-card p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="relative group flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1e3a5f] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, email or ID..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] focus:bg-white transition-all outline-none font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">

                </div>
            </div>

            {/* Content Table */}
            <div className="dashboard-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">#</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Position</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-8 h-24 bg-slate-50/20"></td>
                                    </tr>
                                ))
                            ) : filteredFaculty.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                        No faculty members found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredFaculty.map((member, idx) => (
                                    <tr key={member.uid} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-center text-xs font-bold text-slate-400">
                                            {idx + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#1e3a5f]/5 rounded-xl flex items-center justify-center text-[#1e3a5f] font-black text-lg shadow-inner">
                                                    {member.full_name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-[#1e3a5f] transition-colors">{member.full_name}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 font-medium">
                                                        <Mail className="w-3 h-3 text-[#c32026]" />
                                                        {member.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-[#1e3a5f]">{member.designation || 'Professor'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                                                {member.dept || member.department}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border",
                                                member.status === 'Outside'
                                                    ? "bg-amber-50 text-amber-600 border-amber-100"
                                                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            )}>
                                                {member.status || 'Inside'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleView(member)}
                                                    className="p-2.5 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 rounded-xl transition-all"
                                                    title="View Profile"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/users/faculty/add?uid=${member.uid}&project=${project}`}
                                                    className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                    title="Edit Faculty"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(member.uid)}
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
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Total Records: {filteredFaculty.length}
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
