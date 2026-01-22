'use client';

import React from 'react';
import {
    FileText,
    Plus,
    Search,
    Edit2,
    Copy,
    Trash2,
    Eye,
    MessageSquare,
    Mail,
    Bell,
    CheckCircle2,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PassTemplatesPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('All');

    const templates = [
        {
            id: 1,
            title: 'Pass Approval SMS',
            description: 'Sent to students when their pass is approved by HOD.',
            type: 'SMS',
            category: 'Approval',
            lastModified: '2 days ago',
            content: 'Dear {student_name}, your Gate Pass for {reason} has been APPROVED. Valid until {in_time}. - CT Group'
        },
        {
            id: 2,
            title: 'Parental Consent Request',
            description: 'Email sent to parents to authorize an overnight stay.',
            type: 'Email',
            category: 'Security',
            lastModified: '1 week ago',
            content: 'Hello {parent_name}, your ward {student_name} has requested an overnight stay...'
        },
        {
            id: 3,
            title: 'Late Entry Warning',
            description: 'Internal notification for security when student is late.',
            type: 'Push',
            category: 'Alert',
            lastModified: '3 hours ago',
            content: 'ALERT: Student {student_id} ({student_name}) has exceeded the arrival buffer time...'
        },
        {
            id: 4,
            title: 'Pass Rejection Notice',
            description: 'Notification for rejected pass requests.',
            type: 'Push',
            category: 'Approval',
            lastModified: '5 days ago',
            content: 'Your pass request for {date} was rejected. Reason: {rejection_reason}.'
        }
    ];

    const filteredTemplates = templates.filter(t =>
        (t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedCategory === 'All' || t.category === selectedCategory)
    );

    return (
        <div className="space-y-6 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <FileText className="w-8 h-8 text-[#c32026]" />
                        Communication Templates
                    </h2>
                    <p className="text-slate-500 font-medium">Customize automated messages for SMS, Email, and Push Notifications.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#c32026] hover:bg-[#c32026]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#c32026]/20 transition-all">
                    <Plus className="w-4 h-4" />
                    <span>Create Template</span>
                </button>
            </div>

            {/* Filters */}
            <div className="dashboard-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative group flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#c32026] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search templates by title or content..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-[#c32026]/5 focus:border-[#c32026] focus:bg-white transition-all outline-none font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                    {['All', 'Approval', 'Security', 'Alert'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                                selectedCategory === cat
                                    ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                                    : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTemplates.map(template => (
                    <div key={template.id} className="dashboard-card p-6 flex flex-col group hover:border-[#c32026]/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                                    template.type === 'SMS' && "bg-blue-50 text-blue-600",
                                    template.type === 'Email' && "bg-purple-50 text-purple-600",
                                    template.type === 'Push' && "bg-orange-50 text-orange-600"
                                )}>
                                    {template.type === 'SMS' && <MessageSquare className="w-5 h-5" />}
                                    {template.type === 'Email' && <Mail className="w-5 h-5" />}
                                    {template.type === 'Push' && <Bell className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 leading-tight group-hover:text-[#c32026] transition-colors">
                                        {template.title}
                                    </h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                                        {template.category} • {template.type}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 rounded-lg transition-all">
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-50/50 rounded-xl p-4 border border-slate-100 relative overflow-hidden mb-4">
                            <p className="text-xs text-slate-600 font-medium leading-relaxed italic line-clamp-3">
                                "{template.content}"
                            </p>
                            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-0.5 bg-white border border-slate-100 rounded-md text-[9px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                Smart Variables
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-[10px] text-slate-400 font-medium">Modified {template.lastModified}</span>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-[#c32026] transition-colors">
                                    <Copy className="w-3 h-3" />
                                    <span>Duplicate</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-[10px] font-black text-[#c32026] uppercase tracking-widest px-3 py-1 bg-[#c32026]/5 rounded-lg hover:bg-[#c32026]/10 transition-colors">
                                    <Eye className="w-3 h-3" />
                                    <span>Preview</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create New Item Placeholder */}
                <button className="dashboard-card p-6 border-dashed border-2 border-slate-200 bg-slate-50/30 flex flex-col items-center justify-center gap-3 group hover:border-[#c32026]/50 hover:bg-[#c32026]/5 transition-all min-h-[220px]">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:border-[#c32026] group-hover:text-[#c32026] transition-all">
                        <Plus className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-slate-400 group-hover:text-[#c32026]">Add New Template</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">Or import from system library</p>
                    </div>
                </button>
            </div>

            {/* Sidebar Hint/Analytics */}
            <div className="dashboard-card p-6 bg-slate-900 text-white mt-12 overflow-hidden relative group">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <h3 className="text-lg font-black uppercase tracking-tight mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            Dynamic Variable Support
                        </h3>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">
                            Your templates support 24+ dynamic variables including <span className="text-white font-bold">{"{student_name}"}</span>, <span className="text-white font-bold">{"{in_time}"}</span>, and <span className="text-white font-bold">{"{otp_code}"}</span>. These are populated in real-time by the Firebase engine.
                        </p>
                    </div>
                    <div className="flex flex-col items-center px-8 border-l border-white/10">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Weekly Volume</p>
                        <h4 className="text-3xl font-black tracking-tighter text-white">4,284</h4>
                        <p className="text-[9px] font-black text-emerald-400 uppercase tracking-tight mt-1 animate-pulse">99.9% Delivered</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
