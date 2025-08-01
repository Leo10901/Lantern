import React, { useState } from "react";
import { Activity } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, BookOpen, Moon, Users, Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import ActivityForm from "../components/track/ActivityForm";
import LanternIcon from "../components/icons/LanternIcon"; // New import

export default function Track() {
  const [selectedType, setSelectedType] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const activityTypes = [
    {
      type: 'food',
      title: 'Food & Nutrition',
      description: 'Log your meals and nutrition',
      icon: Utensils,
      color: 'from-green-500 to-emerald-600',
      points: '10-50 pts'
    },
    {
      type: 'study',
      title: 'Study & Learning',
      description: 'Track your learning sessions',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      points: '20-100 pts'
    },
    {
      type: 'sleep',
      title: 'Sleep & Rest',
      description: 'Monitor your sleep patterns',
      icon: Moon,
      color: 'from-purple-500 to-violet-600',
      points: '50-150 pts'
    },
    {
      type: 'social',
      title: 'Social & Connection',
      description: 'Log social interactions',
      icon: Users,
      color: 'from-pink-500 to-rose-600',
      points: '15-75 pts'
    }
  ];

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    const points = calculatePoints(selectedType, formData);
    
    await Activity.create({
      ...formData,
      type: selectedType,
      points_earned: points
    });
    
    setShowForm(false);
    setSelectedType(null);
  };

  const calculatePoints = (type, data) => {
    const basePoints = {
      food: 25,
      study: 50,
      sleep: 100,
      social: 30
    };
    
    let points = basePoints[type] || 25;
    
    // Bonus points for ratings
    if (data.rating >= 4) points += 10;
    if (data.rating === 5) points += 20;
    
    // Duration bonuses
    if (type === 'study' && data.duration >= 60) points += 25;
    if (type === 'social' && data.duration >= 30) points += 15;
    if (type === 'sleep' && data.duration >= 7) points += 50;
    
    return points;
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <ActivityForm
            type={selectedType}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedType(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <LanternIcon className="w-8 h-8 text-purple-400" /> {/* Replaced Sparkles with LanternIcon */}
            <h1 className="text-3xl md:text-4xl font-bold text-white">Track Activity</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Light up your progress by logging activities and earning points! 🏮
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {activityTypes.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="bg-[#2f3136] border-[#40444b] hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleTypeSelect(activity.type)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 bg-gradient-to-r ${activity.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Earn</div>
                        <div className="text-yellow-400 font-bold">{activity.points}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardTitle className="text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {activity.title}
                    </CardTitle>
                    <p className="text-gray-400 mb-6">{activity.description}</p>
                    <Button 
                      className={`w-full bg-gradient-to-r ${activity.color} hover:opacity-90 transition-opacity`}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Log {activity.title.split(' ')[0]}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Earn Bonus Points!</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="space-y-2">
                  <p>🌟 <strong>5-star rating:</strong> +20 bonus points</p>
                  <p>⭐ <strong>4+ star rating:</strong> +10 bonus points</p>
                </div>
                <div className="space-y-2">
                  <p>📚 <strong>Study 60+ min:</strong> +25 bonus points</p>
                  <p>😴 <strong>Sleep 7+ hours:</strong> +50 bonus points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
