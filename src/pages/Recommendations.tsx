
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowUp, Music } from "lucide-react";
import { toast } from "sonner";

interface Song {
  trackName: string;
  artistName: string;
  valence: number;
  energy: number;
  spotifyId?: string;
}

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { sentiment, moodText } = location.state || {};

  useEffect(() => {
    if (!sentiment) {
      navigate("/");
      return;
    }

    // Generate mock playlist based on sentiment
    generatePlaylist();
  }, [sentiment, navigate]);

  const generatePlaylist = () => {
    setIsLoading(true);
    
    // Mock playlist generation with gradual valence increase
    setTimeout(() => {
      const mockSongs: Song[] = [
        { trackName: "Khamaaj", artistName: "Shafqat Amanat Ali", valence: 0.22, energy: 0.35 },
        { trackName: "Breathe Me", artistName: "Sia", valence: 0.28, energy: 0.40 },
        { trackName: "Mad World", artistName: "Gary Jules", valence: 0.35, energy: 0.45 },
        { trackName: "Skinny Love", artistName: "Bon Iver", valence: 0.42, energy: 0.52 },
        { trackName: "Holocene", artistName: "Bon Iver", valence: 0.48, energy: 0.58 },
        { trackName: "Vienna", artistName: "Billy Joel", valence: 0.55, energy: 0.62 },
        { trackName: "Don't Stop Believin'", artistName: "Journey", valence: 0.65, energy: 0.70 },
        { trackName: "Good as Hell", artistName: "Lizzo", valence: 0.72, energy: 0.78 },
        { trackName: "Uptown Funk", artistName: "Mark Ronson ft. Bruno Mars", valence: 0.80, energy: 0.85 },
        { trackName: "Dancing Queen", artistName: "ABBA", valence: 0.88, energy: 0.90 }
      ];

      setPlaylist(mockSongs);
      setIsLoading(false);
      toast.success("Your personalized playlist is ready!");
    }, 1500);
  };

  const getValenceColor = (valence: number) => {
    if (valence < 0.3) return "bg-blue-400";
    if (valence < 0.5) return "bg-indigo-400";
    if (valence < 0.7) return "bg-green-400";
    return "bg-emerald-400";
  };

  const getEnergyColor = (energy: number) => {
    if (energy < 0.3) return "bg-purple-400";
    if (energy < 0.5) return "bg-pink-400";
    if (energy < 0.7) return "bg-orange-400";
    return "bg-red-400";
  };

  const getMoodEmoji = (valence: number) => {
    if (valence < 0.3) return "😔";
    if (valence < 0.5) return "😐";
    if (valence < 0.7) return "🙂";
    return "😊";
  };

  if (!sentiment) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-sarang-purple">
          Your Personalized Playlist
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on your mood analysis, we've created a therapeutic playlist that gradually uplifts your spirits
        </p>
      </div>

      {/* Mood Summary */}
      <Card className="mood-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Your Mood Analysis</span>
            <Badge variant="secondary" className="bg-sarang-lavender text-sarang-purple">
              {sentiment.label}
            </Badge>
          </CardTitle>
          <CardDescription>
            "{moodText?.slice(0, 100)}..."
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Sentiment Score</span>
                <span>{sentiment.score.toFixed(2)}</span>
              </div>
              <Progress value={(sentiment.score + 1) * 50} className="h-2" />
            </div>
            <div className="text-sm text-gray-600">
              {Math.round(sentiment.confidence * 100)}% confidence
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Playlist */}
      {isLoading ? (
        <Card className="mood-card">
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sarang-purple"></div>
              <p className="text-gray-600">Curating your perfect playlist...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-sarang-purple">
              Therapeutic Journey ({playlist.length} songs)
            </h2>
            <Button className="bg-sarang-purple hover:bg-sarang-purple/90">
              <Music className="w-4 h-4 mr-2" />
              Export to Spotify
            </Button>
          </div>

          <div className="grid gap-4">
            {playlist.map((song, index) => (
              <Card key={index} className="mood-card hover:scale-[1.02] transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-sarang-lavender to-sarang-purple rounded-full text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {song.trackName}
                        </h3>
                        <p className="text-gray-600">{song.artistName}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Mood indicators */}
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getMoodEmoji(song.valence)}</span>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500 w-12">Joy:</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getValenceColor(song.valence)}`}
                                style={{ width: `${song.valence * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{Math.round(song.valence * 100)}%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500 w-12">Energy:</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getEnergyColor(song.energy)}`}
                                style={{ width: `${song.energy * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{Math.round(song.energy * 100)}%</span>
                          </div>
                        </div>
                      </div>

                      <Button size="sm" className="bg-sarang-purple hover:bg-sarang-purple/90">
                        <Play className="w-4 h-4 mr-1" />
                        Play
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Uplift Visualization */}
          <Card className="mood-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowUp className="w-5 h-5 text-sarang-purple" />
                <span>Mood Journey</span>
              </CardTitle>
              <CardDescription>
                Watch how this playlist gradually uplifts your mood using music therapy principles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Starting Mood: {Math.round(playlist[0]?.valence * 100)}% Joy</span>
                  <span>Ending Mood: {Math.round(playlist[playlist.length - 1]?.valence * 100)}% Joy</span>
                </div>
                <Progress 
                  value={((playlist[playlist.length - 1]?.valence - playlist[0]?.valence) + 1) * 50} 
                  className="h-4"
                />
                <p className="text-sm text-gray-600 text-center">
                  This playlist increases your joy level by {Math.round((playlist[playlist.length - 1]?.valence - playlist[0]?.valence) * 100)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
