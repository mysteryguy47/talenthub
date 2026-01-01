import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, Sparkles, BookOpen, User, LogOut, BarChart3, Shield, UserCircle, Settings, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const [abacusOpen, setAbacusOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const isActive = (path: string) => location === path || location.startsWith(path + "/");

  // Handle logo click - scroll to hero section
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location === "/") {
      // Already on home page, scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Navigate to home, then scroll to top
      setLocation("/");
      // Small delay to ensure page loads before scrolling
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  // Handle mouse enter with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setAbacusOpen(true);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setAbacusOpen(false);
    }, 200); // 200ms delay before closing
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (userMenuTimeoutRef.current) {
        clearTimeout(userMenuTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 shadow-lg shadow-slate-200/20">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a 
            href="/" 
            onClick={handleLogoClick}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300"></div>
            </div>
            <div>
              <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-indigo-700 group-hover:to-purple-700 transition-all duration-300">
                Talent Hub
              </div>
              <div className="text-xs text-slate-500 font-semibold tracking-wide uppercase">Empowering Mathematical Excellence</div>
            </div>
          </a>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {/* Abacus Dropdown */}
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-all duration-200 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 border border-transparent hover:border-indigo-200/50">
                <BookOpen className="w-4 h-4" />
                Abacus
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${abacusOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {abacusOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden animate-fade-in"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="py-2">
                    {/* Junior - Active */}
                    <Link href="/create/junior">
                      <div className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 border-b border-gray-100 ${
                        isActive("/create/junior")
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-l-4 border-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${isActive("/create/junior") ? "bg-blue-600" : "bg-gray-300"}`}></div>
                        <span>Junior</span>
                        {isActive("/create/junior") && (
                          <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">Active</span>
                        )}
                      </div>
                    </Link>

                    {/* Basic - Active */}
                    <Link href="/create/basic">
                      <div className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                        isActive("/create/basic") || (location === "/create" && !location.includes("advanced"))
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-l-4 border-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${isActive("/create/basic") || (location === "/create" && !location.includes("advanced")) ? "bg-blue-600" : "bg-gray-300"}`}></div>
                        <span>Basic</span>
                        {(isActive("/create/basic") || (location === "/create" && !location.includes("advanced"))) && (
                          <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">Active</span>
                        )}
                      </div>
                    </Link>

                    {/* Advanced - Active */}
                    <Link href="/create/advanced">
                      <div className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                        isActive("/create/advanced")
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-l-4 border-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${isActive("/create/advanced") ? "bg-blue-600" : "bg-gray-300"}`}></div>
                        <span>Advanced</span>
                        {isActive("/create/advanced") && (
                          <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">Active</span>
                        )}
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Vedic Maths Link */}
            <Link href="/vedic-maths/level-1">
              <button className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all duration-200 rounded-xl border border-transparent ${
                isActive("/vedic-maths")
                  ? "text-indigo-600 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200/50"
                  : "text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50"
              }`}>
                <BookOpen className="w-4 h-4" />
                Vedic Maths
              </button>
            </Link>

            {/* Mental Math Link */}
            <Link href="/mental">
              <button className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all duration-200 rounded-xl border border-transparent ${
                isActive("/mental")
                  ? "text-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50"
                  : "text-slate-700 hover:text-purple-600 hover:bg-purple-50/50"
              }`}>
                <Sparkles className="w-4 h-4" />
                Mental Math
              </button>
            </Link>

            {/* User Menu or Login Button */}
            {isAuthenticated && user ? (
              <div 
                ref={userMenuRef}
                className="relative"
                onMouseEnter={() => {
                  if (userMenuTimeoutRef.current) {
                    clearTimeout(userMenuTimeoutRef.current);
                    userMenuTimeoutRef.current = null;
                  }
                  setUserMenuOpen(true);
                }}
                onMouseLeave={() => {
                  userMenuTimeoutRef.current = setTimeout(() => {
                    setUserMenuOpen(false);
                  }, 200); // 200ms delay to allow moving to dropdown
                }}
              >
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                </button>

                {userMenuOpen && (
                  <div 
                    className="absolute right-0 top-full mt-1 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100/50 overflow-hidden z-50"
                    onMouseEnter={() => {
                      if (userMenuTimeoutRef.current) {
                        clearTimeout(userMenuTimeoutRef.current);
                        userMenuTimeoutRef.current = null;
                      }
                      setUserMenuOpen(true);
                    }}
                    onMouseLeave={() => {
                      userMenuTimeoutRef.current = setTimeout(() => {
                        setUserMenuOpen(false);
                      }, 200);
                    }}
                  >
                    <div className="p-2">
                      <div className="px-4 py-2 text-sm text-slate-600 border-b border-slate-100">
                        <div className="font-semibold text-slate-900">{user.name}</div>
                        <div className="text-xs">{user.email}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs font-medium text-indigo-600">{user.total_points} points</span>
                          {user.current_streak > 0 && (
                            <span className="text-xs font-medium text-orange-600">🔥 {user.current_streak} day streak</span>
                          )}
                        </div>
                      </div>
                      
                      <Link href="/dashboard">
                        <div className="px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 rounded-lg flex items-center gap-2 cursor-pointer">
                          <BarChart3 className="w-4 h-4" />
                          Dashboard
                        </div>
                      </Link>
                      
                      {/* <Link href="/settings">
                        <div className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 cursor-pointer">
                          <Settings className="w-4 h-4" />
                          Settings
                        </div>
                      </Link> */}
                      
                      {isAdmin && (
                        <Link href="/admin">
                          <div className="px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 rounded-lg flex items-center gap-2 cursor-pointer">
                            <Shield className="w-4 h-4" />
                            Admin Dashboard
                          </div>
                        </Link>
                      )}
                      
                      <button
                        onClick={logout}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button className="group flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transform hover:-translate-y-0.5 transition-all duration-300">
                  <UserCircle className="w-4 h-4" />
                  Sign In
                  <span className="w-0 group-hover:w-2 transition-all duration-300 overflow-hidden">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

