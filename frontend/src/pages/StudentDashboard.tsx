import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getStudentStats, getOverallLeaderboard, getWeeklyLeaderboard, getPracticeSessionDetail, StudentStats, LeaderboardEntry, PracticeSessionDetail } from "../lib/userApi";
import { Trophy, Target, Zap, Award, CheckCircle2, XCircle, BarChart3, History, X, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [overallLeaderboard, setOverallLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overall" | "weekly">("overall");
  const [selectedSession, setSelectedSession] = useState<PracticeSessionDetail | null>(null);
  const [expandedSession, setExpandedSession] = useState<number | null>(null);
  const [showAllSessions, setShowAllSessions] = useState(false);

  const loadData = async (isInitialLoad: boolean = false) => {
    // Only show loading screen on initial load, not on refreshes
    if (isInitialLoad) {
      setLoading(true);
    }
    
    try {
      console.log("🟡 [DASHBOARD] Loading dashboard data...");
      console.log("🟡 [DASHBOARD] User:", user?.email);
      
      // Load stats first - this is critical
      let statsData: StudentStats;
      try {
        statsData = await getStudentStats();
        console.log("✅ [DASHBOARD] Stats loaded successfully!");
        console.log("✅ [DASHBOARD] Stats:", { 
          total_points: statsData.total_points,
          total_sessions: statsData.total_sessions,
          total_questions: statsData.total_questions,
          total_correct: statsData.total_correct,
          total_wrong: statsData.total_wrong,
          overall_accuracy: statsData.overall_accuracy,
          current_streak: statsData.current_streak,
          badges_count: statsData.badges.length,
          recent_sessions_count: statsData.recent_sessions.length
        });
        setStats(statsData);
      } catch (statsError: any) {
        console.error("❌ [DASHBOARD] Failed to load stats:", statsError);
        // Only set empty stats on initial load if we don't have stats yet
        if (isInitialLoad && !stats) {
          setStats({
            total_sessions: 0,
            total_questions: 0,
            total_correct: 0,
            total_wrong: 0,
            overall_accuracy: 0,
            total_points: 0,
            current_streak: 0,
            longest_streak: 0,
            badges: [],
            recent_sessions: [],
          });
        }
      }
      
      // Load leaderboards independently - don't fail if these error
      try {
        const overallData = await getOverallLeaderboard();
        console.log("✅ [DASHBOARD] Overall leaderboard loaded:", overallData.length, "entries");
        setOverallLeaderboard(overallData);
      } catch (overallError: any) {
        console.error("❌ [DASHBOARD] Failed to load overall leaderboard:", overallError);
        // Only clear on initial load
        if (isInitialLoad) {
          setOverallLeaderboard([]);
        }
      }
      
      try {
        const weeklyData = await getWeeklyLeaderboard();
        console.log("✅ [DASHBOARD] Weekly leaderboard loaded:", weeklyData.length, "entries");
        setWeeklyLeaderboard(weeklyData);
      } catch (weeklyError: any) {
        console.error("❌ [DASHBOARD] Failed to load weekly leaderboard:", weeklyError);
        // Only clear on initial load
        if (isInitialLoad) {
          setWeeklyLeaderboard([]);
        }
      }
      
    } catch (error: any) {
      console.error("❌ [DASHBOARD] Unexpected error:", error);
    } finally {
      // Only hide loading screen on initial load
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Initial load with loading screen
    loadData(true);
    
    // Refresh data every 5 seconds when dashboard is visible (without loading screen)
    const interval = setInterval(() => {
      loadData(false);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">Failed to load dashboard</div>
          <p className="text-slate-600 mb-4">Please check your connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const userRank = overallLeaderboard.findIndex((entry: LeaderboardEntry) => entry.user_id === user?.id) + 1;
  const userWeeklyRank = weeklyLeaderboard.findIndex((entry: LeaderboardEntry) => entry.user_id === user?.id) + 1;

  const formatDate = (dateString: string) => {
    // Parse the date string - backend sends UTC time
    const date = new Date(dateString);
    
    // Validate date
    if (isNaN(date.getTime())) {
      console.error("Invalid date string:", dateString);
      return "Invalid date";
    }
    
    // Convert to IST (India Standard Time, UTC+5:30)
    // toLocaleString with timeZone is the most reliable way
    try {
      return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch (error) {
      console.error("Error formatting date to IST:", error);
      // Fallback: manually add 5:30 hours (19800000 ms)
      const istOffset = 5.5 * 60 * 60 * 1000; // 5:30 hours in milliseconds
      const istDate = new Date(date.getTime() + istOffset);
      return istDate.toLocaleString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    }
  };

  const formatTime = (seconds: number) => {
    // Ensure seconds is a valid number
    let timeInSeconds = Math.max(0, Number(seconds));
    
    // If value is suspiciously large, it might be stored incorrectly
    // Check if it's in milliseconds (typical session < 1 hour = 3600 seconds)
    // If > 3600 seconds (1 hour), and looks like milliseconds, convert
    // A reasonable session is < 3600 seconds (1 hour), so anything > 3600 might be ms
    if (timeInSeconds > 3600) {
      // If dividing by 1000 gives a more reasonable value (< 3600 seconds), it was in milliseconds
      const convertedValue = timeInSeconds / 1000;
      if (convertedValue < 3600 && convertedValue > 0) {
        console.warn("⚠️ [DASHBOARD] Time value appears to be in milliseconds, converting:", timeInSeconds, "→", convertedValue);
        timeInSeconds = convertedValue;
      } else if (timeInSeconds > 86400) {
        // If still very large after conversion check, force conversion anyway
        // This handles cases where session might be > 1 hour but was stored as ms
        console.warn("⚠️ [DASHBOARD] Time value extremely large, forcing conversion from milliseconds:", timeInSeconds);
        timeInSeconds = timeInSeconds / 1000;
      }
    }
    
    // Calculate minutes and seconds (no hours, just m and s)
    const totalSeconds = Math.floor(timeInSeconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    
    // Format: "Xm Ys" or just "Xs" if less than a minute
    if (mins === 0) {
      return `${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const getOperationName = (op: string) => {
    const names: Record<string, string> = {
      add_sub: "Add/Subtract",
      multiplication: "Multiplication",
      division: "Division",
      decimal_multiplication: "Decimal Multiplication",
      decimal_division: "Decimal Division",
      integer_add_sub: "Integer Add/Subtract",
      lcm: "LCM",
      gcd: "GCD",
      square_root: "Square Root",
      cube_root: "Cube Root",
      percentage: "Percentage"
    };
    return names[op] || op;
  };

  const handleViewSession = async (sessionId: number) => {
    try {
      const detail = await getPracticeSessionDetail(sessionId);
      setSelectedSession(detail);
    } catch (error) {
      console.error("Failed to load session details:", error);
      alert("Failed to load session details");
    }
  };

  const formatQuestion = (questionData: any, operationType: string): string => {
    if (typeof questionData === "string") {
      try {
        questionData = JSON.parse(questionData);
      } catch {
        return String(questionData);
      }
    }
    
    if (operationType === "add_sub" || operationType === "integer_add_sub") {
      const numbers = questionData.numbers || [];
      const operators = questionData.operators || [];
      return numbers.map((n: number, i: number) => 
        i < operators.length ? `${n} ${operators[i]}` : n
      ).join(" ") + " = ?";
    } else if (operationType === "multiplication") {
      return `${questionData.multiplicand || questionData.num1} × ${questionData.multiplier || questionData.num2} = ?`;
    } else if (operationType === "division") {
      return `${questionData.dividend || questionData.num1} ÷ ${questionData.divisor || questionData.num2} = ?`;
    } else if (operationType === "lcm") {
      return `LCM(${questionData.num1}, ${questionData.num2}) = ?`;
    } else if (operationType === "gcd") {
      return `GCD(${questionData.num1}, ${questionData.num2}) = ?`;
    } else if (operationType === "square_root") {
      return `√${questionData.number} = ?`;
    } else if (operationType === "cube_root") {
      return `∛${questionData.number} = ?`;
    } else if (operationType === "percentage") {
      return `${questionData.value}% of ${questionData.of} = ?`;
    }
    return JSON.stringify(questionData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-600 text-lg">Track your progress and compete with others</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.total_points}</span>
            </div>
            <div className="text-sm font-semibold text-slate-600">Total Points</div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.overall_accuracy.toFixed(1)}%</span>
            </div>
            <div className="text-sm font-semibold text-slate-600">Accuracy</div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.current_streak}</span>
            </div>
            <div className="text-sm font-semibold text-slate-600">Day Streak</div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.total_sessions}</span>
            </div>
            <div className="text-sm font-semibold text-slate-600">Practice Sessions</div>
          </div>
        </div>

        {/* Recent Practice Sessions */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" />
            Recent Practice Sessions
          </h2>
          {stats.recent_sessions.length > 0 ? (
            <>
              <div className="space-y-3">
                {(showAllSessions ? stats.recent_sessions : stats.recent_sessions.slice(0, 5)).map((session) => (
                <div
                  key={session.id}
                  className="bg-slate-50 hover:bg-slate-100 rounded-xl p-4 border border-slate-200 transition-all cursor-pointer"
                  onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-slate-900">{getOperationName(session.operation_type)}</span>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                          {session.difficulty_mode}
                        </span>
                        <span className="text-sm text-slate-500">{formatDate(session.started_at)}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-600">
                          <span className="font-semibold text-green-600">{session.correct_answers}</span> correct / <span className="font-semibold text-red-600">{session.wrong_answers}</span> wrong
                        </span>
                        <span className="text-slate-600">
                          Accuracy: <span className="font-semibold">{session.accuracy.toFixed(1)}%</span>
                        </span>
                        <span className="text-slate-600">
                          Time: <span className="font-semibold">{formatTime(session.time_taken)}</span>
                        </span>
                        <span className="text-slate-600">
                          Points: <span className="font-semibold text-indigo-600">+{session.points_earned}</span>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewSession(session.id);
                      }}
                      className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
                ))}
              </div>
              {stats.recent_sessions.length > 5 && (
                <button
                  onClick={() => setShowAllSessions(!showAllSessions)}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl font-semibold transition-all duration-300 border border-indigo-200 hover:border-indigo-300"
                >
                  {showAllSessions ? (
                    <>
                      <ChevronUp className="w-5 h-5" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-5 h-5" />
                      Show All ({stats.recent_sessions.length} sessions)
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <History className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-lg">No practice sessions yet</p>
              <p className="text-sm mt-2">Start practicing to see your progress here!</p>
              <Link href="/mental">
                <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Start Practice
                </button>
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Leaderboard</h2>
              <div className="flex gap-2 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("overall")}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                    activeTab === "overall"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Overall
                </button>
                <button
                  onClick={() => setActiveTab("weekly")}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                    activeTab === "weekly"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {(activeTab === "overall" ? overallLeaderboard : weeklyLeaderboard).slice(0, 10).map((entry, index) => {
                const isCurrentUser = entry.user_id === user?.id;
                return (
                  <div
                    key={entry.user_id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 shadow-md"
                        : "bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white" :
                      index === 1 ? "bg-gradient-to-br from-slate-300 to-slate-400 text-white" :
                      index === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white" :
                      "bg-slate-200 text-slate-700"
                    }`}>
                      {index + 1}
                    </div>
                    {entry.avatar_url ? (
                      <img src={entry.avatar_url} alt={entry.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{entry.name}</div>
                      <div className="text-sm text-slate-600">
                        {activeTab === "overall" ? `${entry.total_points} points` : `${entry.weekly_points} points`}
                      </div>
                    </div>
                    {isCurrentUser && (
                      <span className="text-xs font-semibold bg-indigo-600 text-white px-3 py-1 rounded-full">You</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Your Rank</span>
                <span className="text-2xl font-bold text-indigo-600">
                  #{activeTab === "overall" ? (userRank || "—") : (userWeeklyRank || "—")}
                </span>
              </div>
            </div>
          </div>

          {/* Badges & Recent Activity */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Badges
              </h2>
              {stats.badges.length > 0 ? (
                <div className="space-y-2">
                  {stats.badges.map((badge, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-slate-900">{badge}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No badges yet. Keep practicing!</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total Questions</span>
                  <span className="font-bold text-slate-900">{stats.total_questions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Correct</span>
                  <span className="font-bold text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {stats.total_correct}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Wrong</span>
                  <span className="font-bold text-red-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {stats.total_wrong}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Longest Streak</span>
                  <span className="font-bold text-orange-600">{stats.longest_streak} days</span>
                </div>
              </div>
            </div>

            {/* Practice Button */}
            <Link href="/mental">
              <button className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                Start Practice
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedSession(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Practice Session Details</h2>
                <p className="text-sm text-slate-600 mt-1">
                  {getOperationName(selectedSession.operation_type)} • {selectedSession.difficulty_mode} • {formatDate(selectedSession.started_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {/* Session Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <div className="text-sm text-indigo-600 font-semibold">Score</div>
                  <div className="text-2xl font-bold text-indigo-900">{selectedSession.score}/{selectedSession.total_questions}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-green-600 font-semibold">Accuracy</div>
                  <div className="text-2xl font-bold text-green-900">{selectedSession.accuracy.toFixed(1)}%</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-sm text-blue-600 font-semibold">Time</div>
                  <div className="text-2xl font-bold text-blue-900">{formatTime(selectedSession.time_taken)}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-sm text-purple-600 font-semibold">Points</div>
                  <div className="text-2xl font-bold text-purple-900">+{selectedSession.points_earned}</div>
                </div>
              </div>

              {/* Questions List */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Questions & Answers</h3>
                <div className="space-y-3">
                  {selectedSession.attempts.map((attempt, index) => (
                    <div
                      key={attempt.id}
                      className={`rounded-lg p-4 border-2 ${
                        attempt.is_correct
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-slate-700">Q{attempt.question_number}:</span>
                            <span className="text-slate-900 font-mono text-lg">
                              {formatQuestion(attempt.question_data, selectedSession.operation_type)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className={attempt.is_correct ? "text-green-700" : "text-red-700"}>
                              Your answer: <span className="font-semibold">{attempt.user_answer !== null ? attempt.user_answer : "—"}</span>
                            </span>
                            <span className="text-slate-600">
                              Correct: <span className="font-semibold">{attempt.correct_answer}</span>
                            </span>
                            <span className="text-slate-600">
                              Time: <span className="font-semibold">{attempt.time_taken.toFixed(2)}s</span>
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          {attempt.is_correct ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

