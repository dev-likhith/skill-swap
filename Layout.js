import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  Home,
  Video,
  BookOpen,
  Award,
  Wallet,
  Settings,
  LogOut,
  ShieldCheck,
  GraduationCap,
  Coins
} from "lucide-react";
import ProviderEarningsProcessor from "@/pages/ProviderEarnings";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const isAdmin = user?.role === 'admin';

  const learnerNav = [
    { title: "Marketplace", url: createPageUrl("Marketplace"), icon: Home },
    { title: "My Learning", url: createPageUrl("MyLearning"), icon: BookOpen },
  ];

  const providerNav = [
    { title: "My Courses", url: createPageUrl("TeachDashboard"), icon: Video },
  ];

  const commonNav = [
    { title: "Profile", url: createPageUrl("Profile"), icon: Settings },
  ];

  const adminNav = [
    { title: "Admin Panel", url: createPageUrl("AdminPanel"), icon: ShieldCheck },
  ];

  const navigation = [
    ...learnerNav,
    ...providerNav,
    ...commonNav,
    ...(isAdmin ? adminNav : [])
  ];

  const handleLogout = () => {
    base44.auth.logout(createPageUrl("Marketplace"));
  };

  return (
    <SidebarProvider>
      <ProviderEarningsProcessor />
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <Sidebar className="border-r border-orange-100 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-orange-100 p-6">
            <Link to={createPageUrl("Marketplace")} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900">Skill-Time</h2>
                <p className="text-xs text-orange-600">Learn & Earn</p>
              </div>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            {user && (
              <div className="mb-4 p-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium opacity-90">Wallet Balance</span>
                  <Coins className="w-4 h-4 opacity-90" />
                </div>
                <div className="text-2xl font-bold">{user.wallet_credits || 0}</div>
                <div className="text-xs opacity-75 mt-1">Credits Available</div>
              </div>
            )}

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-orange-800 uppercase tracking-wider px-2 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 rounded-lg mb-1 ${
                          location.pathname === item.url ? 'bg-orange-100 text-orange-700 font-medium shadow-sm' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {user?.verified_provider && (
              <SidebarGroup>
                <div className="px-3 py-2 mt-2">
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Award className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Verified Provider</span>
                  </div>
                </div>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-orange-100 p-4">
            <div className="space-y-3">
              {user && (
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.full_name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{user.full_name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 px-6 py-4 lg:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-orange-50 p-2 rounded-lg transition-colors" />
              <h1 className="text-xl font-bold text-gray-900">Skill-Time Marketplace</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}