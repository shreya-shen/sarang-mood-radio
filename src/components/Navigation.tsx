
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeadphonesIcon, Music } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { useApp } from '@/contexts/AppContext'

export const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, dataSource } = useApp()

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/recommendations", label: "Playlists" },
    { path: "/mood-history", label: "My Mood" },
    { path: "/settings", label: "Settings" },
    { path: "/about", label: "About" },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-sarang-lavender/30 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-sarang-lavender to-sarang-purple rounded-lg">
              <HeadphonesIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-sarang-purple">Sarang</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-sarang-purple ${
                  location.pathname === item.path
                    ? "text-sarang-purple border-b-2 border-sarang-purple pb-1"
                    : "text-gray-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Auth buttons based on data source */}
            {dataSource === 'mock' && (
              <Button className="bg-sarang-purple hover:bg-sarang-purple/90">
                Sign In
              </Button>
            )}
            
            {dataSource === 'supabase' && !isAuthenticated && (
              <Button className="bg-sarang-purple hover:bg-sarang-purple/90">
                Sign In
              </Button>
            )}
            
            {dataSource === 'external' && !isAuthenticated && (
              <Button className="bg-sarang-purple hover:bg-sarang-purple/90">
                Sign In
              </Button>
            )}

            {/* Clerk authentication */}
            <SignedOut>
              <SignInButton>
                <Button className="bg-sarang-purple hover:bg-sarang-purple/90">
                  Sign In with Clerk
                </Button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Music className="h-6 w-6 text-sarang-purple" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-sarang-lavender/30">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block py-2 text-sm font-medium transition-colors hover:text-sarang-purple ${
                  location.pathname === item.path
                    ? "text-sarang-purple"
                    : "text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <SignedOut>
              <SignInButton>
                <Button className="mt-2 w-full bg-sarang-purple hover:bg-sarang-purple/90">
                  Sign In with Clerk
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        )}
      </div>
    </nav>
  );
};
