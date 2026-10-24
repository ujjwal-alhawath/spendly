import React, { useState } from 'react';
import {
  User,
  Globe,
  Database,
  Crown,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { NeumorphicCard } from '../components/ui/NeumorphicCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from '../components/ui/Toast';

export function Settings() {
  const {
    user,
    updateUser,
    setPremium,
    currency,
    setCurrency,
    monthlyBudget,
    setBudget,
    expenses,
    loadDemoData,
    clearAllExpenses,
  } = useStore();

  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [email, setEmail] = useState(user?.email || 'alex.morgan@spendly.app');
  const [budgetVal, setBudgetVal] = useState(monthlyBudget.toString());

  const isPremium = Boolean(user?.isPremium);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser({ name, email });
    toast.success('Profile preferences updated');
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    const num = Number(budgetVal);
    if (!num || num <= 0) {
      toast.error('Enter a valid monthly target');
      return;
    }
    setBudget(num);
    toast.success('Default monthly budget updated');
  };

  // Export JSON backup
  const handleExportData = () => {
    const data = {
      user,
      currency,
      monthlyBudget,
      expenses,
      exportDate: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spendly-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup exported successfully');
  };

  // Import JSON backup
  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.expenses && Array.isArray(parsed.expenses)) {
          // Restore store
          useStore.setState({
            expenses: parsed.expenses,
            monthlyBudget: parsed.monthlyBudget || monthlyBudget,
            currency: parsed.currency || currency,
          });
          toast.success(`Imported ${parsed.expenses.length} transactions`);
        } else {
          toast.error('Invalid backup format');
        }
      } catch (err) {
        toast.error('Failed to parse backup file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-16">
      <div>
        <h2 className="text-xl font-extrabold text-textPrimary tracking-tight">
          Application Preferences
        </h2>
        <p className="text-xs text-textSecondary">
          Manage your account profile, currency formatting, and local data persistence
        </p>
      </div>

      {/* User Profile Card */}
      <NeumorphicCard className="p-6">
        <div className="flex items-center gap-3 mb-5 border-b border-border/40 pb-4">
          <div className="w-10 h-10 rounded-2xl neu-icon-box flex items-center justify-center text-primary bg-primary/10">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-textPrimary">Profile Details</h3>
            <p className="text-xs text-textSecondary">Your personal account information</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@example.com"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-textSecondary">Pro Status:</span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  isPremium
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-black/10 text-textSecondary'
                }`}
              >
                {isPremium ? '💎 Spendly Pro Active' : 'Free Tier'}
              </span>
            </div>

            <Button type="submit" variant="primary">
              Save Profile
            </Button>
          </div>
        </form>
      </NeumorphicCard>

      {/* Currency & Financial Preferences */}
      <NeumorphicCard className="p-6">
        <div className="flex items-center gap-3 mb-5 border-b border-border/40 pb-4">
          <div className="w-10 h-10 rounded-2xl neu-icon-box flex items-center justify-center text-secondary bg-secondary/10">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-textPrimary">Currency & Display</h3>
            <p className="text-xs text-textSecondary">
              Regional currency formatting applied throughout charts & cards
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Currency Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-textSecondary">
              Active Currency
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { code: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
                { code: 'USD', label: 'US Dollar ($)', symbol: '$' },
                { code: 'EUR', label: 'Euro (€)', symbol: '€' },
                { code: 'GBP', label: 'British Pound (£)', symbol: '£' },
              ].map((curr) => (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => {
                    setCurrency(curr.code);
                    toast.success(`Currency changed to ${curr.code}`);
                  }}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    currency === curr.code
                      ? 'neu-inset text-primary border border-primary/30 font-bold'
                      : 'neu-btn text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  <span className="text-lg font-extrabold">{curr.symbol}</span>
                  <span className="text-xs">{curr.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Default Budget */}
          <form onSubmit={handleSaveBudget} className="flex flex-col sm:flex-row items-end gap-3 pt-2">
            <div className="flex-1 w-full">
              <Input
                label="Default Monthly Budget Target"
                type="number"
                step="500"
                value={budgetVal}
                onChange={(e) => setBudgetVal(e.target.value)}
              />
            </div>
            <Button type="submit" variant="surface" className="w-full sm:w-auto">
              Update Budget
            </Button>
          </form>
        </div>
      </NeumorphicCard>

      {/* Local-First Data Management */}
      <NeumorphicCard className="p-6">
        <div className="flex items-center gap-3 mb-5 border-b border-border/40 pb-4">
          <div className="w-10 h-10 rounded-2xl neu-icon-box flex items-center justify-center text-primary bg-primary/10">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-textPrimary">Data Management</h3>
            <p className="text-xs text-textSecondary">
              Local persistence in your browser with JSON import & export options
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export JSON */}
          <div className="p-4 rounded-2xl neu-inset flex flex-col justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                <Download className="w-4 h-4 text-primary" />
                <span>Export Data</span>
              </h4>
              <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                Download a complete JSON backup of your transactions, categories, and targets.
              </p>
            </div>
            <Button variant="surface" size="sm" onClick={handleExportData}>
              Download JSON Backup
            </Button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-2xl neu-inset flex flex-col justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                <Upload className="w-4 h-4 text-secondary" />
                <span>Import Backup</span>
              </h4>
              <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                Restore your financial history from an existing Spendly JSON file.
              </p>
            </div>
            <label className="neu-btn px-3 py-1.5 text-xs rounded-xl font-bold text-center cursor-pointer text-textPrimary hover:text-primary">
              <span>Choose File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset Demo Data */}
          <div className="p-4 rounded-2xl neu-inset flex flex-col justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-primary" />
                <span>Restore Sample Data</span>
              </h4>
              <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                Reset your records with pre-populated realistic salary, grocery, and utility records.
              </p>
            </div>
            <Button
              variant="surface"
              size="sm"
              onClick={() => {
                loadDemoData();
                toast.success('Sample transactions reloaded');
              }}
            >
              Load Demo Records
            </Button>
          </div>

          {/* Wipe All Data */}
          <div className="p-4 rounded-2xl neu-inset flex flex-col justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-danger flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span>Clear All Records</span>
              </h4>
              <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                Permanently delete all stored income and expense entries for a clean slate.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all transactions?')) {
                  clearAllExpenses();
                  toast.success('All transactions cleared');
                }
              }}
            >
              Clear Transactions
            </Button>
          </div>
        </div>
      </NeumorphicCard>
    </div>
  );
}
