
import React from 'react';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import LanternIcon from '../icons/LanternIcon';

export default function LoginPrompt() {
  const handleLogin = async () => {
    await User.login();
  };

  const features = [
    {
      icon: TrendingUp,
      title: 'Track Your Progress',
      description: 'Log activities like study, sleep, and nutrition to see your growth over time.',
    },
    {
      icon: LanternIcon,
      title: 'Gamify Your Goals',
      description: 'Earn points, build streaks, and unlock achievements to stay motivated.',
    },
    {
      icon: Users,
      title: 'Connect with Friends',
      description: 'Share your progress with friends and cheer each other on towards your goals.',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#1a1a1a] text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <LanternIcon className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight">Lantern</h1>
        </div>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Light your path forward with better habits, progress tracking, and friends who support your journey.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <Button
          onClick={handleLogin}
          size="lg"
          className="w-full text-lg font-semibold bg-purple-600 hover:bg-purple-700 h-14 rounded-xl shadow-lg shadow-purple-600/20"
        >
          Get Started - It's Free
        </Button>
        <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Secure sign-in powered by Google.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl"
      >
        {features.map((feature, index) => (
          <div key={index} className="text-center p-6 bg-[#2f3136]/50 rounded-xl border border-transparent hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
