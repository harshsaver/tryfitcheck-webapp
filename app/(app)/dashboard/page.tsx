'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Coins, Sparkles, LogOut, User, CreditCard, History } from 'lucide-react';

interface UserData {
  credits: number;
  total_generations: number;
  total_credits_purchased: number;
  email: string;
  full_name: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('web_users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setUserData({
        ...data,
        email: user.email || '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load dashboard'}</p>
          <Link href="/try-on" className="text-primary-pink hover:underline">
            Return to Try-On
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/try-on" className="flex items-center gap-2 text-gray-700 hover:text-primary-pink transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Try-On</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {userData.full_name || 'there'}!
          </h1>
          <p className="text-gray-600">Manage your credits and view your activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Credits Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-primary-pink">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-pink to-secondary-purple rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <Link
                href="/pricing"
                className="text-sm text-primary-pink hover:underline font-semibold"
              >
                Buy More
              </Link>
            </div>
            <p className="text-gray-600 text-sm mb-2">Available Credits</p>
            <p className="text-4xl font-bold text-gray-900">{userData.credits}</p>
            <p className="text-xs text-gray-500 mt-2">
              {userData.credits === 0 ? 'Purchase credits to continue' : `Ready for ${userData.credits} try-ons`}
            </p>
          </div>

          {/* Total Try-Ons Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-secondary-purple" />
            </div>
            <p className="text-gray-600 text-sm mb-2">Total Try-Ons</p>
            <p className="text-4xl font-bold text-gray-900">{userData.total_generations}</p>
            <p className="text-xs text-gray-500 mt-2">Virtual outfits tried</p>
          </div>

          {/* Credits Purchased Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-primary-pink" />
            </div>
            <p className="text-gray-600 text-sm mb-2">Credits Purchased</p>
            <p className="text-4xl font-bold text-gray-900">{userData.total_credits_purchased}</p>
            <p className="text-xs text-gray-500 mt-2">Lifetime total</p>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-6 h-6" />
            Account Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <p className="text-gray-900">{userData.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Member Since</label>
              <p className="text-gray-900">
                {new Date(userData.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            {userData.full_name && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <p className="text-gray-900">{userData.full_name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-primary-pink to-secondary-purple rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to try more outfits?</h2>
          <p className="mb-6 opacity-90">
            {userData.credits > 0
              ? `You have ${userData.credits} ${userData.credits === 1 ? 'credit' : 'credits'} ready to use!`
              : 'Purchase credits to get started with virtual try-on.'}
          </p>
          <div className="flex gap-4">
            <Link
              href="/try-on"
              className="px-6 py-3 bg-white text-primary-pink rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Start Try-On
            </Link>
            {userData.credits === 0 && (
              <Link
                href="/pricing"
                className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border-2 border-white rounded-lg font-semibold hover:bg-white/30 transition-all"
              >
                Buy Credits
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
