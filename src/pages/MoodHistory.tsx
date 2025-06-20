
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, TrendingUp, Music, HeadphonesIcon } from "lucide-react";

interface MoodEntry {
  id: string;
  date: string;
  inputText: string;
  sentimentScore: number;
  moodLabel: string;
  songsCount: number;
}

const MoodHistory = () => {
  // Mock data for demonstration
  const [moodHistory] = useState<MoodEntry[]>([
    {
      id: "1",
      date: "2024-01-15",
      inputText: "Feeling overwhelmed with work deadlines...",
      sentimentScore: -0.6,
      moodLabel: "Low",
      songsCount: 10
    },
    {
      id: "2", 
      date: "2024-01-16",
      inputText: "Had a good conversation with friends today",
      sentimentScore: 0.3,
      moodLabel: "Happy",
      songsCount: 8
    },
    {
      id: "3",
      date: "2024-01-17",
      inputText: "Feeling neutral, just going through the motions",
      sentimentScore: 0.1,
      moodLabel: "Neutral",
      songsCount: 12
    },
    {
      id: "4",
      date: "2024-01-18",
      inputText: "Really excited about the weekend plans!",
      sentimentScore: 0.7,
      moodLabel: "Excited",
      songsCount: 6
    },
    {
      id: "5",
      date: "2024-01-19",
      inputText: "A bit anxious about the upcoming presentation",
      sentimentScore: -0.2,
      moodLabel: "Calm",
      songsCount: 9
    },
    {
      id: "6",
      date: "2024-01-20",
      inputText: "Today was amazing! Everything went perfectly",
      sentimentScore: 0.9,
      moodLabel: "Excited",
      songsCount: 5
    }
  ]);

  const chartData = moodHistory.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: entry.sentimentScore,
    label: entry.moodLabel
  }));

  const getMoodColor = (score: number) => {
    if (score < -0.5) return "bg-red-100 text-red-800 border-red-200";
    if (score < 0) return "bg-orange-100 text-orange-800 border-orange-200";
    if (score < 0.3) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (score < 0.7) return "bg-green-100 text-green-800 border-green-200";
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  };

  const averageMood = moodHistory.reduce((sum, entry) => sum + entry.sentimentScore, 0) / moodHistory.length;
  const totalSessions = moodHistory.length;
  const totalSongs = moodHistory.reduce((sum, entry) => sum + entry.songsCount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-sarang-purple">
          My Mood Journey
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track your emotional wellness and see how music therapy is helping you over time
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="mood-card">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-sarang-lavender rounded-full">
                <TrendingUp className="h-6 w-6 text-sarang-purple" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {averageMood > 0 ? '+' : ''}{averageMood.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Average Mood</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mood-card">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-sarang-periwinkle rounded-full">
                <Calendar className="h-6 w-6 text-sarang-purple" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{totalSessions}</div>
                <div className="text-sm text-gray-600">Therapy Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mood-card">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-sarang-purple rounded-full">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{totalSongs}</div>
                <div className="text-sm text-gray-600">Songs Recommended</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood Chart */}
      <Card className="mood-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-sarang-purple" />
            <span>Mood Trend</span>
          </CardTitle>
          <CardDescription>
            Your emotional journey over the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#C0C9EE" />
                <XAxis 
                  dataKey="date" 
                  stroke="#898AC4"
                  fontSize={12}
                />
                <YAxis 
                  domain={[-1, 1]}
                  stroke="#898AC4"
                  fontSize={12}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <Tooltip 
                  formatter={(value: number, name) => [value.toFixed(2), 'Mood Score']}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    backgroundColor: '#FFF2E0',
                    border: '1px solid #C0C9EE',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#898AC4" 
                  strokeWidth={3}
                  dot={{ fill: '#898AC4', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#A2AADB' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card className="mood-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HeadphonesIcon className="w-5 h-5 text-sarang-purple" />
            <span>Recent Sessions</span>
          </CardTitle>
          <CardDescription>
            Your latest mood therapy sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moodHistory.slice(-5).reverse().map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-sarang-lavender/30">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge className={getMoodColor(entry.sentimentScore)}>
                      {entry.moodLabel}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    "{entry.inputText}"
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Score: {entry.sentimentScore.toFixed(2)}</span>
                    <span>•</span>
                    <span>{entry.songsCount} songs recommended</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-sarang-lavender text-sarang-purple hover:bg-sarang-lavender/20">
                  View Playlist
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="mood-card">
        <CardHeader>
          <CardTitle className="text-sarang-purple">Your Wellness Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Progress Highlights</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Your mood has improved by 40% this week</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>You've been consistent with daily sessions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Music therapy is showing positive effects</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Recommendations</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Try morning sessions for better results</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>Consider adding meditation between songs</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span>Share your progress with a wellness coach</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodHistory;
