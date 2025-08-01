import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StoryBubbles({ stories, currentUser, onAddStory }) {
  const userStories = stories.reduce((acc, story) => {
    const username = story.user_username;
    if (!acc[username]) {
      acc[username] = {
        username: story.user_username,
        avatar: story.user_avatar,
        stories: [],
      };
    }
    acc[username].stories.push(story);
    return acc;
  }, {});
  
  const storiesByUsers = Object.values(userStories);

  return (
    <div className="flex items-center gap-4 p-4 bg-[#2f3136] rounded-xl overflow-x-auto">
      <motion.div 
        whileTap={{ scale: 0.95 }} 
        className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0" 
        onClick={onAddStory}
      >
        <div className="w-16 h-16 rounded-full bg-[#40444b] border-2 border-dashed border-gray-500 flex items-center justify-center hover:border-purple-500 transition-colors">
          <Plus className="w-6 h-6 text-gray-400"/>
        </div>
        <p className="text-xs font-medium text-white">Your Story</p>
      </motion.div>

      {storiesByUsers.map((user, index) => (
        <motion.div
          key={user.username}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0"
        >
          <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
            <Avatar className="w-full h-full border-2 border-[#2f3136]">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <p className="text-xs font-medium text-white truncate max-w-[60px]">{user.username}</p>
        </motion.div>
      ))}
    </div>
  );
}