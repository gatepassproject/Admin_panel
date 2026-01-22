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
import { cn } from '@/lib/utils';

const pendingPasses = [
    {
        id: 'PASS-7821',
        student: 'Rahul Kumar',
        studentId: 'CS2023089',
        type: 'Out-Station',
        purpose: 'Visiting home for weekend',
        requestDate: '2 hours ago',
        fromDate: '2026-01-23 04:00 PM',
        toDate: '2026-01-25 08:00 PM',
        priority: 'Normal',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul'
    },
    {
        id: 'PASS-7845',
        student: 'Priya Sharma',
        studentId: 'CS2023045',
        type: 'Local Outing',
        purpose: 'Urgent medical checkup at City Clinic',
        requestDate: '45 mins ago',
        fromDate: '2026-01-22 02:00 PM',
        toDate: '2026-01-22 06:00 PM',
        priority: 'Urgent',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
    },
    {
        id: 'PASS-7850',
        student: 'Amit Verma',
        studentId: 'ME2023012',
        type: 'Hostel Leave',
        purpose: 'Sister\'s wedding ceremony',
        requestDate: '15 mins ago',
        fromDate: '2026-01-24 08:00 AM',
        toDate: '2026-01-28 10:00 AM',
        priority: 'Normal',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit'
    }
];

export default function ApprovalQueuePage() {
    return (
        <div className="space-y-6 page-transition">
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
                    <span className="text-xs font-black uppercase tracking-widest">{pendingPasses.length} Requests Pending</span>
                </div>
            </div>

            {/* Stats Cards for Queue */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="dashboard-card p-4 bg-blue-600 text-white">
                    <div className="flex items-center justify-between opacity-80 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest">Urgent Requests</p>
                        <AlertTriangle className="w-4 h-4" />
                    </div>
                    <h3 className="text-2xl font-black">1</h3>
                    <p className="text-[10px] mt-1 font-medium opacity-70 italic whitespace-nowrap overflow-hidden">Requires immediate attention</p>
                </div>
                <div className="dashboard-card p-4">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest">Avg Response Time</p>
                        <Clock className="w-4 h-4" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">18 min</h3>
                    <p className="text-[10px] mt-1 font-bold text-emerald-500 uppercase tracking-tighter">Faster than yesterday</p>
                </div>
                <div className="dashboard-card p-4">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest">Batch Actions</p>
                        <Filter className="w-4 h-4" />
                    </div>
                    <div className="flex gap-2 mt-1">
                        <button className="flex-1 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-100 transition-all">Approve All</button>
                        <button className="flex-1 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-100 transition-all">Export CSV</button>
                    </div>
                </div>
            </div>

            {/* Queue List */}
            <div className="space-y-4">
                {pendingPasses.map((pass) => (
                    <div key={pass.id} className="dashboard-card p-6 group hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Student Info */}
                            <div className="flex items-center gap-4 lg:w-1/4">
                                <div className="relative">
                                    <img src={pass.photo} alt={pass.student} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50 shadow-sm" />
                                    <div className={cn(
                                        "absolute -top-1 -right-1 px-2 py-0.5 rounded-lg border-2 border-white text-[8px] font-black uppercase tracking-widest shadow-sm",
                                        pass.priority === 'Urgent' ? 'bg-red-500 text-white' : 'bg-slate-500 text-white'
                                    )}>
                                        {pass.priority}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{pass.student}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{pass.studentId}</p>
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1 bg-blue-50 px-2 py-0.5 rounded-full inline-block">{pass.type}</p>
                                </div>
                            </div>

                            {/* Pass Details */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Purpose</p>
                                            <p className="text-xs font-bold text-slate-700">{pass.purpose}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Requested</p>
                                            <p className="text-xs font-bold text-slate-600 italic">{pass.requestDate}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Departure</p>
                                            <p className="text-xs font-bold text-slate-700">{pass.fromDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Return</p>
                                            <p className="text-xs font-bold text-slate-700">{pass.toDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row lg:flex-col justify-center gap-2 lg:w-48">
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 transition-all">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Approve
                                </button>
                                <div className="flex gap-2 flex-1">
                                    <button className="flex-1 flex items-center justify-center p-3 bg-white border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all" title="Reject">
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                    <button className="flex-1 flex items-center justify-center p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="View Details">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center pt-4">
                <button className="px-6 py-2 bg-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all">Load More Requests</button>
            </div>
        </div>
    );
}
