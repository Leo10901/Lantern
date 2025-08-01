
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Home, BarChart3, Users, User as UserIcon, Plus, Bell } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import LoginPrompt from "./components/auth/LoginPrompt";
import Notifications from "./components/layout/Notifications";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Notification } from "@/entities/Notification";
import LanternIcon from "./components/icons/LanternIcon";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // checkUser is responsible for fetching the current user and setting the user and isLoading states.
  const checkUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // fetchUnreadCount is now responsible for fetching the user itself to get notifications.
  const fetchUnreadCount = async () => {
    try {
      const currentUser = await User.me(); // Fetch user within this function
      const notifications = await Notification.filter({
        recipient_email: currentUser.email,
        is_read: false,
      });
      setUnreadCount(notifications.length);
    } catch (error) {
      console.error("Failed to fetch notifications count", error);
      // If fetching fails (e.g., user is not logged in or session expired), set count to 0.
      setUnreadCount(0);
    }
  };

  // useEffect now calls checkUser once to initialize user state,
  // and fetchUnreadCount for initial count and then on an interval.
  useEffect(() => {
    checkUser(); // Ensure user authentication and state is set
    fetchUnreadCount(); // Fetch initial unread count
    const interval = setInterval(fetchUnreadCount, 60000); // Check for new notifications every minute
    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  const navigationItems = [
    { title: "Dashboard", url: createPageUrl("Dashboard"), icon: Home },
    { title: "Track Activity", url: createPageUrl("Track"), icon: Plus },
    { title: "Analytics", url: createPageUrl("Analytics"), icon: BarChart3 },
    { title: "Social", url: createPageUrl("Social"), icon: Users },
    { title: "Profile", url: createPageUrl("Profile"), icon: UserIcon },
  ];

  if (isLoading) {
    return (
      <div className="dark min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dark">
        <style>{`
            :root {
              --background: 26 26 26; --foreground: 229 231 235; --card: 47 49 54; --card-foreground: 229 231 235; --popover: 47 49 54; --popover-foreground: 229 231 235; --primary: 124 58 237; --primary-foreground: 255 255 255; --secondary: 64 68 75; --secondary-foreground: 229 231 235; --muted: 64 68 75; --muted-foreground: 156 163 175; --accent: 64 68 75; --accent-foreground: 229 231 235; --destructive: 239 68 68; --destructive-foreground: 255 255 255; --border: 64 68 75; --input: 47 49 54; --ring: 124 58 237;
            }
        `}</style>
        <LoginPrompt />
      </div>
    );
  }

  return (
    <div className="dark">
      <style>{`
          :root {
            --background: 26 26 26; --foreground: 229 231 235; --card: 47 49 54; --card-foreground: 229 231 235; --popover: 47 49 54; --popover-foreground: 229 231 235; --primary: 124 58 237; --primary-foreground: 255 255 255; --secondary: 64 68 75; --secondary-foreground: 229 231 235; --muted: 64 68 75; --muted-foreground: 156 163 175; --accent: 64 68 75; --accent-foreground: 229 231 235; --destructive: 239 68 68; --destructive-foreground: 255 255 255; --border: 64 68 75; --input: 47 49 54; --ring: 124 58 237;
          }
      `}</style>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#1a1a1a] text-gray-100">
          <Sidebar className="border-r border-[#40444b] bg-[#2f3136]">
            <SidebarHeader className="border-b border-[#40444b] p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <LanternIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg">Lantern</h2>
                  <p className="text-xs text-gray-400">Light your path forward</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="p-3">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-2">
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`rounded-lg px-3 py-2.5 transition-all duration-200 ${
                            location.pathname === item.url
                              ? 'bg-purple-600 text-white shadow-lg'
                              : 'text-gray-300 hover:bg-[#40444b] hover:text-white'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            {/* Notifications section */}
            <div className="p-4 mt-auto border-t border-[#40444b]">
              <Popover onOpenChange={(open) => !open && fetchUnreadCount()}>
                <PopoverTrigger asChild>
                  {/* Replaced original Button component (which was not imported) with a plain button as per outline. */}
                  <button className="w-full flex items-center justify-start gap-3 px-3 py-2 text-gray-300 hover:bg-[#40444b] hover:text-white rounded-lg transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="font-medium">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-[#1a1a1a] border-[#40444b] text-white p-0">
                  {/* Removed user prop from Notifications as it's not present in the outline's definition */}
                  <Notifications onReadAll={() => setUnreadCount(0)} />
                </PopoverContent>
              </Popover>
            </div>

          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className="bg-[#2f3136] border-b border-[#40444b] px-6 py-4 md:hidden">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-gray-300 hover:text-white hover:bg-[#40444b] p-2 rounded-lg transition-colors duration-200" />
                <h1 className="text-xl font-bold text-white">Lantern</h1>
              </div>
            </header>

            <div className="flex-1 overflow-auto bg-[#1a1a1a]">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
