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
    Sparkles,
    X,
    Loader2,
    AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Template {
    id: string;
    title: string;
    description: string;
    type: 'SMS' | 'Email' | 'Push';
    category: 'Approval' | 'Security' | 'Alert';
    content: string;
    updated_at: string;
}

export default function PassTemplatesPage() {
    const [templates, setTemplates] = React.useState<Template[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('All');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingTemplate, setEditingTemplate] = React.useState<Template | null>(null);
    const [isSaving, setIsSaving] = React.useState(false);

    // Form State
    const [formData, setFormData] = React.useState<{
        title: string;
        description: string;
        type: 'SMS' | 'Email' | 'Push';
        category: 'Approval' | 'Security' | 'Alert';
        content: string;
    }>({
        title: '',
        description: '',
        type: 'SMS',
        category: 'Approval',
        content: ''
    });

    const fetchTemplates = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/templates');
            if (!res.ok) throw new Error('Failed to fetch templates');
            const data = await res.json();
            setTemplates(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchTemplates();
    }, []);

    const handleOpenModal = (template?: Template) => {
        if (template) {
            setEditingTemplate(template);
            setFormData({
                title: template.title,
                description: template.description || '',
                type: template.type,
                category: template.category,
                content: template.content
            });
        } else {
            setEditingTemplate(null);
            setFormData({
                title: '',
                description: '',
                type: 'SMS',
                category: 'Approval',
                content: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const method = editingTemplate ? 'PATCH' : 'POST';
            const body = editingTemplate ? { id: editingTemplate.id, ...formData } : formData;

            const res = await fetch('/api/templates', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error('Failed to save template');

            await fetchTemplates();
            setIsModalOpen(false);
        } catch (err) {
            alert('Error saving template');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this template?')) return;
        try {
            const res = await fetch(`/api/templates?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            setTemplates(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            alert('Error deleting template');
        }
    };

    const handleDuplicate = async (template: Template) => {
        try {
            const body = {
                ...template,
                id: undefined,
                title: `${template.title} (Copy)`,
                updated_at: undefined
            };
            const res = await fetch('/api/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error('Failed to duplicate');
            await fetchTemplates();
        } catch (err) {
            alert('Error duplicating template');
        }
    };

    const filteredTemplates = templates.filter(t =>
        (t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.content?.toLowerCase().includes(searchTerm.toLowerCase())) &&
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
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#c32026] hover:bg-[#c32026]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#c32026]/20 transition-all"
                >
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
                {isLoading ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="dashboard-card p-6 h-52 animate-pulse bg-slate-50"></div>
                    ))
                ) : filteredTemplates.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-slate-900">No templates found</h3>
                        <p className="text-sm text-slate-500">Try adjusting your search or category filters.</p>
                    </div>
                ) : (
                    filteredTemplates.map(template => (
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
                                    <button
                                        onClick={() => handleOpenModal(template)}
                                        className="p-2 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 rounded-lg transition-all"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(template.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
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
                                <span className="text-[10px] text-slate-400 font-medium">
                                    {template.updated_at ? `Modified ${new Date(template.updated_at).toLocaleDateString()}` : 'Legendary Template'}
                                </span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleDuplicate(template)}
                                        className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-[#c32026] transition-colors"
                                    >
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
                    ))
                )}

                {/* Create New Item Placeholder */}
                <button
                    onClick={() => handleOpenModal()}
                    className="dashboard-card p-6 border-dashed border-2 border-slate-200 bg-slate-50/30 flex flex-col items-center justify-center gap-3 group hover:border-[#c32026]/50 hover:bg-[#c32026]/5 transition-all min-h-[220px]"
                >
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

            {/* Template Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-full">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 text-[#c32026]" />
                                    {editingTemplate ? 'Edit Template' : 'Create New Template'}
                                </h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Configure automated message content</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Template Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Pass Approval SMS"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-4 focus:ring-[#c32026]/5 focus:border-[#c32026] outline-none transition-all"
                                        value={formData.title}
                                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Short Description</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sent when pass is approved"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-4 focus:ring-[#c32026]/5 focus:border-[#c32026] outline-none transition-all"
                                        value={formData.description}
                                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Channel Type</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-4 focus:ring-[#c32026]/5 focus:border-[#c32026] outline-none transition-all appearance-none cursor-pointer"
                                        value={formData.type}
                                        onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                                    >
                                        <option value="SMS">SMS Message</option>
                                        <option value="Email">Email Communication</option>
                                        <option value="Push">Push Notification</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-4 focus:ring-[#c32026]/5 focus:border-[#c32026] outline-none transition-all appearance-none cursor-pointer"
                                        value={formData.category}
                                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                                    >
                                        <option value="Approval">Pass Approval</option>
                                        <option value="Security">Security Protocol</option>
                                        <option value="Alert">Urgent Alerts</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message Content</label>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 rounded text-[8px] font-black text-amber-600 uppercase tracking-widest">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        Smart Variables Enabled
                                    </div>
                                </div>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Enter message content here..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-4 focus:ring-[#c32026]/5 focus:border-[#c32026] outline-none transition-all resize-none"
                                    value={formData.content}
                                    onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {['{student_name}', '{reason}', '{in_time}', '{date}', '{otp_code}'].map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, content: prev.content + tag }))}
                                            className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:border-[#c32026] hover:text-[#c32026] transition-all shadow-sm"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-0.5">Note on Variables</h4>
                                    <p className="text-[10px] font-medium text-blue-700 leading-relaxed">
                                        Ensure variables are wrapped in curly braces like <span className="font-bold">{"{variable_name}"}</span>. Missing braces or typos will prevent the system from populating data correctly.
                                    </p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-[2] px-6 py-3 bg-[#c32026] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#c32026]/90 shadow-lg shadow-[#c32026]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    {editingTemplate ? 'Update Template' : 'Save Template'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
