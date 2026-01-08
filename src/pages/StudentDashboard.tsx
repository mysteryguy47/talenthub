import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getStudentStats, getOverallLeaderboard, getWeeklyLeaderboard, getPracticeSessionDetail, StudentStats, LeaderboardEntry, PracticeSessionDetail } from "../lib/userApi";
import { getPaperAttempts, PaperAttempt, getPaperAttempt, PaperAttemptDetail } from "../lib/api";
import { Trophy, Target, Zap, Award, CheckCircle2, XCircle, BarChart3, History, X, Eye, ChevronDown, ChevronUp, Gift, RotateCcw } from "lucide-react";
import { Link, useLocation } from "wouter";
import RewardsExplanation from "../components/RewardsExplanation";

type SessionFilter = "overall" | "mental_math" | "practice_paper";

interface UnifiedSession {
  id: number;
  type: "mental_math" | "practice_paper";
  title: string;
  subtitle: string;
  started_at: string;
  completed_at: string | null;
  correct_answers: number;
  wrong_answers: number;
  accuracy: number;
  time_taken: number | null;
  points_earned: number;
  // For mental math
  operation_type?: string;
  difficulty_mode?: string;
  // For practice paper
  paper_title?: string;
  paper_level?: string;
  paper_config?: any;
  generated_blocks?: any;
  seed?: number;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [overallLeaderboard, setOverallLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overall" | "weekly">("overall");
  const [selectedSession, setSelectedSession] = useState<PracticeSessionDetail | null>(null);
  const [expandedSession, setExpandedSession] = useState<number | null>(null);
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [paperAttempts, setPaperAttempts] = useState<PaperAttempt[]>([]);
  const [selectedPaperAttempt, setSelectedPaperAttempt] = useState<PaperAttempt | null>(null);
  const [showRewardsExplanation, setShowRewardsExplanation] = useState(false);
  const [sessionFilter, setSessionFilter] = useState<SessionFilter>("overall");
  const [unifiedSessions, setUnifiedSessions] = useState<UnifiedSession[]>([]);
  const [reAttempting, setReAttempting] = useState<number | null>(null);

  const loadData = async (isInitialLoad: boolean = false) => {
    // Only show loading screen on initial load, not on refreshes
    if (isInitialLoad) {
      setLoading(true);
    }
    
    try {
      console.log("🟡 [DASHBOARD] Loading dashboard data...");
      console.log("🟡 [DASHBOARD] User:", user?.email);
      
      // Load stats first - this is critical
      let statsData: StudentStats | null = null;
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
          const emptyStats: StudentStats = {
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
          };
          setStats(emptyStats);
          statsData = emptyStats; // Set statsData so it can be used later
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
      
      // Load paper attempts
      // Note: Unified sessions will be created automatically by useEffect when stats or paperAttempts change
      try {
        const attempts = await getPaperAttempts();
        console.log("✅ [DASHBOARD] Paper attempts loaded:", attempts.length, "attempts");
        console.log("✅ [DASHBOARD] Paper attempts data:", JSON.stringify(attempts, null, 2));
        if (attempts.length > 0) {
          console.log("✅ [DASHBOARD] First attempt sample:", {
            id: attempts[0].id,
            paper_title: attempts[0].paper_title,
            completed_at: attempts[0].completed_at,
            points_earned: attempts[0].points_earned
          });
        }
        setPaperAttempts(attempts);
      } catch (attemptsError: any) {
        console.error("❌ [DASHBOARD] Failed to load paper attempts:", attemptsError);
        console.error("❌ [DASHBOARD] Error details:", attemptsError.message, attemptsError.stack);
        if (isInitialLoad) {
          setPaperAttempts([]);
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

  // Update unified sessions whenever stats or paperAttempts change
  useEffect(() => {
    console.log("🟡 [DASHBOARD] useEffect triggered - stats:", stats ? `${stats.recent_sessions?.length || 0} sessions` : "null", "paperAttempts:", paperAttempts.length);
    
    const mentalMathSessions: UnifiedSession[] = (stats?.recent_sessions || []).map((session: any) => ({
      id: session.id,
      type: "mental_math",
      title: getOperationName(session.operation_type),
      subtitle: session.difficulty_mode,
      started_at: session.started_at,
      completed_at: session.completed_at || null,
      correct_answers: session.correct_answers,
      wrong_answers: session.wrong_answers,
      accuracy: session.accuracy,
      time_taken: session.time_taken,
      points_earned: session.points_earned,
      operation_type: session.operation_type,
      difficulty_mode: session.difficulty_mode
    }));
  
    const practicePaperSessions: UnifiedSession[] = paperAttempts.map((attempt: PaperAttempt) => {
      console.log("🟡 [DASHBOARD] Mapping paper attempt:", {
        id: attempt.id,
        paper_title: attempt.paper_title,
        completed_at: attempt.completed_at,
        points_earned: attempt.points_earned,
        correct_answers: attempt.correct_answers,
        wrong_answers: attempt.wrong_answers
      });
      return {
        id: attempt.id,
        type: "practice_paper",
        title: attempt.paper_title || "Practice Paper",
        subtitle: attempt.paper_level || "Custom",
        started_at: attempt.started_at,
        completed_at: attempt.completed_at || null,
        correct_answers: attempt.correct_answers || 0,
        wrong_answers: attempt.wrong_answers || 0,
        accuracy: attempt.accuracy || 0,
        time_taken: attempt.time_taken || null,
        points_earned: attempt.points_earned || 0,
        paper_title: attempt.paper_title || "Practice Paper",
        paper_level: attempt.paper_level || "Custom"
      };
    });
    
    console.log("🟡 [DASHBOARD] Mapped sessions - mental math:", mentalMathSessions.length, "practice papers:", practicePaperSessions.length);
    
    // Combine and sort by started_at (most recent first)
    const combined = [...mentalMathSessions, ...practicePaperSessions].sort((a, b) => {
      const dateA = new Date(a.started_at).getTime();
      const dateB = new Date(b.started_at).getTime();
      if (isNaN(dateA) || isNaN(dateB)) {
        console.warn("⚠️ [DASHBOARD] Invalid date in session:", { a: a.started_at, b: b.started_at });
        return 0;
      }
      return dateB - dateA;
    });
    
    console.log("✅ [DASHBOARD] Unified sessions updated via useEffect:", combined.length, "sessions (mental math:", mentalMathSessions.length, ", papers:", practicePaperSessions.length, ")");
    console.log("✅ [DASHBOARD] Combined sessions sample:", combined.slice(0, 3).map(s => ({ type: s.type, title: s.title, id: s.id })));
    setUnifiedSessions(combined);
  }, [stats, paperAttempts]); // getOperationName is stable, doesn't need to be in deps

  // Debug logging - must be before early returns to maintain hook order
  useEffect(() => {
    console.log("🔍 [DASHBOARD] Current state:", {
      unifiedSessionsCount: unifiedSessions.length,
      filteredSessionsCount: unifiedSessions.filter(session => {
        if (sessionFilter === "overall") return true;
        if (sessionFilter === "mental_math") return session.type === "mental_math";
        if (sessionFilter === "practice_paper") return session.type === "practice_paper";
        return true;
      }).length,
      statsRecentSessionsCount: stats?.recent_sessions?.length || 0,
      paperAttemptsCount: paperAttempts.length,
      sessionFilter
    });
  }, [unifiedSessions, stats, paperAttempts, sessionFilter]);

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

  const handleReAttempt = async (attemptId: number) => {
    try {
      setReAttempting(attemptId);
      // Get the paper attempt details
      const attemptDetail: PaperAttemptDetail = await getPaperAttempt(attemptId);
      
      // Prepare paper data for re-attempt
      const paperData = {
        config: attemptDetail.paper_config,
        blocks: attemptDetail.generated_blocks,
        seed: attemptDetail.seed
      };
      
      // Store in sessionStorage for PaperAttempt page
      sessionStorage.setItem("paperAttemptData", JSON.stringify(paperData));
      
      // Navigate to paper attempt page
      setLocation("/paper/attempt");
    } catch (error) {
      console.error("Failed to re-attempt paper:", error);
      alert("Failed to start re-attempt. Please try again.");
      setReAttempting(null);
    }
  };

  // Filter unified sessions based on selected filter
  const filteredSessions = unifiedSessions.filter(session => {
    if (sessionFilter === "overall") return true;
    if (sessionFilter === "mental_math") return session.type === "mental_math";
    if (sessionFilter === "practice_paper") return session.type === "practice_paper";
    return true;
  });

  const displaySessions = showAllSessions ? filteredSessions : filteredSessions.slice(0, 5);

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

        {/* Rewards System Card */}
        <div className="mb-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/50 to-purple-700/50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Unlock Amazing Rewards!</h2>
                    <p className="text-white/90 text-sm">Earn points, unlock chocolates, SUPER badges, and more!</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 flex-wrap">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <p className="text-xs text-white/80 mb-1">Your Points</p>
                    <p className="text-2xl font-bold">{stats.total_points.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <p className="text-xs text-white/80 mb-1">Daily Streak</p>
                    <p className="text-2xl font-bold">{stats.current_streak} days</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowRewardsExplanation(true)}
                className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
              >
                <Gift className="w-5 h-5" />
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Recent Practice Sessions */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <History className="w-6 h-6 text-indigo-600" />
              Recent Practice Sessions
            </h2>
            {/* Filter Buttons */}
            <div className="flex gap-2 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setSessionFilter("overall")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  sessionFilter === "overall"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Overall
              </button>
              <button
                onClick={() => setSessionFilter("mental_math")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  sessionFilter === "mental_math"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Mental Math
              </button>
              <button
                onClick={() => setSessionFilter("practice_paper")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  sessionFilter === "practice_paper"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Practice Paper
              </button>
            </div>
          </div>
          {filteredSessions.length > 0 ? (
            <>
              <div className="space-y-3">
                {displaySessions.map((session) => (
                <div
                  key={`${session.type}-${session.id}`}
                  className="bg-slate-50 hover:bg-slate-100 rounded-xl p-4 border border-slate-200 transition-all cursor-pointer"
                  onClick={() => {
                    if (session.type === "mental_math") {
                      setExpandedSession(expandedSession === session.id ? null : session.id);
                    } else {
                      setSelectedPaperAttempt(selectedPaperAttempt?.id === session.id ? null : paperAttempts.find(p => p.id === session.id) || null);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-slate-900">{session.title}</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          session.type === "mental_math" 
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-purple-100 text-purple-700"
                        }`}>
                          {session.subtitle}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          session.type === "mental_math" 
                            ? "bg-blue-100 text-blue-700"
                            : "bg-pink-100 text-pink-700"
                        }`}>
                          {session.type === "mental_math" ? "Mental Math" : "Practice Paper"}
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
                        {session.time_taken !== null && session.time_taken !== undefined && (
                          <span className="text-slate-600">
                            Time: <span className="font-semibold">{formatTime(session.time_taken)}</span>
                          </span>
                        )}
                        <span className="text-slate-600">
                          Points: <span className="font-semibold text-indigo-600">+{session.points_earned}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {session.type === "mental_math" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewSession(session.id);
                          }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      ) : (
                        <>
                          {session.completed_at && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReAttempt(session.id);
                              }}
                              disabled={reAttempting === session.id}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <RotateCcw className={`w-4 h-4 ${reAttempting === session.id ? "animate-spin" : ""}`} />
                              {reAttempting === session.id ? "Starting..." : "Re-attempt"}
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPaperAttempt(selectedPaperAttempt?.id === session.id ? null : paperAttempts.find(p => p.id === session.id) || null);
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                ))}
              </div>
              {filteredSessions.length > 5 && (
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
                      Show All ({filteredSessions.length} sessions)
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <History className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-lg">No {sessionFilter === "overall" ? "" : sessionFilter === "mental_math" ? "mental math " : "practice paper "}practice sessions yet</p>
              <p className="text-sm mt-2">Start practicing to see your progress here!</p>
              <div className="flex gap-3 justify-center mt-4">
                {sessionFilter !== "practice_paper" && (
                  <Link href="/mental">
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      Start Mental Math
                    </button>
                  </Link>
                )}
                {sessionFilter !== "mental_math" && (
                  <Link href="/create">
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      Create Practice Paper
                    </button>
                  </Link>
                )}
              </div>
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

      {/* Paper Attempt Detail Modal */}
      {selectedPaperAttempt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPaperAttempt(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Practice Paper Details</h2>
                <p className="text-sm text-slate-600 mt-1">
                  {selectedPaperAttempt.paper_title} • {selectedPaperAttempt.paper_level} • {formatDate(selectedPaperAttempt.started_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedPaperAttempt(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {/* Paper Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <div className="text-sm text-indigo-600 font-semibold">Score</div>
                  <div className="text-2xl font-bold text-indigo-900">{selectedPaperAttempt.score}/{selectedPaperAttempt.total_questions}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-green-600 font-semibold">Accuracy</div>
                  <div className="text-2xl font-bold text-green-900">{selectedPaperAttempt.accuracy.toFixed(1)}%</div>
                </div>
                {selectedPaperAttempt.time_taken !== null && selectedPaperAttempt.time_taken !== undefined && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-sm text-blue-600 font-semibold">Time</div>
                    <div className="text-2xl font-bold text-blue-900">{formatTime(selectedPaperAttempt.time_taken)}</div>
                  </div>
                )}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-sm text-purple-600 font-semibold">Points</div>
                  <div className="text-2xl font-bold text-purple-900">+{selectedPaperAttempt.points_earned}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Results Summary</h3>
                {selectedPaperAttempt.completed_at && (
                  <button
                    onClick={() => handleReAttempt(selectedPaperAttempt.id)}
                    disabled={reAttempting === selectedPaperAttempt.id}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className={`w-4 h-4 ${reAttempting === selectedPaperAttempt.id ? "animate-spin" : ""}`} />
                    {reAttempting === selectedPaperAttempt.id ? "Starting..." : "Re-attempt Paper"}
                  </button>
                )}
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Correct Answers</div>
                    <div className="text-2xl font-bold text-green-600">{selectedPaperAttempt.correct_answers}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Wrong Answers</div>
                    <div className="text-2xl font-bold text-red-600">{selectedPaperAttempt.wrong_answers}</div>
                  </div>
                </div>
              </div>

              {!selectedPaperAttempt.completed_at && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">This paper attempt is still in progress.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rewards Explanation Modal */}
      <RewardsExplanation
        isOpen={showRewardsExplanation}
        onClose={() => setShowRewardsExplanation(false)}
        currentPoints={stats?.total_points || 0}
      />
    </div>
  );
}

