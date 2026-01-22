'use client';

import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderProps {
    title: string;
    module?: string;
}

export default function Placeholder({ title, module }: PlaceholderProps) {
    return (
        <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-6 page-transition">
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center animate-bounce">
                <Construction className="w-10 h-10" />
            </div>
            <div>
                {module && <p className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-2">{module}</p>}
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
                <p className="text-slate-500 max-w-sm mx-auto mt-4 font-medium">
                    We're still building this module. It will be available in the next phase of the implementation.
                </p>
            </div>
            <div className="flex gap-4">
                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                    Go Back
                </button>
                <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                    Documentation
                </button>
            </div>
        </div>
    );
}
