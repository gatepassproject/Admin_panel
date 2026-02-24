'use client';

import React from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

type BulkUserUploadProps = {
    role: string;
    project: '1' | '2';
    buttonLabel?: string;
    className?: string;
    onImported?: () => void;
};

type ImportResult = {
    processed: number;
    failed: number;
    total: number;
    message?: string;
    errors?: Array<{ row: number; error: string }>;
};

function parseCsvLine(line: string): string[] {
    const out: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
        const ch = line[i];
        const next = line[i + 1];

        if (ch === '"' && inQuotes && next === '"') {
            cur += '"';
            i += 1;
            continue;
        }
        if (ch === '"') {
            inQuotes = !inQuotes;
            continue;
        }
        if (ch === ',' && !inQuotes) {
            out.push(cur.trim());
            cur = '';
            continue;
        }
        cur += ch;
    }
    out.push(cur.trim());
    return out;
}

function parseCsv(text: string): Record<string, string>[] {
    const clean = text.replace(/^\uFEFF/, '').trim();
    if (!clean) return [];

    const lines = clean
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

    if (lines.length < 2) return [];

    const headers = parseCsvLine(lines[0]).map((h) => h.trim());
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i += 1) {
        const values = parseCsvLine(lines[i]);
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => {
            row[h] = (values[idx] || '').trim();
        });
        rows.push(row);
    }

    return rows;
}

export function BulkUserUpload({
    role,
    project,
    buttonLabel = 'Bulk Upload CSV',
    className,
    onImported,
}: BulkUserUploadProps) {
    const fileRef = React.useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const [result, setResult] = React.useState<ImportResult | null>(null);
    const [error, setError] = React.useState('');

    const getErrorMessage = (err: unknown): string => {
        if (err instanceof Error) return err.message;
        if (typeof err === 'string') return err;
        return 'Bulk upload failed';
    };

    const handlePickFile = () => {
        fileRef.current?.click();
    };

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setResult(null);
        setError('');
        setIsUploading(true);

        try {
            const text = await file.text();
            const rows = parseCsv(text);
            if (!rows.length) {
                throw new Error('CSV is empty or invalid');
            }

            const response = await fetch('/api/users/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role,
                    project,
                    rows,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Bulk import failed');
            }

            setResult(data);
            onImported?.();
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setIsUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    return (
        <div className="flex items-center gap-2">
            <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleFile}
            />
            <button
                type="button"
                onClick={handlePickFile}
                disabled={isUploading}
                className={className || 'flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all shadow-sm disabled:opacity-60'}
            >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-[#1e3a5f]" /> : <Upload className="w-4 h-4 text-[#c32026]" />}
                <span>{isUploading ? 'Uploading...' : buttonLabel}</span>
            </button>

            {result && (
                <div className="hidden xl:flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{result.processed}/{result.total} imported</span>
                </div>
            )}

            {error && (
                <div className="hidden xl:flex items-center gap-2 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 max-w-[320px] truncate">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="truncate">{error}</span>
                </div>
            )}
        </div>
    );
}
