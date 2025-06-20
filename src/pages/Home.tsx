
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HeadphonesIcon, ArrowUp } from "lucide-react";
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
    
    // Simulate API call for demo
    setTimeout(() => {
      // Mock sentiment analysis
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

  const getSentimentColor = (score: number) => {
    if (score < -0.5) return "bg-red-400";
    if (score < 0) return "bg-orange-400";
    if (score < 0.3) return "bg-yellow-400";
    if (score < 0.7) return "bg-green-400";
    return "bg-emerald-400";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-r from-sarang-lavender to-sarang-purple rounded-full">
            <HeadphonesIcon className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-sarang-purple">
          How are you feeling today?
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Share your thoughts and emotions. Sarang will analyze your mood and create a personalized playlist to help uplift your spirits using music therapy principles.
        </p>
      </div>

      {/* Mood Input Card */}
      <Card className="mood-card">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-sarang-purple">
            Express Your Feelings
          </CardTitle>
          <CardDescription className="text-center">
            Describe your current mood, emotions, or what's on your mind
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            placeholder="I'm feeling a bit overwhelmed today. Work has been stressful and I could use some calm, uplifting music to help me relax..."
            value={moodText}
            onChange={(e) => setMoodText(e.target.value)}
            className="min-h-32 text-base border-sarang-lavender/50 focus:border-sarang-purple"
            disabled={isAnalyzing}
          />
          
          <Button
            onClick={handleAnalyzeMood}
            disabled={isAnalyzing || !moodText.trim()}
            className="w-full bg-sarang-purple hover:bg-sarang-purple/90 text-lg py-6"
          >
            {isAnalyzing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing your mood...</span>
              </div>
            ) : (
              "Analyze My Mood"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Sentiment Results */}
      {sentiment && (
        <Card className="mood-card">
          <CardHeader>
            <CardTitle className="text-xl text-center text-sarang-purple">
              Mood Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-3xl font-bold text-gray-800">
                Detected Mood: <span className="text-sarang-purple">{sentiment.label}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Sentiment Score</span>
                  <span>{sentiment.score.toFixed(2)}</span>
                </div>
                <Progress 
                  value={(sentiment.score + 1) * 50} 
                  className="h-3"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Negative</span>
                  <span>Neutral</span>
                  <span>Positive</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <div className={`w-3 h-3 rounded-full ${getSentimentColor(sentiment.score)}`}></div>
                <span>Confidence: {Math.round(sentiment.confidence * 100)}%</span>
              </div>
            </div>

            <Button
              onClick={handleGetRecommendations}
              className="w-full bg-gradient-to-r from-sarang-lavender to-sarang-purple hover:from-sarang-lavender/90 hover:to-sarang-purple/90 text-lg py-6"
            >
              <ArrowUp className="w-5 h-5 mr-2" />
              Get My Personalized Playlist
            </Button>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Card className="mood-card text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-sarang-lavender rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✍️</span>
            </div>
            <h3 className="font-semibold text-sarang-purple mb-2">Express</h3>
            <p className="text-sm text-gray-600">Share your current feelings and emotions</p>
          </CardContent>
        </Card>

        <Card className="mood-card text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-sarang-periwinkle rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="font-semibold text-sarang-purple mb-2">Analyze</h3>
            <p className="text-sm text-gray-600">AI analyzes your mood and emotional state</p>
          </CardContent>
        </Card>

        <Card className="mood-card text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-sarang-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎵</span>
            </div>
            <h3 className="font-semibold text-sarang-purple mb-2">Uplift</h3>
            <p className="text-sm text-gray-600">Receive personalized music to improve your mood</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
