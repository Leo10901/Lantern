import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Save, Star, Utensils, BookOpen, Moon, Users } from "lucide-react";
import { format } from "date-fns";

export default function ActivityForm({ type, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    duration: type === 'sleep' ? 8 : type === 'study' ? 60 : 30,
    calories: 0,
    rating: 5,
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });

  const typeConfig = {
    food: {
      icon: Utensils,
      title: 'Food & Nutrition',
      color: 'from-green-500 to-emerald-600',
      fields: ['title', 'calories', 'rating', 'notes']
    },
    study: {
      icon: BookOpen,
      title: 'Study & Learning', 
      color: 'from-blue-500 to-indigo-600',
      fields: ['title', 'duration', 'rating', 'notes']
    },
    sleep: {
      icon: Moon,
      title: 'Sleep & Rest',
      color: 'from-purple-500 to-violet-600', 
      fields: ['title', 'duration', 'rating', 'notes']
    },
    social: {
      icon: Users,
      title: 'Social & Connection',
      color: 'from-pink-500 to-rose-600',
      fields: ['title', 'duration', 'rating', 'notes']
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderStarRating = () => (
    <div className="space-y-2">
      <Label className="text-white">How did it go?</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({...formData, rating: star})}
            className="transition-colors"
          >
            <Star 
              className={`w-6 h-6 ${
                star <= formData.rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-400'
              }`} 
            />
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-400">
        {formData.rating === 5 && "Amazing! +20 bonus points"}
        {formData.rating === 4 && "Great! +10 bonus points"}
        {formData.rating < 4 && "Keep going, you've got this!"}
      </p>
    </div>
  );

  return (
    <Card className="bg-[#2f3136] border-[#40444b]">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="text-gray-400 hover:text-white hover:bg-[#40444b]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-gradient-to-r ${config.color} rounded-xl`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-white">
              Log {config.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              {type === 'food' ? 'What did you eat?' : 
               type === 'study' ? 'What did you study?' :
               type === 'sleep' ? 'How was your sleep?' : 
               'Who did you spend time with?'}
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder={
                type === 'food' ? 'e.g., Chicken salad with vegetables' :
                type === 'study' ? 'e.g., JavaScript fundamentals' :
                type === 'sleep' ? 'e.g., Good night sleep' :
                'e.g., Coffee with friends'
              }
              className="bg-[#40444b] border-[#40444b] text-white placeholder-gray-400"
              required
            />
          </div>

          {config.fields.includes('duration') && (
            <div className="space-y-3">
              <Label className="text-white">
                Duration: {formData.duration} {type === 'sleep' ? 'hours' : 'minutes'}
              </Label>
              <Slider
                value={[formData.duration]}
                onValueChange={([value]) => setFormData({...formData, duration: value})}
                max={type === 'sleep' ? 12 : type === 'study' ? 180 : 120}
                min={type === 'sleep' ? 1 : 5}
                step={type === 'sleep' ? 0.5 : 5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>{type === 'sleep' ? '1 hour' : '5 min'}</span>
                <span>{type === 'sleep' ? '12 hours' : type === 'study' ? '3 hours' : '2 hours'}</span>
              </div>
            </div>
          )}

          {config.fields.includes('calories') && (
            <div className="space-y-2">
              <Label htmlFor="calories" className="text-white">Calories (optional)</Label>
              <Input
                id="calories"
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({...formData, calories: parseInt(e.target.value) || 0})}
                placeholder="e.g., 350"
                className="bg-[#40444b] border-[#40444b] text-white placeholder-gray-400"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="date" className="text-white">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="bg-[#40444b] border-[#40444b] text-white"
              required
            />
          </div>

          {renderStarRating()}

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Add any additional details..."
              className="bg-[#40444b] border-[#40444b] text-white placeholder-gray-400 h-24"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-[#40444b] hover:bg-[#4f535c] border-[#40444b] text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`flex-1 bg-gradient-to-r ${config.color} hover:opacity-90`}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Activity
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}