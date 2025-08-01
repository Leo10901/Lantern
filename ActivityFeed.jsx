import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, BookOpen, Moon, Users, Clock, Star } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

export default function ActivityFeed({ activities }) {
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
      food: 'bg-green-600',
      study: 'bg-blue-600',
      sleep: 'bg-purple-600',
      social: 'bg-pink-600'
    };
    return colors[type] || 'bg-gray-600';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  };

  return (
    <Card className="bg-[#2f3136] border-[#40444b]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Clock className="w-5 h-5 text-purple-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#40444b] rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400">No activities yet</p>
            <p className="text-sm text-gray-500">Start tracking to see your progress!</p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = getTypeIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-[#40444b]/50 hover:bg-[#40444b] transition-colors">
                <div className={`p-2 ${getTypeColor(activity.type)} rounded-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-white truncate">{activity.title}</p>
                    <Badge variant="outline" className="text-xs bg-[#2f3136] border-[#40444b] text-gray-300">
                      {formatDate(activity.date)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    {activity.duration && (
                      <span>{activity.duration} {activity.type === 'sleep' ? 'hrs' : 'min'}</span>
                    )}
                    {activity.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{activity.rating}/5</span>
                      </div>
                    )}
                    {activity.points_earned > 0 && (
                      <Badge className="bg-yellow-600 text-white text-xs">
                        +{activity.points_earned} pts
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}