
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Music, User, Bell, Download, Link as LinkIcon, Unlink } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [spotifyLinked, setSpotifyLinked] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoExport, setAutoExport] = useState(false);

  const handleSpotifyConnect = () => {
    if (spotifyLinked) {
      setSpotifyLinked(false);
      toast.success("Spotify account disconnected");
    } else {
      // In real app, this would initiate OAuth flow
      toast.info("Redirecting to Spotify for authorization...");
      setTimeout(() => {
        setSpotifyLinked(true);
        toast.success("Spotify account connected successfully!");
      }, 2000);
    }
  };

  const handleImportLikedSongs = () => {
    if (!spotifyLinked) {
      toast.error("Please connect your Spotify account first");
      return;
    }
    toast.info("Importing your liked songs...");
    setTimeout(() => {
      toast.success("Successfully imported 247 liked songs!");
    }, 3000);
  };

  const handleExportData = () => {
    toast.info("Preparing your data export...");
    setTimeout(() => {
      toast.success("Data export ready for download!");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-sarang-purple">
          Settings
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Manage your account, preferences, and integrations
        </p>
      </div>

      {/* Profile Section */}
      <Card className="mood-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-sarang-purple" />
            <span>Profile</span>
          </CardTitle>
          <CardDescription>
            Your account information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">Account Status</h3>
              <p className="text-sm text-gray-600">You're currently using Sarang as a guest</p>
            </div>
            <Button className="bg-sarang-purple hover:bg-sarang-purple/90">
              Create Account
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">Daily Mood Reminders</h3>
              <p className="text-sm text-gray-600">Get gentle reminders to check in with your mood</p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Spotify Integration */}
      <Card className="mood-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Music className="w-5 h-5 text-sarang-purple" />
            <span>Spotify Integration</span>
          </CardTitle>
          <CardDescription>
            Connect your Spotify account for enhanced music therapy experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-800">Spotify Account</h3>
                {spotifyLinked ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary">Not Connected</Badge>
                )}
              </div>
            </div>
            <Button
              onClick={handleSpotifyConnect}
              variant={spotifyLinked ? "outline" : "default"}
              className={spotifyLinked ? "border-red-200 text-red-600 hover:bg-red-50" : "bg-sarang-purple hover:bg-sarang-purple/90"}
            >
              {spotifyLinked ? (
                <>
                  <Unlink className="w-4 h-4 mr-2" />
                  Disconnect
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Connect Spotify
                </>
              )}
            </Button>
          </div>

          {spotifyLinked && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">Connected as: music_lover_2024</span>
                </div>
                <p className="text-sm text-green-700">
                  Your Spotify account is connected and ready to use. You can now import your liked songs and export playlists directly to Spotify.
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Import Liked Songs</h3>
                    <p className="text-sm text-gray-600">Use your favorite songs for better personalization</p>
                  </div>
                  <Button
                    onClick={handleImportLikedSongs}
                    variant="outline"
                    className="border-sarang-lavender text-sarang-purple hover:bg-sarang-lavender/20"
                  >
                    Import Songs
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Auto-Export Playlists</h3>
                    <p className="text-sm text-gray-600">Automatically save Sarang playlists to your Spotify</p>
                  </div>
                  <Switch
                    checked={autoExport}
                    onCheckedChange={setAutoExport}
                  />
                </div>
              </div>
            </>
          )}

          {!spotifyLinked && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Why connect Spotify?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Import your liked songs for better recommendations</li>
                <li>• Export Sarang playlists directly to your account</li>
                <li>• Play songs directly within the app</li>
                <li>• Access your personal music preferences</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card className="mood-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-sarang-purple" />
            <span>Data & Privacy</span>
          </CardTitle>
          <CardDescription>
            Manage your data and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">Export My Data</h3>
              <p className="text-sm text-gray-600">Download all your mood logs and playlist history</p>
            </div>
            <Button
              onClick={handleExportData}
              variant="outline"
              className="border-sarang-lavender text-sarang-purple hover:bg-sarang-lavender/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">Privacy Preferences</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Your mood data is encrypted and stored securely</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>We never share your personal information with third parties</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>All AI analysis is processed anonymously</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="mood-card">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Get support or learn more about Sarang
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="border-sarang-lavender text-sarang-purple hover:bg-sarang-lavender/20">
              Contact Support
            </Button>
            <Button variant="outline" className="border-sarang-lavender text-sarang-purple hover:bg-sarang-lavender/20">
              View Tutorial
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
