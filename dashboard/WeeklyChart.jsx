import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";

export default function WeeklyChart({ activities }) {
  const getWeekData = () => {
    const weekStart = startOfWeek(new Date());
    const weekData = [];

    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      const dayActivities = activities.filter(activity => 
        format(new Date(activity.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );

      const typeCount = {
        food: dayActivities.filter(a => a.type === 'food').length,
        study: dayActivities.filter(a => a.type === 'study').length,
        sleep: dayActivities.filter(a => a.type === 'sleep').length,
        social: dayActivities.filter(a => a.type === 'social').length,
      };

      weekData.push({
        day: format(date, 'EEE'),
        date: format(date, 'MM/dd'),
        total: dayActivities.length,
        ...typeCount
      });
    }

    return weekData;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2f3136] border border-[#40444b] rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry) => (
              <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
                {entry.dataKey}: {entry.value} activities
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-[#2f3136] border-[#40444b]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          Weekly Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getWeekData()}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="food" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="study" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="sleep" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="social" stackId="a" fill="#ec4899" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Food</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Study</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Sleep</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Social</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
