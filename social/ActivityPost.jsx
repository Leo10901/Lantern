
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Utensils, BookOpen, Moon, Users, Star, Heart, MessageSquare, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityPost({ activity }) {
  const user = {
    username: activity.created_by.split('@')[0],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.created_by.split('@')[0]}`
  };

  const activityIcons = {
    food: Utensils,
    study: BookOpen,
    sleep: Moon,
    social: Users,
  };

  const Icon = activityIcons[activity.type] || Star;

  return (
    <Card className="bg-[#2f3136] border-[#40444b] text-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar>
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{user.username}</p>
          <p className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(activity.created_date), { addSuffix: true })}
          </p>
        </div>
        <Badge className="capitalize bg-purple-600/50 text-purple-300 border-purple-600">
          <Icon className="w-3 h-3 mr-1.5" />
          {activity.type}
        </Badge>
      </CardHeader>
      
      <CardContent className="px-4 pb-4">
        <h3 className="text-lg font-semibold mb-2">{activity.title}</h3>
        {activity.notes && <p className="text-gray-300 mb-4">{activity.notes}</p>}
        
        <div className="flex flex-wrap gap-2">
          {activity.duration && (
            <Badge variant="secondary" className="bg-[#40444b]">
              Duration: {activity.duration} {activity.type === 'sleep' ? 'hrs' : 'min'}
            </Badge>
          )}
          {activity.calories && (
            <Badge variant="secondary" className="bg-[#40444b]">
              Calories: {activity.calories}
            </Badge>
          )}
          {activity.rating && (
            <Badge variant="secondary" className="bg-[#40444b] flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/> 
              Rating: {activity.rating}/5
            </Badge>
          )}
          {activity.points_earned && (
            <Badge className="bg-yellow-500/80 text-white">
              +{activity.points_earned} Points
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 bg-[#40444b]/50 flex items-center gap-4">
        <button className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors">
          <Heart className="w-5 h-5"/> 
          <span className="text-sm">Light up</span>
        </button>
        <button className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors">
          <MessageSquare className="w-5 h-5"/>
          <span className="text-sm">Comment</span>
        </button>
        <button className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors ml-auto">
          <Send className="w-5 h-5"/>
          <span className="text-sm">Share</span>
        </button>
      </CardFooter>
    </Card>
  );
}
