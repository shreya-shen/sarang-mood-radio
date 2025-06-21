
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, Mail } from "lucide-react";
import { supabaseService } from '@/services/supabase';
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSpotifySignIn = async () => {
    try {
      setLoading(true);
      // This will redirect to Spotify OAuth
      const { error } = await supabaseService.signInWithSpotify();
      if (error) {
        toast.error("Error connecting to Spotify");
      }
    } catch (error) {
      toast.error("Error connecting to Spotify");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      if (isSignUp) {
        const { data, error } = await supabaseService.signUp(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Check your email for verification link");
        }
      } else {
        const { data, error } = await supabaseService.signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Signed in successfully!");
          navigate("/");
        }
      }
    } catch (error) {
      toast.error("Authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/db55ce61-da39-4838-a1cf-c1dc1a8e6c03.png" 
              alt="Sarang Logo" 
              className="h-16 w-16"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sarang-purple to-sarang-periwinkle bg-clip-text text-transparent">
              Welcome to Sarang
            </h1>
            <p className="text-gray-600 mt-2">
              Discover music that matches your mood
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-800">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? "Join Sarang to start your musical journey" 
                : "Sign in to continue your musical experience"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Spotify Sign In Button */}
            <Button 
              onClick={handleSpotifySignIn}
              disabled={loading}
              className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200"
            >
              <Music className="w-5 h-5" />
              <span>Continue with Spotify</span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Email Sign In */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-200 focus:border-sarang-purple focus:ring-sarang-purple"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-200 focus:border-sarang-purple focus:ring-sarang-purple"
                  disabled={loading}
                />
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sarang-purple to-sarang-periwinkle hover:from-sarang-purple/90 hover:to-sarang-periwinkle/90 text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                  </>
                )}
              </Button>
            </form>

            {/* Toggle Sign Up/Sign In */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-1 text-sarang-purple hover:text-sarang-purple/80 font-medium transition-colors"
                  disabled={loading}
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Image */}
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/de3fc65c-c2ca-42f1-a9cc-34ce166c8c51.png" 
            alt="Music Community" 
            className="h-32 w-auto opacity-80"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
