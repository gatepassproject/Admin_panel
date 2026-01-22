'use client';

import React from 'react';
import {
    HelpCircle,
    Search,
    BookOpen,
    MessageSquare,
    Phone,
    FileText,
    ExternalLink,
    ChevronRight,
    Youtube,
    MessageCircle,
    ArrowUpRight,
    LifeBuoy,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HelpCenterPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [openFaq, setOpenFaq] = React.useState<number | null>(null);

    const faqs = [
        {
            q: 'How do I reset a student RFID card?',
            a: 'Go to User Management > Students, select the student, and click "Reset RFID". The system will prompt for the new card ID.',
            cat: 'Hardware'
        },
        {
            q: 'Can I set custom buffer times for hostels?',
            a: 'Yes, in Policy Settings > Hostel Rules, you can define buffer periods for entry and exit notifications.',
            cat: 'Policies'
        },
        {
            q: 'How to export monthly attendance to Excel?',
            a: 'Navigate to Reports > Analytics, select the date range, and use the "Export as XLSX" button in the top right.',
            cat: 'Reports'
        },
        {
            q: 'What to do if a gate device goes offline?',
            a: 'Check the IoT Status dashboard. If red, verify the power supply and local network connectivity before restarting.',
            cat: 'Security'
        },
    ];

    const systemStatus = [
        { label: 'Cloud API', status: 'online', time: '2ms' },
        { label: 'IoT Gateway', status: 'online', time: '14ms' },
        { label: 'Auth Service', status: 'online', time: '8ms' },
    ];

    return (
        <div className="space-y-10 page-transition pb-20 max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] p-12 text-white shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 backdrop-blur-md border border-white/10">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Support Status: Live
                    </div>
                    <h2 className="text-5xl font-black tracking-tight mb-6 leading-tight">Professional Support & Documentation</h2>
                    <p className="text-blue-200 text-lg font-medium mb-10 opacity-90">Access specialized technical guides, system manuals, and direct contact with the internal IT Cell for the Gate Pass ecosystem.</p>

                    <div className="relative group max-w-xl">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-300 group-focus-within:text-[#c32026] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search documentation, FAQS, or policies..."
                            className="w-full pl-16 pr-6 py-6 bg-white border-2 border-transparent rounded-[28px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#c32026] focus:ring-8 focus:ring-[#c32026]/5 transition-all text-lg font-bold shadow-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="mt-8 flex items-center gap-4">
                        <span className="text-xs font-black uppercase tracking-widest text-blue-300/60">Trending:</span>
                        {['RFID Reset', 'HOD Approval', 'Night Curfew'].map((tag) => (
                            <button key={tag} className="text-[11px] font-bold px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all">
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
                    <HelpCircle className="w-full h-full -rotate-12 translate-x-1/4" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Knowledge Base */}
                <div className="lg:col-span-3 space-y-10">
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                <BookOpen className="w-8 h-8 text-[#c32026]" />
                                Documentation Hub
                            </h3>
                            <button className="text-[11px] font-black text-[#1e3a5f] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                View Full Archive <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: 'User Manual', desc: 'Step-by-step operations for security staff and admins.', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', update: '2 days ago' },
                                { title: 'Hardware Hub', desc: 'Configuring IoT gate controllers and RFID scanners.', icon: LifeBuoy, color: 'text-emerald-600', bg: 'bg-emerald-50', update: '1 week ago' },
                                { title: 'Policy System', desc: 'Rules for auto-approvals, curfews, and hostel entry.', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50', update: 'Updated' },
                                { title: 'Video Guides', desc: 'Visual walkthroughs of critical management workflows.', icon: Youtube, color: 'text-red-600', bg: 'bg-red-50', update: 'New' },
                            ].map((topic, idx) => (
                                <div key={idx} className="dashboard-card p-8 group hover:translate-y-[-6px] hover:shadow-2xl transition-all border-slate-100 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm", topic.bg, topic.color)}>
                                            <topic.icon className="w-7 h-7" />
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{topic.title}</h4>
                                            <span className="text-[9px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-full">{topic.update}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{topic.desc}</p>
                                        <button className="flex items-center gap-2 text-xs font-black text-[#1e3a5f] uppercase tracking-widest group-hover:text-[#c32026] transition-all">
                                            Open Resource <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                        <topic.icon className="w-32 h-32 rotate-12" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-card p-10 bg-white">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                            <div>
                                <h4 className="text-[12px] font-black uppercase tracking-widest text-[#c32026] mb-2">Internal FAQ System</h4>
                                <p className="text-sm text-slate-500 font-medium">Quick answers for frequent operational queries.</p>
                            </div>
                            <div className="flex gap-2">
                                {['All', 'Hardware', 'Student', 'Staff'].map(cat => (
                                    <button key={cat} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all border border-slate-100">
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "rounded-2xl border transition-all duration-300",
                                        openFaq === idx ? "border-[#1e3a5f] bg-slate-50" : "border-slate-100 bg-white hover:border-[#1e3a5f]/30"
                                    )}
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-[#1e3a5f] uppercase tracking-widest mb-1 opacity-60">{faq.cat}</span>
                                            <p className="text-base font-bold text-slate-900">{faq.q}</p>
                                        </div>
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                            openFaq === idx ? "bg-[#1e3a5f] text-white rotate-180" : "bg-slate-100 text-slate-400"
                                        )}>
                                            <ChevronRight className="w-4 h-4 translate-x-0.5" />
                                        </div>
                                    </button>
                                    <div className={cn(
                                        "overflow-hidden transition-all duration-300 px-6",
                                        openFaq === idx ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
                                    )}>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium pl-0.5 border-l-2 border-[#c32026]">
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact & Status Sidebar */}
                <div className="space-y-6">
                    {/* System Health */}
                    <div className="dashboard-card p-6 bg-white border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Status</h4>
                            <div className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        </div>
                        <div className="space-y-5">
                            {systemStatus.map((item) => (
                                <div key={item.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.label}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Latency: {item.time}</p>
                                        </div>
                                    </div>
                                    <span className="text-[8px] font-black uppercase text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded-md">Live</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-card p-8 bg-slate-900 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black uppercase tracking-tight mb-2">Direct Support</h3>
                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-10">Our technical team at <span className="text-blue-400 font-bold">CT Group IT Cell</span> handles all infrastructure inquiries.</p>

                            <div className="space-y-4">
                                <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 hover:border-white/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <div className="text-left font-bold">
                                            <p className="text-xs text-white">IT Cell Helpdesk</p>
                                            <p className="text-[9px] text-emerald-400 uppercase tracking-tighter">Typical response: 15m</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-500" />
                                </button>

                                <button className="w-full flex items-center justify-between p-4 bg-red-600 rounded-2xl group hover:bg-red-700 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/20 text-white rounded-xl flex items-center justify-center">
                                            <AlertCircle className="w-5 h-5" />
                                        </div>
                                        <div className="text-left font-bold">
                                            <p className="text-xs text-white">Emergency Hotline</p>
                                            <p className="text-[9px] text-white/70 uppercase tracking-tighter">24/7 Gate Failover</p>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            <div className="mt-8 flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <Clock className="w-4 h-4 text-blue-400" />
                                <p className="text-[10px] text-slate-400 font-medium">Operating Hours: 09:00 - 18:00 IST</p>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card p-6 bg-[#1e3a5f] text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-300" />
                                </div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest">Latest Changelog</h4>
                            </div>
                            <div className="space-y-3 mb-6">
                                {[
                                    'Real-time IoT diagnostics',
                                    'Multi-HOD approval chains',
                                    'Global security patching'
                                ].map(change => (
                                    <div key={change} className="flex items-center gap-3 text-[10px] text-blue-100/70 font-medium tracking-tight">
                                        <div className="h-1 w-1 rounded-full bg-blue-400"></div>
                                        {change}
                                    </div>
                                ))}
                            </div>
                            <button className="w-full py-3 bg-white text-[#1e3a5f] hover:bg-blue-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg">
                                All Release Notes
                            </button>
                        </div>
                        <HelpCircle className="absolute -right-8 -bottom-8 w-32 h-32 text-white/5" />
                    </div>
                </div>
            </div>
        </div>
    );
}
