import type { Metadata } from 'next';
import Link from 'next/link';
import {
    ArrowLeft,
    Camera,
    CheckCircle2,
    ChevronRight,
    Database,
    MapPin,
    Mic,
    Shield,
    ShieldCheck,
    Smartphone,
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy | Gate Pass System',
    description: 'Privacy policy for the Gate Pass System used by CT Group of Institutions, Shahpur.',
};

const sections = [
    {
        id: '01',
        title: 'Information We Collect',
        icon: Database,
        points: [
            'Personal Information: Name, Email Address, Role (Student, Faculty, HOD, Principal, Security, etc.), and Department details.',
            'Usage Data: App usage activity, gate pass request history, and entry/exit logs.',
            'Device Information: Device type, operating system, and app version.',
        ],
    },
    {
        id: '02',
        title: 'Location Data',
        icon: MapPin,
        points: [
            'We may collect location data to verify user presence within campus, track entry/exit events, and enhance security monitoring.',
            'Location data is only used when necessary and is not stored beyond required operations.',
        ],
    },
    {
        id: '03',
        title: 'Camera Access',
        icon: Camera,
        points: [
            'The app uses the device camera to scan QR codes for gate pass verification and enable secure entry/exit validation.',
            'We do not store or record images or videos.',
        ],
    },
    {
        id: '04',
        title: 'Microphone Access',
        icon: Mic,
        points: [
            'If enabled, microphone access is used for voice-based features when applicable.',
            'We do not record or store audio data.',
        ],
    },
    {
        id: '05',
        title: 'Storage Access',
        icon: Smartphone,
        points: [
            'Storage permission is used to cache app data and improve performance.',
            'We do not access personal files without permission.',
        ],
    },
    {
        id: '06',
        title: 'How We Use Your Data',
        icon: Shield,
        points: [
            'We use collected data to manage gate pass approvals, enable role-based access control, track movement logs, improve system performance, and ensure campus security.',
        ],
    },
    {
        id: '07',
        title: 'Data Storage & Security',
        icon: ShieldCheck,
        points: [
            'Your data is securely stored using Firebase (Google Cloud Platform).',
            'We implement authentication-based access, role-based authorization, and secure database rules.',
        ],
    },
    {
        id: '08',
        title: 'Data Sharing',
        icon: ChevronRight,
        points: [
            'We do not sell or share your data with third parties.',
            'Data may be accessed by authorized administrators and institutional authorities only for operational purposes.',
        ],
    },
    {
        id: '09',
        title: 'User Rights',
        icon: CheckCircle2,
        points: [
            'Users can view their data, request correction, and request deletion through the admin.',
        ],
    },
    {
        id: '10',
        title: 'Data Protection',
        icon: Shield,
        points: [
            'We use industry-standard practices including secure authentication, encrypted communication, and access control mechanisms.',
        ],
    },
    {
        id: '11',
        title: "Children's Privacy",
        icon: ShieldCheck,
        points: [
            'This app is intended for institutional use. We do not knowingly collect data from children outside authorized environments.',
        ],
    },
    {
        id: '12',
        title: 'Changes to Privacy Policy',
        icon: ChevronRight,
        points: [
            'We may update this policy periodically. Changes will be reflected on this page.',
        ],
    },
];

