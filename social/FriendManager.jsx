import React, { useState, useEffect } from 'react';
import { User, Friendship, Notification } from '@/entities/all';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus, Search, Check, Clock } from 'lucide-react';

export default function FriendManager({ currentUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadFriends();
    }
  }, [currentUser]);

  const loadFriends = async () => {
    try {
      const existingFriends = await Friendship.filter({ created_by: currentUser.email });
      setFriends(existingFriends);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const results = await User.filter({ email: searchQuery.trim() });
      const filteredResults = results.filter(u => u.email !== currentUser.email);
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendFriendRequest = async (targetUser) => {
    try {
      const newFriendship = await Friendship.create({
        friend_email: targetUser.email,
        friend_username: targetUser.username || targetUser.email.split('@')[0],
        status: 'pending'
      });

      await Notification.create({
        recipient_email: targetUser.email,
        sender_username: currentUser.username || currentUser.email.split('@')[0],
        sender_avatar: currentUser.avatar_url || '',
        type: 'friend_request',
        message: 'sent you a friend request.',
        related_id: newFriendship.id
      });
      
      loadFriends();
    } catch(error) {
      console.error("Failed to send friend request:", error);
    }
  };

  const getFriendStatus = (userEmail) => {
    const friend = friends.find(f => f.friend_email === userEmail);
    if (!friend) return 'none';
    return friend.status;
  };

  return (
    <div className="p-1">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input 
          type="email"
          placeholder="Search by user's email"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-[#40444b] border-[#40444b] text-white placeholder-gray-400"
        />
        <Button 
          type="submit" 
          variant="outline" 
          className="bg-purple-600 hover:bg-purple-700 border-none" 
          disabled={isLoading}
        >
          <Search className="w-4 h-4"/>
        </Button>
      </form>
      
      <div className="space-y-2">
        {isLoading && <p className="text-center text-gray-400">Searching...</p>}
        
        {searchResults.map(user => {
          const status = getFriendStatus(user.email);
          return (
            <div key={user.id} className="flex items-center justify-between p-2 bg-[#2f3136] rounded-lg">
              <p className="font-medium">{user.username || user.email.split('@')[0]}</p>
              {status === 'none' && (
                <Button size="sm" onClick={() => sendFriendRequest(user)}>
                  <UserPlus className="w-4 h-4 mr-2"/> Add
                </Button>
              )}
              {status === 'pending' && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" /> Pending
                </div>
              )}
              {status === 'accepted' && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <Check className="w-4 h-4" /> Friend
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
