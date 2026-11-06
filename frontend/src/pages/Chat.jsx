import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Brain,
  Clock,
  ArrowLeft,
  LayoutDashboard,
  Receipt,
  TrendingUp,
  ShieldCheck,
  Zap,
  Target,
} from 'lucide-react';
import { NeumorphicCard } from '../components/ui/NeumorphicCard';
import { Button } from '../components/ui/Button';

export function Chat() {
  const navigate = useNavigate();

  const upcomingFeatures = [
    {
      icon: Target,
      title: 'Automated Spending Audits',
      description: 'Deep scans of monthly cash flow to identify high-frequency dining leaks and recurring subscription burdens.',
      status: 'In Progress',
    },
    {
      icon: TrendingUp,
      title: 'Predictive Cash Flow Forecasts',
      description: 'Proactive projections that warn you well before exceeding your planned monthly category limits.',
      status: 'In Progress',
    },
    {
      icon: Zap,
      title: 'Personalized Savings Strategies',
      description: 'Dynamic budgeting blueprints tuned to your actual salary and monthly discretionary expenses.',
      status: 'Coming Soon',
    },
    {
      icon: Brain,
      title: 'Conversational Data Insights',
      description: 'Ask questions about your transactions with instant, exact numerical insights and cash flow breakdowns.',
      status: 'Coming Soon',
    },
  ];

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full pb-10">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-textPrimary tracking-tight">
            AI Financial Advisor
          </h2>
          <p className="text-xs sm:text-sm text-textSecondary mt-0.5">
            Intelligent personal finance advisory engine
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold shadow-neu-sm">
          <Clock className="w-3.5 h-3.5" />
          <span>Coming Soon</span>
        </span>
      </div>

      {/* Main Coming Soon Card */}
      <NeumorphicCard className="p-8 sm:p-12 border border-white/90 rounded-3xl relative overflow-hidden flex flex-col items-center text-center shadow-xl">
        {/* Soft Background Gradients */}
        <div className="w-80 h-80 rounded-full bg-primary/10 absolute -top-20 -right-20 blur-3xl pointer-events-none" />
        <div className="w-80 h-80 rounded-full bg-secondary/10 absolute -bottom-20 -left-20 blur-3xl pointer-events-none" />

        {/* Hero Icon Emblem */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl neu-icon-box flex items-center justify-center text-primary bg-primary/15 border border-primary/30 shadow-neu-sm">
            <Sparkles className="w-12 h-12 stroke-[1.75]" />
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center absolute -top-1 -right-1 ring-4 ring-surface shadow-md">
            <Clock className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Feature Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-extrabold tracking-wider uppercase mb-4">
          <Brain className="w-3.5 h-3.5" />
          <span>Feature Under Active Development</span>
        </div>

        {/* Headlines */}
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-textPrimary tracking-tight mb-4 max-w-2xl leading-tight">
          AI Financial Advisor is Coming Soon
        </h3>

        <p className="text-xs sm:text-sm text-textSecondary max-w-2xl mb-8 leading-relaxed">
          We are currently building and fine-tuning an intelligent AI financial advisory engine powered by deep contextual learning.
          This capability will analyze your income and expenses to deliver automated budgeting audits, predictive leak alerts, and personalized cash flow recommendations.
        </p>

        {/* Planned Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl mb-8 text-left">
          {upcomingFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-4 rounded-2xl neu-inset border border-white/70 bg-surface/60 flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl neu-icon-box flex items-center justify-center text-primary bg-primary/15 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-surface border border-border/50 text-textSecondary">
                    {feat.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-textPrimary mb-1">
                    {feat.title}
                  </h4>
                  <p className="text-[11px] text-textSecondary leading-snug">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/')}
            className="neu-btn-primary px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-neu-accent cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Button>

          <Button
            variant="surface"
            size="lg"
            onClick={() => navigate('/expenses')}
            className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-primary" />
            <span>Manage Transactions</span>
          </Button>
        </div>

        {/* Subtle Assurance */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-textSecondary">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>All your financial transactions remain 100% private and stored locally.</span>
        </div>
      </NeumorphicCard>
    </div>
  );
}
