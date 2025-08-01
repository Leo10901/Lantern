
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Utensils, BookOpen, Moon, Users, Target } from "lucide-react";

export default function DailyGoals({ activities, goals }) {
  const defaultGoals = {
    study_minutes: 60,
    sleep_hours: 8,
    social_minutes: 30,
    meals_count: 3,
    ...goals
  };

  const getProgress = (type) => {
    const typeActivities = activities.filter(a => a.type === type);
    
    switch (type) {
      case 'study':
        const studyMinutes = typeActivities.reduce((sum, a) => sum + (a.duration || 0), 0);
        return Math.min(100, (studyMinutes / defaultGoals.study_minutes) * 100);
      
      case 'sleep':
        const sleepHours = typeActivities.reduce((sum, a) => sum + (a.duration || 0), 0);
        return Math.min(100, (sleepHours / defaultGoals.sleep_hours) * 100);
      
      case 'social':
        const socialMinutes = typeActivities.reduce((sum, a) => sum + (a.duration || 0), 0);
        return Math.min(100, (socialMinutes / defaultGoals.social_minutes) * 100);
      
      case 'food':
        return Math.min(100, (typeActivities.length / defaultGoals.meals_count) * 100);
      
      default:
        return 0;
    }
  };

  const goalItems = [
    {
      type: 'study',
      icon: BookOpen,
      title: 'Study Time',
      target: `${defaultGoals.study_minutes} min`,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      type: 'sleep',
      icon: Moon,
      title: 'Sleep',
      target: `${defaultGoals.sleep_hours} hours`,
      color: 'from-purple-500 to-violet-600'
    },
    {
      type: 'social',
      icon: Users,
      title: 'Social Time',
      target: `${defaultGoals.social_minutes} min`,
      color: 'from-pink-500 to-rose-600'
    },
    {
      type: 'food',
      icon: Utensils,
      title: 'Meals',
      target: `${defaultGoals.meals_count} meals`,
      color: 'from-green-500 to-emerald-600'
    }
  ];

  return (
    <Card className="bg-[#2f3136] border-[#40444b]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Target className="w-5 h-5 text-purple-400" />
          Today's Goals
          <span className="text-sm font-normal text-gray-400 ml-2">🏮 Light your path</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {goalItems.map((goal) => {
          const progress = getProgress(goal.type);
          const isCompleted = progress >= 100;
          
          return (
            <div key={goal.type} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-r ${goal.color} rounded-lg bg-opacity-20`}>
                    <goal.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{goal.title}</p>
                    <p className="text-sm text-gray-400">Target: {goal.target}</p>
                  </div>
                </div>
                {isCompleted && (
                  <Badge className="bg-green-600 text-white">
                    Complete! 🎉
                  </Badge>
                )}
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-[#40444b]"
              />
              <p className="text-xs text-gray-400 text-right">
                {Math.round(progress)}% complete
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}