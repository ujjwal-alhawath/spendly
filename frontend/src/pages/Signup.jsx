import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wallet, User, Mail, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { NeumorphicCard } from '../components/ui/NeumorphicCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const signup = useStore((state) => state.signup);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (name && email && password) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          signup(data.user, data.token);
          navigate('/');
        } else {
          setError(data.message || 'Signup failed');
        }
      } catch (err) {
        setError('Server is unavailable. You can use Guest / Demo Login below.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDemoSignup = () => {
    signup(
      {
        name: name || 'Alex Morgan',
        email: email || 'alex.morgan@spendly.app',
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
            Create Spend<span className="text-primary">ly</span> Account
          </h1>
          <p className="text-xs text-textSecondary mt-1">
            Start tracking, visualizing, and mastering your personal finances
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-danger/10 border border-danger/30 text-danger text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            icon={<User className="w-4 h-4" />}
            required
          />

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
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="surface"
            onClick={handleDemoSignup}
            className="w-full"
          >
            <UserCheck className="w-4 h-4 text-primary" />
            <span>Instant Demo Access</span>
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-textSecondary font-medium">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary hover:text-primary-hover font-bold transition-colors ml-1"
          >
            Sign in
          </Link>
        </p>
      </NeumorphicCard>
    </div>
  );
};
