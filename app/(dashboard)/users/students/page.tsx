'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import {
    Search,
    Plus,
    Upload,
    GraduationCap,
    Mail,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Database,
    Edit2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useUserDashboard } from '@/lib/hooks/useUserDashboard';
import { ViewUserModal } from '@/components/ViewUserModal';

export default function StudentsPage() {
    const {
        users: students,
        isLoading,
        project,
        setProject,
        selectedUser,
        isViewModalOpen,
        setIsViewModalOpen,
        handleDelete,
        handleView
    } = useUserDashboard('student', '1'); // Force Project 1 (Mobile App DB)

    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedBranch, setSelectedBranch] = React.useState('All Branches');
    const [selectedYear, setSelectedYear] = React.useState('All Years');

    const filteredStudents = students.filter(s =>
        (s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.uid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.reg_no?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedBranch === 'All Branches' || s.branch === selectedBranch) &&
        (selectedYear === 'All Years' || s.year === selectedYear)
    );

    return (
        <div className="space-y-6 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <GraduationCap className="w-8 h-8 text-[#1e3a5f]" />
                        Student Directory
                    </h2>
                    <p className="text-slate-500 font-medium">Manage and monitor student records.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm ring-1 ring-[#c32026]/5">
                        <Database className="w-4 h-4 text-[#c32026]" />
                        <span className="text-xs font-black uppercase tracking-widest text-[#c32026]">
                            Mobile Apps (GatePass DB)
                        </span>
                    </div>
                    <Link
                        href="/utilities/bulk"
                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Upload className="w-4 h-4 text-[#c32026]" />
                        <span>Bulk Upload</span>
                    </Link>
                    <Link
                        href={`/users/students/add?project=1`}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#1e3a5f]/20 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Student</span>
                    </Link>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="dashboard-card p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="relative group flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1e3a5f] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, ID or Reg No..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] focus:bg-white transition-all outline-none font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 min-w-[140px]">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Branch:</span>
                        <select
                            className="bg-transparent border-none text-xs font-black text-slate-700 outline-none w-full cursor-pointer"
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                        >
                            <option>All Branches</option>
                            <option>CSE</option>
                            <option>ME</option>
                            <option>ECE</option>
                            <option>Civil</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 min-w-[120px]">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Year:</span>
                        <select
                            className="bg-transparent border-none text-xs font-black text-slate-700 outline-none w-full cursor-pointer"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            <option>All Years</option>
                            <option>1st Year</option>
                            <option>2nd Year</option>
                            <option>3rd Year</option>
                            <option>4th Year</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Table */}
            <div className="dashboard-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4">
                                    <input type="checkbox" className="rounded-md border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]" />
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student info</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
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
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                        No students found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id || student.uid} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <input type="checkbox" className="rounded-md border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#1e3a5f]/5 rounded-xl flex items-center justify-center text-[#1e3a5f] font-black text-lg shadow-inner">
                                                    {student.full_name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-[#1e3a5f] transition-colors">{student.full_name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{student.reg_no || student.uid?.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-[#1e3a5f]">{student.branch}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.year}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                    <Mail className="w-3 h-3 text-[#c32026]" />
                                                    {student.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border",
                                                student.status === 'Outside'
                                                    ? "bg-amber-50 text-amber-600 border-amber-100"
                                                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            )}>
                                                {student.status || 'Inside'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleView(student)}
                                                    className="p-2.5 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 rounded-xl transition-all"
                                                    title="View Profile"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/users/students/add?uid=${student.uid}&project=1`}
                                                    className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="Edit profile"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(student.uid)}
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
                        Showing {filteredStudents.length} of {students.length} students
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-[#1e3a5f] hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-[#1e3a5f] hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200">
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

