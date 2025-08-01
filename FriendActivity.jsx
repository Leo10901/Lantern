import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function FriendActivity({ friends }) {
  return (
    <Card className="bg-[#2f3136] border-[#40444b]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="w-5 h-5 text-purple-400" />
          Friends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {friends.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#40444b] rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-4">No friends yet</p>
            <Link to={createPageUrl("Social")}>
              <Button variant="outline" size="sm" className="bg-purple-600 hover:bg-purple-700 border-purple-600 text-white">
                Add Friends
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#40444b]/50 hover:bg-[#40444b] transition-colors">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.friend_username}`} />
                  <AvatarFallback className="bg-purple-600 text-white">
                    {friend.friend_username?.[0]?.toUpperCase() || 'F'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-white">{friend.friend_username}</p>
                  <p className="text-sm text-gray-400">Online now</p>
                </div>
                <div className="text-right">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            ))}
            <Link to={createPageUrl("Social")} className="block">
              <Button variant="outline" className="w-full bg-[#40444b] hover:bg-[#4f535c] border-[#40444b] text-gray-300">
                View All Friends
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}