const highlights = [
    { label: 'Location', value: 'Campus verification only' },
    { label: 'Camera', value: 'QR scan without media storage' },
    { label: 'Sharing', value: 'No third-party selling' },
    { label: 'Security', value: 'Firebase + role-based controls' },
];

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(254,194,15,0.22),_transparent_28%),linear-gradient(135deg,#08111f_0%,#102544_38%,#0b1530_100%)] text-white">
            <div className="relative mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
                <div className="pointer-events-none absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-[#fec20f]/15 blur-3xl" />
                <div className="pointer-events-none absolute right-[-80px] top-40 h-80 w-80 rounded-full bg-[#c32026]/15 blur-3xl" />

                <div className="relative z-10 space-y-10">
                    <div className="flex items-center justify-between gap-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-slate-200 transition hover:bg-white/10"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Link>
                        <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-emerald-200">
                            Last Updated: 20 March 2026
                        </div>
                    </div>

                    <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/6 px-6 py-8 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-10 sm:py-12">
                        <div className="absolute inset-y-0 right-0 hidden w-[32%] border-l border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))] lg:block" />
                        <div className="relative grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
                            <div className="max-w-3xl">
                                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#fec20f]/30 bg-[#fec20f]/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#ffe07a]">
                                    <ShieldCheck className="h-4 w-4" />
                                    Privacy Policy - Gate Pass System
                                </div>
                                <h1 className="max-w-4xl text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                                    Privacy, expressed like a security command center.
                                </h1>
                                <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-slate-300 sm:text-lg">
                                    Welcome to Gate Pass System. This Privacy Policy explains how we collect, use, and protect your information when you use our mobile application.
                                </p>

                                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                    {highlights.map((item) => (
                                        <div
                                            key={item.label}
                                            className="rounded-2xl border border-white/10 bg-black/15 px-5 py-4"
                                        >
                                            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-400">
                                                {item.label}
                                            </p>
                                            <p className="mt-2 text-sm font-bold text-white">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-4 self-start">
                                <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-6">
                                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">
                                        Contact
                                    </p>
                                    <div className="mt-5 space-y-4">
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#fec20f]">
                                                Email
                                            </p>
                                            <a
                                                href="mailto:gatepassproject@ctgroup.in"
                                                className="mt-1 block text-sm font-semibold text-white transition hover:text-[#ffe07a]"
                                            >
                                                gatepassproject@ctgroup.in
                                            </a>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#fec20f]">
                                                Organization
                                            </p>
                                            <p className="mt-1 text-sm font-semibold text-slate-200">
                                                CT Group of Institutions, Shahpur
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[28px] border border-[#c32026]/30 bg-[#c32026]/12 p-6">
                                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-rose-100/75">
                                        Commitment
                                    </p>
                                    <p className="mt-4 text-sm font-medium leading-7 text-rose-50">
                                        Permissions are used only for operational trust, verification, and campus security workflows.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="space-y-6">
                            <div className="rounded-[32px] border border-white/10 bg-white/6 p-7 backdrop-blur-xl">
                                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">
                                    Quick Scope
                                </p>
                                <div className="mt-6 space-y-4">
                                    {[
                                        'Gate pass approvals',
                                        'Entry and exit verification',
                                        'Role-based access control',
                                        'Campus movement visibility',
                                        'Operational compliance',
                                    ].map((item) => (
                                        <div key={item} className="flex items-center gap-3 rounded-2xl bg-black/15 px-4 py-3">
                                            <div className="h-2 w-2 rounded-full bg-[#fec20f]" />
                                            <span className="text-sm font-semibold text-slate-100">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(30,58,95,0.72),rgba(8,17,31,0.92))] p-7">
                                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-200/70">
                                    Core Promise
                                </p>
                                <p className="mt-5 text-lg font-bold leading-8 text-white">
                                    We do not sell your data, and we limit access to authorized institutional stakeholders for operational purposes only.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5">
                            {sections.map((section) => (
                                <article
                                    key={section.id}
                                    className="group rounded-[30px] border border-white/10 bg-white/[0.07] p-6 shadow-lg shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.09]"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fec20f] to-[#c32026] text-slate-950 shadow-lg shadow-[#fec20f]/10">
                                            <section.icon className="h-6 w-6" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                                    Section {section.id}
                                                </span>
                                                <div className="h-px flex-1 bg-white/10" />
                                            </div>
                                            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">
                                                {section.title}
                                            </h2>
                                            <div className="mt-4 space-y-3">
                                                {section.points.map((point) => (
                                                    <div
                                                        key={point}
                                                        className="rounded-2xl border border-white/8 bg-black/15 px-4 py-3 text-sm font-medium leading-7 text-slate-200"
                                                    >
                                                        {point}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-[32px] border border-white/10 bg-white/6 px-6 py-8 text-center backdrop-blur-xl sm:px-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-slate-400">
                            Contact Us
                        </p>
                        <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white">
                            Questions about privacy or data access?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-300">
                            Reach out to the project team and institutional administrators for clarification, correction requests, or deletion requests routed through admin controls.
                        </p>
                        <a
                            href="mailto:gatepassproject@ctgroup.in"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-[#102544] transition hover:bg-[#ffe07a]"
                        >
                            Contact gatepassproject@ctgroup.in
                            <ChevronRight className="h-4 w-4" />
                        </a>
                    </section>
                </div>
            </div>
        </main>
    );
}
