'use client';

import React from 'react';
import {
    ClipboardList,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Clock,
    MoreHorizontal,
    Eye,
    MessageSquare,
    RefreshCw,
    AlertCircle,
    Calendar,
    ChevronDown,
    ArrowUpDown
} from 'lucide-react';
import { cn, formatPassTime } from '@/lib/utils';
import PassDetailsModal from '@/components/PassDetailsModal';

export default function PassPage() {
    const [passes, setPasses] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filterStatus, setFilterStatus] = React.useState('All');
    const [isUpdating, setIsUpdating] = React.useState<string | null>(null);
    const [selectedPass, setSelectedPass] = React.useState<any>(null);
    const [pagination, setPagination] = React.useState({
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 1,
        hasMore: false
    });

    const fetchPasses = async (page = pagination.page) => {
        try {
            setIsLoading(true);
            const statusParam = filterStatus !== 'All' ? `&status=${filterStatus}` : '';
            const url = `/api/passes?page=${page}&limit=${pagination.limit}${statusParam}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch passes');
            const data = await response.json();

            // Handle both legacy array and new paginated object
            if (data.data && data.pagination) {
                setPasses(data.data);
                setPagination(data.pagination);
            } else {
                setPasses(Array.isArray(data) ? data : []);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchPasses(newPage);
        }
    };

    React.useEffect(() => {
        fetchPasses(1); // Reset to page 1 when filter changes

        // Auto-refresh every 30 seconds for "Live" data
        const interval = setInterval(() => fetchPasses(pagination.page), 30000);
        return () => clearInterval(interval);
    }, [filterStatus]);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            setIsUpdating(id);
            const response = await fetch('/api/passes', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus, remarks: `Status updated by admin at ${new Date().toLocaleTimeString()}` })
            });
            if (!response.ok) throw new Error('Update failed');

            // Local update for immediate feedback
            setPasses(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsUpdating(null);
        }
    };

    const filteredPasses = passes.filter(pass => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            (pass.full_name || '').toLowerCase().includes(search) ||
            (pass.student_name || '').toLowerCase().includes(search) ||
            (pass.visitor_name || '').toLowerCase().includes(search) ||
            (pass.faculty_name || '').toLowerCase().includes(search) ||
            (pass.student_id || '').toLowerCase().includes(search) ||
            (pass.visitor_id || '').toLowerCase().includes(search) ||
            (pass.purpose || '').toLowerCase().includes(search) ||
            (pass.reason || '').toLowerCase().includes(search);
        return matchesSearch;
    });

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-xl font-bold">Error loading passes</h3>
                <p className="text-slate-500">{error}</p>
                <button onClick={() => fetchPasses()} className="mt-4 px-6 py-2 bg-[#1e3a5f] text-white rounded-xl font-bold">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-6 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <ClipboardList className="w-8 h-8 text-[#c32026]" />
                        Gate Pass Management
                    </h2>
                    <p className="text-slate-500 font-medium">Manage and review student exit/entry requests.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchPasses()}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                        title="Refresh List"
                    >
                        <RefreshCw className={cn("w-5 h-5 text-slate-500", isLoading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="dashboard-card p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by student name, ID or reason..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] outline-none transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border",
                                    filterStatus === status
                                        ? "bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-lg shadow-[#1e3a5f]/20"
                                        : "bg-white border-slate-200 text-slate-500 hover:border-[#1e3a5f] hover:text-[#1e3a5f]"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="dashboard-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Information</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason & Type</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timing</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Approval Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                [1, 2, 3].map((i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8 h-20 bg-slate-50/20"></td>
                                    </tr>
                                ))
                            ) : filteredPasses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                <ClipboardList className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No passes found</p>
                                            {passes.length > 0 && (
                                                <p className="text-[9px] text-slate-300 font-medium">
                                                    ({passes.length} total records found, but hidden by search/filter)
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPasses.map((pass) => {
                                    // Dynamic name resolution
                                    const displayName = pass.full_name || pass.student_name || pass.visitor_name || pass.faculty_name || 'Unnamed';

                                    // Display ID resolution
                                    const displayId = pass.student_id || pass.visitor_id || '---';

                                    // Purpose/Reason resolution
                                    const displayReason = pass.purpose || pass.reason || 'No reason specified';

                                    // Time formatting helper
                                    const outTime = formatPassTime(pass.exit_time || pass.start_time || pass.date);
                                    const inTime = formatPassTime(pass.in_time || pass.end_time || pass.expected_return_time || pass.actual_return_time);

                                    return (
                                        <tr key={pass.id} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-lg shadow-inner">
                                                        {displayName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 group-hover:text-[#1e3a5f] transition-colors">{displayName}</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{displayId}</p>
                                                        <p className="text-[10px] font-bold text-[#c32026] mt-0.5">{pass.department}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <span className="px-2 py-0.5 bg-blue-50 text-[#1e3a5f] text-[9px] font-black uppercase rounded border border-blue-100">
                                                        {pass.pass_type || 'Local Outing'}
                                                    </span>
                                                    <p className="text-xs font-medium text-slate-600 line-clamp-1">{displayReason}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-700">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3 h-3 text-emerald-500" />
                                                        <span>{outTime}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 opacity-50">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{inTime}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={cn(
                                                    "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border",
                                                    (pass.status?.toLowerCase() === 'pending' || pass.status?.toLowerCase() === 'active') ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                        (pass.status?.toLowerCase() === 'approved' || pass.status?.toLowerCase() === 'completed') ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                            pass.status?.toLowerCase() === 'exit' ? "bg-orange-50 text-orange-600 border-orange-100" :
                                                                "bg-red-50 text-red-600 border-red-100"
                                                )}>
                                                    {pass.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {pass.status === 'Pending' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleUpdateStatus(pass.id, 'Approved')}
                                                            disabled={!!isUpdating}
                                                            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 disabled:opacity-50"
                                                            title="Approve Pass"
                                                        >
                                                            {isUpdating === pass.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(pass.id, 'Rejected')}
                                                            disabled={!!isUpdating}
                                                            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100 disabled:opacity-50"
                                                            title="Reject Pass"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setSelectedPass(pass)}
                                                        className="p-2 text-slate-400 hover:text-[#1e3a5f] transition-colors"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1 || isLoading}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={!pagination.hasMore || isLoading}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            <PassDetailsModal
                isOpen={!!selectedPass}
                onClose={() => setSelectedPass(null)}
                pass={selectedPass}
            />
        </div>
    );
}
