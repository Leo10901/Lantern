
import React, { useState, useEffect } from "react";
import { User, Activity } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Settings, User as UserIcon, LogOut, Edit } from "lucide-react";
import { UploadFile } from "@/integrations/Core";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const currentUser = await User.me();
      const userActivities = await Activity.filter({ created_by: currentUser.email }, '-created_date', 10);
      
      setUser(currentUser);
      setActivities(userActivities);
      setFormData({
        username: currentUser.username || '',
        bio: currentUser.bio || '',
        daily_goals: currentUser.daily_goals || {
          study_minutes: 60,
          sleep_hours: 8,
          social_minutes: 30,
          meals_count: 3
        }
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const { file_url } = await UploadFile({ file });
      await User.updateMyUserData({ avatar_url: file_url });
      setUser({ ...user, avatar_url: file_url });
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    try {
      await User.updateMyUserData(formData);
      setUser({ ...user, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = async () => {
    await User.logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="bg-[#2f3136] border-[#40444b]">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                  <AvatarFallback className="bg-purple-600 text-white text-2xl">
                    {user?.full_name?.[0] || user?.email?.[0]}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="photo-upload" 
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors"
                >
                  {isUploadingPhoto ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Edit className="w-4 h-4 text-white" />
                  )}
                </label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user?.full_name || 'Lantern User'}
                </h1>
                <p className="text-gray-400 mb-4">
                  @{user?.username || user?.email?.split('@')[0]} • {user?.email}
                </p>
                <p className="text-gray-300">
                  {user?.bio || 'Lighting the path to better habits, one step at a time! 🏮'}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-[#40444b] border-[#40444b] hover:bg-[#4f535c]"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 border-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        {isEditing && (
          <Card className="bg-[#2f3136] border-[#40444b]">
            <CardHeader>
              <CardTitle className="text-white">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-white font-medium mb-2 block">Username</label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Choose a username"
                  className="bg-[#40444b] border-[#40444b] text-white"
                />
              </div>
              
              <div>
                <label className="text-white font-medium mb-2 block">Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  className="bg-[#40444b] border-[#40444b] text-white h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-medium mb-2 block">Study Goal (min/day)</label>
                  <Input
                    type="number"
                    value={formData.daily_goals?.study_minutes || 60}
                    onChange={(e) => setFormData({
                      ...formData, 
                      daily_goals: {...formData.daily_goals, study_minutes: parseInt(e.target.value)}
                    })}
                    className="bg-[#40444b] border-[#40444b] text-white"
                  />
                </div>
                <div>
                  <label className="text-white font-medium mb-2 block">Sleep Goal (hours/night)</label>
                  <Input
                    type="number"
                    value={formData.daily_goals?.sleep_hours || 8}
                    onChange={(e) => setFormData({
                      ...formData, 
                      daily_goals: {...formData.daily_goals, sleep_hours: parseInt(e.target.value)}
                    })}
                    className="bg-[#40444b] border-[#40444b] text-white"
                  />
                </div>
              </div>

              <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 border-none">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white/80 text-sm">Total Points</p>
              <p className="text-2xl font-bold text-white">{user?.total_points || 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-teal-500 border-none">
            <CardContent className="p-6 text-center">
              <UserIcon className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white/80 text-sm">Current Streak</p>
              <p className="text-2xl font-bold text-white">{user?.current_streak || 0} days</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-none">
            <CardContent className="p-6 text-center">
              <Settings className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white/80 text-sm">Activities Logged</p>
              <p className="text-2xl font-bold text-white">{activities.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-[#2f3136] border-[#40444b]">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-[#40444b]/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{activity.title}</p>
                      <p className="text-sm text-gray-400 capitalize">{activity.type}</p>
                    </div>
                    <Badge className="bg-purple-600">+{activity.points_earned || 0} pts</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No activities logged yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
