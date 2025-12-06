import React from "react";
import {
  ShieldCheck,
  Zap,
  FileStack,
  ShieldCheck as ShieldCheckIcon,
  LayoutDashboard,
} from "lucide-react";

interface Props {
  onLogin: () => void;
  onPortal: () => void;
}

export default function LandingPage({ onLogin, onPortal }: Props) {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xl">
            <ShieldCheck className="h-8 w-8" />
            <span>Corallo AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onPortal}
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Client Portal Demo
            </button>
            <button
              onClick={onLogin}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 text-center overflow-hidden min-h-[520px]">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero/hero-bg.png')" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/70" />
        <div className="relative z-20 max-w-7xl mx-auto">
          <h1 className="text-white text-4xl sm:text-6xl font-extrabold drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] mb-4">
            Audit in Minutes. Not Hours.
          </h1>
          <p className="text-white/90 text-base sm:text-lg font-medium max-w-2xl mx-auto mb-8 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
            Streamline reviews, eliminate repetitive checks, and keep every engagement moving — with automated audit
            intelligence built for your workflow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onLogin}
              className="px-6 py-3 rounded-lg text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all"
            >
              Upload &amp; Review Now
            </button>
            <button
              onClick={
                onPortal /* TODO: replace with actual demo route if different */
              }
              className="px-6 py-3 rounded-lg text-sm font-semibold border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              Try Demo
            </button>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-blue-600 text-center mb-3">
            CAPABILITIES
          </p>

          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 text-center mb-3">
            Everything you need to deliver assurance
          </h2>

          <p className="text-sm sm:text-base text-slate-600 text-center max-w-2xl mx-auto mb-10">
            From deterministic checks to AI-driven risk scoring, Corallo AI gives your firm the tools
            to review more work, catch more issues, and move every engagement forward faster.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Zap,
                title: "Automated Rules",
                description:
                  "100+ deterministic checks across income, payroll, expenses, and assets. Catch errors instantly before they reach review.",
              },
              {
                icon: FileStack,
                title: "Instant Workpapers",
                description:
                  "Auto-generate clean, standardized workpapers and lead schedules linked directly to underlying evidence.",
              },
              {
                icon: ShieldCheckIcon,
                title: "Intelligent Risk Scoring",
                description:
                  "Prioritize what matters with severity scoring, explanations, and flags that surface the riskiest items first.",
              },
              {
                icon: LayoutDashboard,
                title: "Multi-Client Control Center",
                description:
                  "Monitor every client and engagement in one place with real-time status, open issues, and review progress at a glance.",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col animate-fade-up"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 text-blue-600 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400">(c) 2024 Corallo AI TaxOps. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}




