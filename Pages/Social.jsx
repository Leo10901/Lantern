
import React, { useState, useEffect } from "react";
import { User, Activity, Story, Friendship } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus, Image } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import StoryBubbles from "../components/social/StoryBubbles";
import ActivityPost from "../Components/social/ActivityPost.jsx";
import FriendManager from "../components/social/FriendManager";
import CreateStoryModal from "../Components/social/CreateStoryModal.jsx/index.js";

export default function SocialPage() {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friendActivities, setFriendActivities] = useState([]);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const userFriends = await Friendship.filter({ 
        created_by: currentUser.email, 
        status: 'accepted' 
      });
      setFriends(userFriends);

      if (userFriends.length > 0) {
        const friendEmails = userFriends.map(f => f.friend_email);
        const [activities, friendStories] = await Promise.all([
          Activity.list('-created_date', 20),
          Story.list('-created_date', 20)
        ]);
        
        // Filter to only show friend activities
        const filteredActivities = activities.filter(a => 
          friendEmails.includes(a.created_by)
        );
        const filteredStories = friendStories.filter(s => 
          friendEmails.includes(s.created_by)
        );
        
        setFriendActivities(filteredActivities);
        setStories(filteredStories);
      }
    } catch (error) {
      console.error("Error loading social data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onStoryCreated = () => {
    setIsStoryModalOpen(false);
    loadSocialData();
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Social Feed</h1>
            <p className="text-gray-400 mt-1">Share your light with friends 🏮</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isStoryModalOpen} onOpenChange={setIsStoryModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Story
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1a1a] border-[#40444b] text-white">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-purple-400" />
                    Create a new Story
                  </DialogTitle>
                </DialogHeader>
                <CreateStoryModal user={user} onStoryCreated={onStoryCreated} />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-[#2f3136] border-[#40444b] hover:bg-[#40444b]">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Manage Friends
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1a1a] border-[#40444b] text-white">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-purple-400" />
                    Manage Friends
                  </DialogTitle>
                </DialogHeader>
                <FriendManager currentUser={user} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stories */}
        <div className="mb-8">
          <StoryBubbles 
            stories={stories} 
            currentUser={user} 
            onAddStory={() => setIsStoryModalOpen(true)} 
          />
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading feed...</p>
            </div>
          ) : friendActivities.length > 0 ? (
            friendActivities.map(activity => (
              <ActivityPost key={activity.id} activity={activity} />
            ))
          ) : (
            <div className="text-center py-16 bg-[#2f3136] rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-2">It's quiet here...</h3>
              <p className="text-gray-400 mb-4">Add some friends to see their progress and cheer them on!</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Find Friends
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1a1a1a] border-[#40444b] text-white">
                  <DialogHeader>
                    <DialogTitle>Find Friends</DialogTitle>
                  </DialogHeader>
                  <FriendManager currentUser={user} />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
