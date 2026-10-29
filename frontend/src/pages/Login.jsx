import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wallet, Mail, Lock, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { NeumorphicCard } from '../components/ui/NeumorphicCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { API_BASE } from '../constants';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (email && password) {
      try {
        const response = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          login(data.user, data.token);
          navigate('/');
        } else {
          setError(data.message || 'Login failed. Check your credentials.');
        }
      } catch (err) {
        setError('Server is unavailable. You can use Guest / Demo Login below.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDemoLogin = () => {
    login(
      {
        name: 'Alex Morgan',
        email: 'alex.morgan@spendly.app',
        isPremium: true,
      },
      'demo-token-12345'
    );
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <NeumorphicCard className="p-8 sm:p-10 w-full max-w-md border border-white/90 rounded-3xl shadow-2xl flex flex-col">
        {/* Logo & Heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-white shadow-neu-sm mb-3">
            <Wallet className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-textPrimary tracking-tight">
            Welcome to Spend<span className="text-primary">ly</span>
          </h1>
          <p className="text-xs text-textSecondary mt-1">
            Sign in to manage your finances & AI insights
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-danger/10 border border-danger/30 text-danger text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full mt-2 neu-btn-primary shadow-neu-accent"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="surface"
            onClick={handleDemoLogin}
            className="w-full"
          >
            <UserCheck className="w-4 h-4 text-primary" />
            <span>Continue as Guest / Demo</span>
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-textSecondary font-medium">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-primary hover:text-primary-hover font-bold transition-colors ml-1"
          >
            Create account
          </Link>
        </p>
      </NeumorphicCard>
    </div>
  );
};
