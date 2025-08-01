
import React, { useState, useEffect } from "react";
import { Activity } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Calendar, Target, Award } from "lucide-react";
import { format, startOfWeek, addDays, subWeeks, startOfMonth, addMonths } from "date-fns";

export default function AnalyticsPage() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const userActivities = await Activity.list('-created_date', 100);
      setActivities(userActivities);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeeklyData = () => {
    const weeks = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i));
      const weekActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= weekStart && activityDate < addDays(weekStart, 7);
      });

      weeks.push({
        week: format(weekStart, 'MMM d'),
        total: weekActivities.length,
        food: weekActivities.filter(a => a.type === 'food').length,
        study: weekActivities.filter(a => a.type === 'study').length,
        sleep: weekActivities.filter(a => a.type === 'sleep').length,
        social: weekActivities.filter(a => a.type === 'social').length,
      });
    }
    return weeks;
  };

  const getTypeDistribution = () => {
    const types = ['food', 'study', 'sleep', 'social'];
    return types.map(type => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: activities.filter(a => a.type === type).length,
      color: {
        food: '#10b981',
        study: '#3b82f6',
        sleep: '#8b5cf6',
        social: '#ec4899'
      }[type]
    }));
  };

  const getTotalPoints = () => {
    return activities.reduce((sum, activity) => sum + (activity.points_earned || 0), 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-300">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
          <span className="text-lg">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Lantern Dashboard</h1>
          <p className="text-gray-400 text-lg">Illuminate your progress with detailed insights 📊</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Total Activities</p>
                  <p className="text-2xl font-bold text-white">{activities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-teal-600 border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Total Points</p>
                  <p className="text-2xl font-bold text-white">{getTotalPoints()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">This Week</p>
                  <p className="text-2xl font-bold text-white">
                    {activities.filter(a => {
                      const activityDate = new Date(a.date);
                      const weekStart = startOfWeek(new Date());
                      return activityDate >= weekStart;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-red-600 border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Avg/Week</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(activities.length / 4) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-[#2f3136] border-[#40444b]">
            <CardHeader>
              <CardTitle className="text-white">Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getWeeklyData()}>
                    <XAxis 
                      dataKey="week" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                        padding: '8px'
                      }}
                      cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
                      offset={10}
                    />
                    <Bar dataKey="food" stackId="a" fill="#10b981" />
                    <Bar dataKey="study" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="sleep" stackId="a" fill="#8b5cf6" />
                    <Bar dataKey="social" stackId="a" fill="#ec4899" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2f3136] border-[#40444b]">
            <CardHeader>
              <CardTitle className="text-white">Activity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getTypeDistribution()}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {getTypeDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
