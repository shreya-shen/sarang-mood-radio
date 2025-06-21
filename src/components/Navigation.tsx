
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeadphonesIcon, User, LogOut } from "lucide-react";
import { useApp } from '@/contexts/AppContext'
import { supabaseService } from '@/services/supabase'
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, dataSource } = useApp()

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/recommendations", label: "Discover" },
    { path: "/mood-history", label: "History" },
    { path: "/about", label: "About" },
  ];

  const handleSignOut = async () => {
    try {
      await supabaseService.signOut()
      toast.success("Signed out successfully")
      navigate("/")
      window.location.reload()
    } catch (error) {
      toast.error("Error signing out")
    }
  };

  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="/lovable-uploads/db55ce61-da39-4838-a1cf-c1dc1a8e6c03.png" 
                alt="Sarang Logo" 
                className="h-10 w-10"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-sarang-purple to-sarang-periwinkle bg-clip-text text-transparent">
              Sarang
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-all duration-200 hover:text-sarang-purple dark:hover:text-sarang-periwinkle relative ${
                  location.pathname === item.path
                    ? "text-sarang-purple dark:text-sarang-periwinkle"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-sarang-purple to-sarang-periwinkle rounded-full" />
                )}
              </Link>
            ))}
            
            <ThemeToggle />
            
            {!isAuthenticated ? (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-sarang-purple to-sarang-periwinkle hover:from-sarang-purple/90 hover:to-sarang-periwinkle/90 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 hover:shadow-lg">
                  Sign In
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.email || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        via {dataSource}
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
