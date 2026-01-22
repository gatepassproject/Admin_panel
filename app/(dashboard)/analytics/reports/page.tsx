'use client';

import React from 'react';
import {
    FileText,
    Calendar,
    Filter,
    Download,
    FileSpreadsheet,
    FileCode,
    CheckCircle2,
    RefreshCw,
    Search,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReportsGeneratorPage() {
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [selectedType, setSelectedType] = React.useState('Mobility Audit');
    const [selectedFormat, setSelectedFormat] = React.useState('PDF');

    const reportTypes = [
        { id: 1, name: 'Mobility Audit', description: 'Full history of entries/exits with duration analysis.', icon: FileText },
        { id: 2, name: 'Attendance Report', description: 'Monthly summary of student presence based on gate logs.', icon: CheckCircle2 },
        { id: 3, name: 'Security Breach Log', description: 'List of unauthorized attempts and hardware alerts.', icon: Filter },
        { id: 4, name: 'Faculty Movement', description: 'Staff-specific gate activity for payroll/compliance.', icon: Search },
    ];

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            alert('Report generated and downloaded successfully.');
        }, 2000);
    };

    return (
        <div className="space-y-8 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <FileText className="w-8 h-8 text-[#1e3a5f]" />
                        Reports Generator
                    </h2>
                    <p className="text-slate-500 font-medium">Export raw data and synthesized summaries for documentation.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="dashboard-card p-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Configure Document</h3>
                            <p className="text-sm text-slate-500 font-medium">Set the parameters for your generated report.</p>
                        </div>

                        <div className="space-y-6">
                            {/* Report Type Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reportTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(type.name)}
                                        className={cn(
                                            "flex items-start gap-4 p-5 rounded-3xl border-2 transition-all text-left",
                                            selectedType === type.name
                                                ? "bg-[#1e3a5f]/5 border-[#1e3a5f] shadow-lg shadow-[#1e3a5f]/5"
                                                : "bg-white border-slate-100 hover:border-slate-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                            selectedType === type.name ? "bg-[#1e3a5f] text-white" : "bg-slate-50 text-slate-400"
                                        )}>
                                            <type.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className={cn(
                                                "text-sm font-black uppercase tracking-tight",
                                                selectedType === type.name ? "text-[#1e3a5f]" : "text-slate-900"
                                            )}>{type.name}</p>
                                            <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">{type.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        Date Range
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                                            Oct 01, 2025
                                        </div>
                                        <span className="text-slate-300 font-black">-</span>
                                        <div className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                                            Oct 31, 2025
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                        <Search className="w-3 h-3" />
                                        Filtering Scope
                                    </label>
                                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-[#1e3a5f]/5">
                                        <option>All Departments</option>
                                        <option>Engineering (SOE)</option>
                                        <option>Management (SIBM)</option>
                                        <option>Computer App (SCA)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {['PDF', 'CSV', 'JSON'].map((format) => (
                                    <button
                                        key={format}
                                        onClick={() => setSelectedFormat(format)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                            selectedFormat === format
                                                ? "bg-slate-900 text-white border-slate-900"
                                                : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        {format === 'PDF' && <FileText className="w-3 h-3" />}
                                        {format === 'CSV' && <FileSpreadsheet className="w-3 h-3" />}
                                        {format === 'JSON' && <FileCode className="w-3 h-3" />}
                                        {format}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="flex items-center gap-3 px-8 py-3 bg-[#c32026] hover:bg-[#c32026]/90 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-[#c32026]/20 transition-all disabled:opacity-50"
                            >
                                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                <span>Compile & Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-6">
                    <div className="dashboard-card p-6 bg-[#1e3a5f] text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black uppercase tracking-tight mb-2">Automated Digests</h3>
                            <p className="text-blue-100 text-[11px] font-medium leading-relaxed mb-6">Schedule weekly reports to be sent directly to department HOD emails.</p>
                            <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                Setup Scheduler
                            </button>
                        </div>
                        <FileText className="absolute -right-8 -bottom-8 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    <div className="dashboard-card p-6 divide-y divide-slate-100">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Recent Generators</h4>
                        <div className="space-y-4 pt-4">
                            {[
                                { name: 'Full_Audit_Oct.pdf', user: 'Admin', time: '2h ago' },
                                { name: 'Attendance_Week42.csv', user: 'System', time: 'Yesterday' },
                                { name: 'Security_Log_Emergency.pdf', user: 'Security', time: '2 days ago' },
                            ].map((report, idx) => (
                                <div key={idx} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#c32026]/10 group-hover:text-[#c32026] transition-colors">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-900 group-hover:text-[#c32026] transition-colors">{report.name}</p>
                                            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">By {report.user} • {report.time}</p>
                                        </div>
                                    </div>
                                    <Download className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#c32026]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
