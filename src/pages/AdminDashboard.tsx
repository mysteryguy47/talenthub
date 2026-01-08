import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { 
  getAdminStats, getAllStudents, getStudentStatsAdmin, AdminStats, User, StudentStats,
  deleteStudent, updateStudentPoints, refreshLeaderboard, getDatabaseStats, DatabaseStats
} from "../lib/userApi";
import { Shield, Users, BarChart3, Target, TrendingUp, User as UserIcon, Award, Trash2, Edit2, RefreshCw, Database, Save, X } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingPoints, setEditingPoints] = useState<number | null>(null);
  const [pointsInput, setPointsInput] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, studentsData, dbStatsData] = await Promise.all([
          getAdminStats(),
          getAllStudents(),
          getDatabaseStats(),
        ]);
        setStats(statsData);
        setStudents(studentsData);
        setDbStats(dbStatsData);
      } catch (error) {
        console.error("Failed to load admin data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleStudentClick = async (student: User) => {
    setSelectedStudent(student);
    setEditingPoints(null);
    setPointsInput("");
    try {
      const stats = await getStudentStatsAdmin(student.id);
      setStudentStats(stats);
    } catch (error) {
      console.error("Failed to load student stats:", error);
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    if (!window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteStudent(studentId);
      setStudents(students.filter(s => s.id !== studentId));
      if (selectedStudent?.id === studentId) {
        setSelectedStudent(null);
        setStudentStats(null);
      }
      // Reload stats
      const statsData = await getAdminStats();
      setStats(statsData);
      const dbStatsData = await getDatabaseStats();
      setDbStats(dbStatsData);
    } catch (error) {
      console.error("Failed to delete student:", error);
      alert("Failed to delete student. Please try again.");
    }
    setShowDeleteConfirm(null);
  };

  const handleStartEditPoints = () => {
    if (studentStats) {
      setEditingPoints(studentStats.total_points);
      setPointsInput(studentStats.total_points.toString());
    }
  };

  const handleSavePoints = async () => {
    if (!selectedStudent || !pointsInput) return;
    const newPoints = parseInt(pointsInput);
    if (isNaN(newPoints) || newPoints < 0) {
      alert("Please enter a valid non-negative number");
      return;
    }
    try {
      await updateStudentPoints(selectedStudent.id, newPoints);
      // Reload data
      const [statsData, studentsData, stats] = await Promise.all([
        getAdminStats(),
        getAllStudents(),
        getStudentStatsAdmin(selectedStudent.id),
      ]);
      setStats(statsData);
      setStudents(studentsData);
      setStudentStats(stats);
      setEditingPoints(null);
      setPointsInput("");
    } catch (error) {
      console.error("Failed to update points:", error);
      alert("Failed to update points. Please try again.");
    }
  };

  const handleCancelEditPoints = () => {
    setEditingPoints(null);
    setPointsInput("");
  };

  const handleRefreshLeaderboard = async () => {
    setRefreshing(true);
    try {
      await refreshLeaderboard();
      // Reload stats
      const statsData = await getAdminStats();
      setStats(statsData);
      alert("Leaderboard refreshed successfully!");
    } catch (error) {
      console.error("Failed to refresh leaderboard:", error);
      alert("Failed to refresh leaderboard. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-4">Access Denied</div>
          <div className="text-slate-600 mb-4">You do not have admin permissions to access this page.</div>
          <a href="/dashboard" className="text-indigo-600 hover:text-indigo-700 underline">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Failed to load dashboard</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-2 flex items-center gap-3">
              <Shield className="w-10 h-10 text-indigo-600" />
              Admin Dashboard
            </h1>
            <p className="text-slate-600 text-lg">Monitor all student activity and progress</p>
          </div>
          <button
            onClick={handleRefreshLeaderboard}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Leaderboard
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.total_students}</span>
            </div>
            <div className="text-sm font-semibold text-slate-600">Total Students</div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.total_sessions}</span>
            </div>
            <div className="text-sm font-semibold text-slate-600">Total Sessions</div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.average_accuracy.toFixed(1)}%</span>
            </div>
            <div className="text-sm font-semibold text-slate-600">Avg Accuracy</div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.active_students_today}</span>
            </div>
            <div className="text-sm font-semibold text-slate-600">Active Today</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Students List */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">All Students</h2>
              <span className="text-sm text-slate-600">{students.length} total</span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {students.map((student) => (
                <div
                  key={student.id}
                  onClick={() => handleStudentClick(student)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedStudent?.id === student.id
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 shadow-md"
                      : "bg-slate-50 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {student.avatar_url ? (
                      <img src={student.avatar_url} alt={student.name} className="w-12 h-12 rounded-full" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{student.name}</div>
                      <div className="text-sm text-slate-600">{student.email}</div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs font-medium text-indigo-600">{student.total_points} points</span>
                        {student.current_streak > 0 && (
                          <span className="text-xs font-medium text-orange-600">🔥 {student.current_streak} day streak</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Details */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
            {selectedStudent && studentStats ? (
              <>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  {selectedStudent.name}
                </h2>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-slate-600">Total Points</div>
                      {editingPoints === null ? (
                        <button
                          onClick={handleStartEditPoints}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                          title="Edit points"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={handleSavePoints}
                            className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEditPoints}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    {editingPoints === null ? (
                      <div className="text-2xl font-bold text-indigo-600">{studentStats.total_points}</div>
                    ) : (
                      <input
                        type="number"
                        value={pointsInput}
                        onChange={(e) => setPointsInput(e.target.value)}
                        className="w-full px-3 py-2 border border-indigo-300 rounded-lg text-2xl font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        min="0"
                        autoFocus
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-600 mb-1">Accuracy</div>
                      <div className="text-lg font-bold text-slate-900">{studentStats.overall_accuracy.toFixed(1)}%</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-600 mb-1">Sessions</div>
                      <div className="text-lg font-bold text-slate-900">{studentStats.total_sessions}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-600 mb-1">Correct</div>
                      <div className="text-lg font-bold text-green-600">{studentStats.total_correct}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-600 mb-1">Wrong</div>
                      <div className="text-lg font-bold text-red-600">{studentStats.total_wrong}</div>
                    </div>
                  </div>

                  {studentStats.badges.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        Badges
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {studentStats.badges.map((badge, index) => (
                          <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleDeleteStudent(selectedStudent.id)}
                    className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500 py-12">
                <UserIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>Select a student to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Students */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Top Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.top_students.slice(0, 5).map((student, index) => (
              <div
                key={student.user_id}
                className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white" :
                    index === 1 ? "bg-gradient-to-br from-slate-300 to-slate-400 text-white" :
                    index === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white" :
                    "bg-slate-200 text-slate-700"
                  }`}>
                    {index + 1}
                  </div>
                  {student.avatar_url ? (
                    <img src={student.avatar_url} alt={student.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="font-semibold text-slate-900 text-sm">{student.name}</div>
                <div className="text-xs text-indigo-600 font-medium mt-1">{student.total_points} points</div>
              </div>
            ))}
          </div>
        </div>

        {/* Database Stats */}
        {dbStats && (
          <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Database Statistics</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-600 mb-1">Total Users</div>
                <div className="text-xl font-bold text-slate-900">{dbStats.total_users}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-600 mb-1">Students</div>
                <div className="text-xl font-bold text-indigo-600">{dbStats.total_students}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-600 mb-1">Admins</div>
                <div className="text-xl font-bold text-purple-600">{dbStats.total_admins}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-600 mb-1">Sessions</div>
                <div className="text-xl font-bold text-green-600">{dbStats.total_sessions}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-600 mb-1">Paper Attempts</div>
                <div className="text-xl font-bold text-blue-600">{dbStats.total_paper_attempts}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-600 mb-1">Rewards</div>
                <div className="text-xl font-bold text-yellow-600">{dbStats.total_rewards}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-600 mb-1">DB Size</div>
                <div className="text-xl font-bold text-slate-900">{dbStats.database_size_mb} MB</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

