
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Home = () => {
  const [moodText, setMoodText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentiment, setSentiment] = useState<{
    score: number;
    label: string;
    confidence: number;
  } | null>(null);
  const navigate = useNavigate();

  const handleAnalyzeMood = async () => {
    if (!moodText.trim()) {
      toast.error("Please describe how you're feeling");
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const mockSentiments = [
        { score: -0.7, label: "Low", confidence: 0.85 },
        { score: -0.3, label: "Calm", confidence: 0.78 },
        { score: 0.1, label: "Neutral", confidence: 0.82 },
        { score: 0.5, label: "Happy", confidence: 0.91 },
        { score: 0.8, label: "Excited", confidence: 0.87 }
      ];
      
      const randomSentiment = mockSentiments[Math.floor(Math.random() * mockSentiments.length)];
      setSentiment(randomSentiment);
      setIsAnalyzing(false);
      
      toast.success("Mood analyzed successfully!");
    }, 2000);
  };

  const handleGetRecommendations = () => {
    if (sentiment) {
      navigate("/recommendations", { state: { sentiment, moodText } });
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/683c065d-86de-4501-9731-47c93b32d544.png" 
                alt="Music Therapy" 
                className="h-48 w-auto"
              />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Unleash Your{" "}
                <span className="bg-gradient-to-r from-sarang-purple to-sarang-periwinkle bg-clip-text text-transparent">
                  Emotions
                </span>
                ,<br />
                Ignite Your{" "}
                <span className="bg-gradient-to-r from-sarang-periwinkle to-sarang-lavender bg-clip-text text-transparent">
                  Mind!
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Discover the revolutionary music therapy app that redefines the way 
                you experience emotional healing through personalized soundscapes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-sarang-purple to-sarang-periwinkle hover:from-sarang-purple/90 hover:to-sarang-periwinkle/90 text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-200 hover:shadow-lg flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-sarang-purple text-sarang-purple hover:bg-sarang-purple hover:text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-200"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Mood Input Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-sarang-cream to-sarang-lavender/50 text-center py-8">
              <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center space-x-2">
                <Sparkles className="w-8 h-8 text-sarang-purple" />
                <span>Share Your Feelings</span>
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                Tell us how you're feeling today and let AI create your perfect playlist
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6">
              <Textarea
                placeholder="I'm feeling a bit overwhelmed today. Work has been stressful and I could use some calm, uplifting music to help me relax and find my center again..."
                value={moodText}
                onChange={(e) => setMoodText(e.target.value)}
                className="min-h-32 text-lg border-2 border-gray-200 focus:border-sarang-purple rounded-2xl p-4 resize-none"
                disabled={isAnalyzing}
              />
              
              <Button
                onClick={handleAnalyzeMood}
                disabled={isAnalyzing || !moodText.trim()}
                size="lg"
                className="w-full bg-gradient-to-r from-sarang-purple to-sarang-periwinkle hover:from-sarang-purple/90 hover:to-sarang-periwinkle/90 text-white py-4 rounded-2xl font-medium text-lg transition-all duration-200 hover:shadow-lg"
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Analyzing your emotions...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Analyze My Mood</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Sentiment Results */}
          {sentiment && (
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden animate-fade-in">
              <CardContent className="p-8 space-y-6">
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-800">Mood Analysis Complete</h3>
                    <div className="text-4xl font-bold">
                      Detected: <span className="bg-gradient-to-r from-sarang-purple to-sarang-periwinkle bg-clip-text text-transparent">{sentiment.label}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-w-md mx-auto">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Emotional Range</span>
                      <span>{sentiment.score.toFixed(2)}</span>
                    </div>
                    <Progress 
                      value={(sentiment.score + 1) * 50} 
                      className="h-3 bg-gray-200"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low Energy</span>
                      <span>Balanced</span>
                      <span>High Energy</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Confidence: {Math.round(sentiment.confidence * 100)}%
                    </div>
                  </div>

                  <Button
                    onClick={handleGetRecommendations}
                    size="lg"
                    className="bg-gradient-to-r from-sarang-lavender to-sarang-periwinkle hover:from-sarang-lavender/90 hover:to-sarang-periwinkle/90 text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-200 hover:shadow-lg flex items-center space-x-2"
                  >
                    <span>Discover Your Playlist</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Section inspired by your reference */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl text-center p-6">
              <div className="text-4xl font-bold text-sarang-purple mb-2">1000+</div>
              <div className="text-gray-600">Curated Playlists</div>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl text-center p-6">
              <div className="text-4xl font-bold text-sarang-periwinkle mb-2">50K+</div>
              <div className="text-gray-600">Happy Users</div>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl text-center p-6">
              <div className="text-4xl font-bold text-sarang-lavender mb-2">24/7</div>
              <div className="text-gray-600">Mood Support</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
