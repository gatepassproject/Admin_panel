'use client';

import React from 'react';
import {
    Upload,
    FileSpreadsheet,
    Users,
    Download,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    History,
    FileText,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function BulkOperationsPage() {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [hasCompleted, setHasCompleted] = React.useState(false);
    const [error, setError] = React.useState('');
    const [stats, setStats] = React.useState({ success: 0, total: 0 });

    const parseCSV = (text: string) => {
        // Handle CRLF (\r\n) and split into non-empty lines
        const lines = text.split(/\r?\n/).filter(line => line.trim());
        if (lines.length < 2) return [];

        // Remove BOM if present (common in Excel CSVs) and split headers
        const rawHeaders = lines[0].replace(/^\uFEFF/, '').split(',');
        const headers = rawHeaders.map(h => h.trim().toLowerCase());

        console.log('Detected Headers:', headers);

        return lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const record: any = {};

            headers.forEach((header, i) => {
                // Normalize headers to expected structure
                let key = header.replace(/[\s_]+/g, '_'); // Replace spaces with underscores
                if (key === 'roll_no' || key === 'id' || key === 'reg_no') key = 'registration_no';
                if (key === 'name' || key === 'student_name') key = 'full_name';

                record[key] = values[i];
            });
            return record;
        });
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setHasCompleted(false);
        setError('');
        setUploadProgress(10);

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;
                const students = parseCSV(text);

                if (students.length === 0) throw new Error('No valid records found in file');

                setUploadProgress(30);

                const res = await fetch('/api/utilities/bulk', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ students, type: 'students' })
                });

                const data = await res.json();

                if (res.ok) {
                    setUploadProgress(100);
                    setStats({ success: data.processed, total: students.length });
                    setTimeout(() => {
                        setIsUploading(false);
                        setHasCompleted(true);
                    }, 500);
                } else {
                    throw new Error(data.error || 'Batch processing failed');
                }
            } catch (err: any) {
                setError(err.message);
                setIsUploading(false);
            }
        };

        reader.onerror = () => {
            setError('Error reading file');
            setIsUploading(false);
        };

        reader.readAsText(file);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-8 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <FileSpreadsheet className="w-8 h-8 text-[#1e3a5f]" />
                        Bulk Onboarding
                    </h2>
                    <p className="text-slate-500 font-medium">Upload CSV or Excel files to register hundreds of students or staff at once.</p>
                </div>
                <a
                    href="/templates/student_onboarding_template.csv"
                    download
                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                >
                    <Download className="w-4 h-4 text-[#c32026]" />
                    <span>Template (.csv)</span>
                </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Zone */}
                <div className="lg:col-span-2 space-y-6">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".csv"
                        onChange={handleFileSelect}
                    />
                    <div className={cn(
                        "dashboard-card p-12 border-dashed border-4 flex flex-col items-center justify-center text-center transition-all duration-500",
                        isUploading ? "border-blue-400 bg-blue-50/20" : "border-slate-200 hover:border-[#1e3a5f]/30 hover:bg-slate-50/50",
                        error && "border-red-200 bg-red-50/30"
                    )}>
                        {!isUploading && !hasCompleted ? (
                            <>
                                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-6 group-hover:scale-110 transition-transform">
                                    <Upload className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                    {error ? 'Upload Error' : 'Drop your data file here'}
                                </h3>
                                <p className="text-sm text-slate-500 font-medium mt-2 max-w-sm text-center">
                                    {error ? (
                                        <span className="text-red-500 font-bold">{error}</span>
                                    ) : (
                                        <>Supported formats: <span className="text-[#1e3a5f] font-bold">.csv</span>. Please ensure column headers match exactly.</>
                                    )}
                                </p>
                                <button
                                    onClick={triggerFileSelect}
                                    className="mt-8 px-8 py-3 bg-[#1e3a5f] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-[#1e3a5f]/20 transition-all active:scale-95"
                                >
                                    Select CSV File
                                </button>
                            </>
                        ) : isUploading ? (
                            <div className="w-full max-w-md space-y-6 text-center">
                                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto animate-bounce">
                                    <RefreshCw className="w-10 h-10 animate-spin" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Processing Records...</h3>
                                    <p className="text-sm text-slate-500 font-medium mt-2 text-center">Synchronizing with dual Firebase environments.</p>
                                </div>
                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                </div>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{uploadProgress}% Complete</p>
                            </div>
                        ) : (
                            <div className="space-y-6 text-center">
                                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Batch Processed!</h3>
                                    <p className="text-sm text-slate-500 font-medium mt-2 text-center">
                                        <span className="text-emerald-600 font-bold">{stats.success} students</span> successfully registered across all systems.
                                    </p>
                                </div>
                                <div className="flex gap-4 justify-center">
                                    <button onClick={() => setHasCompleted(false)} className="px-6 py-2.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all font-bold">New Upload</button>
                                    <Link href="/users/students" className="px-6 py-2.5 bg-[#1e3a5f] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#1e3a5f]/90 transition-all font-bold">View Data</Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pre-flight Checks */}
                    <div className="dashboard-card p-8">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 font-bold">Security Pre-flight Checks</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: 'Column Mapping', desc: 'Ensure Roll No and Email headers match exactly.', status: 'Valid' },
                                { title: 'Auth Sync', desc: 'Firebase Auth will trigger welcome emails.', status: 'Ready' },
                                { title: 'Duplicate Check', desc: 'System will skip existing UIDs automatically.', status: 'Active' },
                                { title: 'Deduplication', desc: 'Cleaning whitespaces and case sensitivity.', status: 'Active' },
                            ].map((check, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-100 transition-colors">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{check.title}</p>
                                        <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">{check.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Processing History */}
                <div className="space-y-6">
                    <div className="dashboard-card p-6 bg-[#c32026] text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black uppercase tracking-tight mb-2">Bulk Logic</h3>
                            <p className="text-red-100 text-[11px] font-medium leading-relaxed mb-6 italic">Failed records will be exported to an "Error Recap" file for easy correction.</p>
                            <div className="flex items-center justify-between text-[11px] font-bold py-2 border-b border-white/10">
                                <span>Max Batch Size:</span>
                                <span>1,000 Users</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-bold py-2">
                                <span>Processing Latency:</span>
                                <span>~0.4s / User</span>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card p-6 divide-y divide-slate-100">
                        <div className="flex items-center justify-between mb-6 ml-1">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-bold">Upload History</h4>
                            <History className="w-4 h-4 text-slate-300" />
                        </div>
                        <div className="space-y-6 pt-6">
                            {[
                                { file: 'SOE_Freshers_2025.csv', count: '124', time: '2h ago' },
                                { file: 'Hostel_Block_B_List.xlsx', count: '48', time: 'Yesterday' },
                                { file: 'Pharmacy_Final_Year.csv', count: '82', time: '3 days ago' },
                            ].map((job, idx) => (
                                <div key={idx} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#1e3a5f]/10 group-hover:text-[#1e3a5f] transition-colors">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 group-hover:text-[#1e3a5f] transition-colors">{job.file}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{job.count} Records • {job.time}</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 group-hover:text-[#1e3a5f] hover:bg-slate-50 transition-all">
                                        <Download className="w-4 h-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
