
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeadphonesIcon } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { useApp } from '@/contexts/AppContext'

export const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, dataSource } = useApp()

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/recommendations", label: "Discover" },
    { path: "/mood-history", label: "History" },
    { path: "/about", label: "About" },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
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
                className={`text-sm font-medium transition-all duration-200 hover:text-sarang-purple relative ${
                  location.pathname === item.path
                    ? "text-sarang-purple"
                    : "text-gray-600"
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-sarang-purple to-sarang-periwinkle rounded-full" />
                )}
              </Link>
            ))}
            
            <SignedOut>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-sarang-purple to-sarang-periwinkle hover:from-sarang-purple/90 hover:to-sarang-periwinkle/90 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 hover:shadow-lg">
                  Sign In
                </Button>
              </Link>
            </SignedOut>
            
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};
