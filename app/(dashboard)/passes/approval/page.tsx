'use client';

import React from 'react';
import {
    ClipboardCheck,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    Filter,
    Search,
    MoreVertical,
    Calendar,
    User,
    MessageSquare,
    AlertTriangle,
    Zap
} from 'lucide-react';
import { cn, formatPassTime } from '@/lib/utils';
import PassDetailsModal from '@/components/PassDetailsModal';

// Mock data removed in favor of live Firestore records

export default function ApprovalQueuePage() {
    const [passes, setPasses] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isUpdating, setIsUpdating] = React.useState<string | null>(null);
    const [selectedPass, setSelectedPass] = React.useState<any>(null);

    const fetchPendingPasses = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/passes?status=Pending');
            if (!response.ok) throw new Error('Failed to fetch pending passes');
            const data = await response.json();
            setPasses(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPendingPasses();

        // 30-second auto-refresh for "Live" inbox experience
        const interval = setInterval(fetchPendingPasses, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            setIsUpdating(id);
            const response = await fetch('/api/passes', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus, remarks: `Processed by admin at ${new Date().toLocaleTimeString()}` })
            });
            if (!response.ok) throw new Error('Update failed');

            // Remove from queue locally
            setPasses(prev => prev.filter(p => p.id !== id));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsUpdating(null);
        }
    };


    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold">Error loading queue</h3>
                <p className="text-slate-500">{error}</p>
                <button onClick={fetchPendingPasses} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">Retry</button>
            </div>
        );
    }

    const filteredPasses = passes.filter(pass => {
        const search = searchTerm.toLowerCase();
        return (
            (pass.full_name || '').toLowerCase().includes(search) ||
            (pass.student_name || '').toLowerCase().includes(search) ||
            (pass.visitor_name || '').toLowerCase().includes(search) ||
            (pass.student_id || '').toLowerCase().includes(search) ||
            (pass.visitor_id || '').toLowerCase().includes(search) ||
            (pass.reason || '').toLowerCase().includes(search) ||
            (pass.purpose || '').toLowerCase().includes(search)
        );
    });

    return (
        <div className="space-y-6 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <ClipboardCheck className="w-8 h-8 text-blue-600" />
                        Pass Approval Queue
                    </h2>
                    <p className="text-slate-500 font-medium">Review and process pending gate pass requests.</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">{passes.length} Requests Pending</span>
                </div>
            </div>

            {/* Stats Cards for Queue */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="dashboard-card p-4 bg-blue-600 text-white shadow-xl shadow-blue-500/20">
                    <div className="flex items-center justify-between opacity-80 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest">Action Required</p>
                        <AlertTriangle className="w-4 h-4" />
                    </div>
                    <h3 className="text-2xl font-black">{passes.length}</h3>
                    <p className="text-[10px] mt-1 font-medium opacity-70 italic whitespace-nowrap overflow-hidden">Pending review</p>
                </div>
                <div className="dashboard-card p-4">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest">Institutional Privacy</p>
                        <User className="w-4 h-4" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Active</h3>
                    <p className="text-[10px] mt-1 font-bold text-emerald-500 uppercase tracking-tighter">Isolation mode on</p>
                </div>
                <div className="dashboard-card p-4">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest">Queue Status</p>
                        <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-2 mt-1">
                        <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", isLoading ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
                            <span className="text-[10px] font-bold text-slate-500 uppercase">{isLoading ? "Refreshing..." : "Live Updates Active"}</span>
                        </div>
                        <button onClick={fetchPendingPasses} className="w-full py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                            <Zap className={cn("w-3 h-3", isLoading && "animate-spin")} />
                            Manual Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Search */}
            <div className="dashboard-card p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Quick search in queue (name, ID, reason)..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Queue List */}
            <div className="space-y-4">
                {isLoading && passes.length === 0 ? (
                    [1, 2].map(i => (
                        <div key={i} className="dashboard-card p-6 animate-pulse bg-slate-50/50 h-40"></div>
                    ))
                ) : filteredPasses.length === 0 ? (
                    <div className="dashboard-card p-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                {passes.length > 0 ? "No search results" : "Queue is Empty"}
                            </h4>
                            <p className="text-slate-500 font-medium">
                                {passes.length > 0 ? "Try adjusting your search terms." : "All student requests have been processed."}
                            </p>
                        </div>
                    </div>
                ) : (
                    filteredPasses.map((pass) => {
                        const displayName = pass.full_name || pass.student_name || pass.visitor_name || pass.faculty_name || 'Unnamed';
                        const displayId = pass.student_id || pass.visitor_id || '---';
                        const displayReason = pass.purpose || pass.reason || 'No reason specified';
                        const outTime = formatPassTime(pass.exit_time || pass.start_time || pass.date);
                        const inTime = formatPassTime(pass.in_time || pass.end_time || pass.expected_return_time);

                        return (
                            <div key={pass.id} className="dashboard-card p-6 group hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 border-l-4 border-l-blue-500">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Student Info */}
                                    <div className="flex items-center gap-4 lg:w-1/4">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-[#1e3a5f] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                                                {displayName[0]}
                                            </div>
                                            <div className="absolute -top-1 -right-1 px-2 py-0.5 rounded-lg border-2 border-white text-[8px] font-black uppercase tracking-widest shadow-sm bg-blue-500 text-white">
                                                {pass.pass_type || 'OUTING'}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{displayName}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{displayId}</p>
                                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1 bg-blue-50 px-2 py-0.5 rounded-full inline-block truncate max-w-[150px]">{pass.department}</p>
                                        </div>
                                    </div>

                                    {/* Pass Details */}
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Purpose</p>
                                                    <p className="text-xs font-bold text-slate-700">{displayReason}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Requested</p>
                                                    <p className="text-xs font-bold text-slate-600 italic">{formatPassTime(pass.created_at)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Departure</p>
                                                    <p className="text-xs font-bold text-slate-700">{outTime}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Return</p>
                                                    <p className="text-xs font-bold text-slate-700">{inTime}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-row lg:flex-col justify-center gap-2 lg:w-48">
                                        <button
                                            onClick={() => handleUpdateStatus(pass.id, 'Approved')}
                                            disabled={!!isUpdating}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                                        >
                                            {isUpdating === pass.id ? <Zap className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                            Approve
                                        </button>
                                        <div className="flex gap-2 flex-1">
                                            <button
                                                onClick={() => handleUpdateStatus(pass.id, 'Rejected')}
                                                disabled={!!isUpdating}
                                                className="flex-1 flex items-center justify-center p-3 bg-white border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all disabled:opacity-50" title="Reject"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => setSelectedPass(pass)}
                                                className="flex-1 flex items-center justify-center p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="View Details"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination Placeholder */}
            {passes.length > 0 && (
                <div className="flex justify-center pt-4">
                    <button className="px-6 py-2 bg-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all">End of Queue</button>
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
