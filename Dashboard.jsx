import React, { useState, useEffect } from "react";
import { Activity, User, Friendship } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Utensils, 
  BookOpen, 
  Moon, 
  Users, 
  Trophy, 
  Flame, 
  TrendingUp,
  Star,
  Calendar
} from "lucide-react";
import { format, isToday, startOfWeek, endOfWeek } from "date-fns";

import DailyGoals from "../components/dashboard/DailyGoals";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import WeeklyChart from "../components/dashboard/WeeklyChart";
import FriendActivity from "../Components/dashboard/FriendActivity";

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [currentUser, userActivities, userFriends] = await Promise.all([
        User.me(),
        Activity.filter({ created_by: (await User.me()).email }, '-created_date', 50),
        Friendship.filter({ created_by: (await User.me()).email, status: 'accepted' })
      ]);
      
      setUser(currentUser);
      setActivities(userActivities);
      setFriends(userFriends);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const todayActivities = activities.filter(activity => 
    isToday(new Date(activity.date))
  );

  const thisWeekActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    return activityDate >= weekStart && activityDate <= weekEnd;
  });

  const getTypeIcon = (type) => {
    const icons = {
      food: Utensils,
      study: BookOpen,
      sleep: Moon,
      social: Users
    };
    return icons[type] || Star;
  };

  const getTypeColor = (type) => {
    const colors = {
      food: 'from-green-500 to-emerald-600',
      study: 'from-blue-500 to-indigo-600',
      sleep: 'from-purple-500 to-violet-600',
      social: 'from-pink-500 to-rose-600'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-300">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
          <span className="text-lg">Loading your progress...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Champion'}! 🏮
          </h1>
          <p className="text-gray-400 text-lg">
            {format(new Date(), 'EEEE, MMMM do')} • Let your progress light the way
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Total Points</p>
                  <p className="text-2xl font-bold text-white">
                    {user?.total_points || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Current Streak</p>
                  <p className="text-2xl font-bold text-white">
                    {user?.current_streak || 0} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-teal-500 border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">This Week</p>
                  <p className="text-2xl font-bold text-white">
                    {thisWeekActivities.length} activities
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-indigo-500 border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Today</p>
                  <p className="text-2xl font-bold text-white">
                    {todayActivities.length} completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Daily Goals & Weekly Chart */}
          <div className="lg:col-span-2 space-y-8">
            <DailyGoals 
              activities={todayActivities} 
              goals={user?.daily_goals || {}}
            />
            <WeeklyChart activities={thisWeekActivities} />
          </div>

          {/* Right Column - Activity Feed & Friends */}
          <div className="space-y-8">
            <ActivityFeed activities={activities.slice(0, 8)} />
            <FriendActivity friends={friends.slice(0, 5)} />
          </div>
        </div>
      </div>
    </div>
  );
}