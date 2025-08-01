import React, { useState, useEffect } from 'react';
import { Notification, Friendship, User } from '@/entities/all';
import { Bell, UserPlus, Check, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';

export default function Notifications({ onReadAll }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const data = await Notification.filter({ 
        recipient_email: currentUser.email 
      }, "-created_date", 20);
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFriendRequest = async (notification, accepted) => {
    try {
      if (accepted) {
        // Create friendship for current user
        await Friendship.create({
          friend_email: notification.sender_username + '@example.com', // This is simplified
          friend_username: notification.sender_username,
          status: 'accepted'
        });
      }

      await Notification.update(notification.id, { is_read: true });
      fetchNotifications();
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
      await Promise.all(unreadIds.map(id => 
        Notification.update(id, { is_read: true })
      ));
      setNotifications(notifications.map(n => ({...n, is_read: true})));
      onReadAll();
    } catch (error) {
      console.error("Error marking all as read", error);
    }
  };

  return (
    <div>
      <div className="p-4 border-b border-[#40444b] flex justify-between items-center">
        <h3 className="font-semibold text-white">Notifications</h3>
        <Button 
          variant="link" 
          className="text-purple-400 p-0 h-auto" 
          onClick={markAllAsRead}
        >
          Mark all as read
        </Button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {isLoading && (
          <p className="p-4 text-center text-gray-400">Loading...</p>
        )}
        
        {!isLoading && notifications.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <Bell className="mx-auto w-10 h-10 mb-2" />
            <p>No new notifications</p>
          </div>
        )}
        
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`p-4 border-b border-[#40444b] ${!notification.is_read ? 'bg-purple-600/10' : ''}`}
          >
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={notification.sender_avatar} />
                <AvatarFallback className="bg-purple-600">
                  {notification.sender_username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <p className="text-sm text-gray-300">
                  <span className="font-bold text-white">{notification.sender_username}</span> {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(notification.created_date), { addSuffix: true })}
                </p>
              </div>
            </div>
            
            {notification.type === 'friend_request' && !notification.is_read && (
              <div className="mt-3 flex gap-2 justify-end">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-red-600 hover:bg-red-700 border-none" 
                  onClick={() => handleFriendRequest(notification, false)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-green-600 hover:bg-green-700 border-none" 
                  onClick={() => handleFriendRequest(notification, true)}
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
