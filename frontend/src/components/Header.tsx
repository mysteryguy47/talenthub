import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, LogOut, BarChart3, Shield, GraduationCap, Calculator, BookOpen, PenTool, Rocket, Menu, X, Brain, FileText, Sparkles, Award, Trophy } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [createPaperOpen, setCreatePaperOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const coursesDropdownRef = useRef<HTMLDivElement>(null);
  const createPaperDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const coursesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const createPaperTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logo click
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setLocation("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  // Handle courses dropdown
  const handleCoursesMouseEnter = () => {
    if (coursesTimeoutRef.current) {
      clearTimeout(coursesTimeoutRef.current);
      coursesTimeoutRef.current = null;
    }
    setCoursesOpen(true);
  };

  const handleCoursesMouseLeave = () => {
    coursesTimeoutRef.current = setTimeout(() => {
      setCoursesOpen(false);
    }, 200);
  };

  // Handle create paper dropdown
  const handleCreatePaperMouseEnter = () => {
    if (createPaperTimeoutRef.current) {
      clearTimeout(createPaperTimeoutRef.current);
      createPaperTimeoutRef.current = null;
    }
    setCreatePaperOpen(true);
  };

  const handleCreatePaperMouseLeave = () => {
    createPaperTimeoutRef.current = setTimeout(() => {
      setCreatePaperOpen(false);
    }, 200);
  };


  // Handle user menu
  const handleUserMenuEnter = () => {
    if (userMenuTimeoutRef.current) {
      clearTimeout(userMenuTimeoutRef.current);
      userMenuTimeoutRef.current = null;
    }
    setUserMenuOpen(true);
  };

  const handleUserMenuLeave = () => {
    userMenuTimeoutRef.current = setTimeout(() => {
      setUserMenuOpen(false);
    }, 200);
  };

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (coursesTimeoutRef.current) clearTimeout(coursesTimeoutRef.current);
      if (createPaperTimeoutRef.current) clearTimeout(createPaperTimeoutRef.current);
      if (userMenuTimeoutRef.current) clearTimeout(userMenuTimeoutRef.current);
    };
  }, []);

  const isActive = (path: string) => location === path || location.startsWith(path + "/");

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-lg shadow-sm border-b border-slate-200/60" 
          : "bg-white/70 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 relative">
          {/* Logo + Tagline */}
          <Link 
            href="/" 
            onClick={handleLogoClick}
            className="flex items-center gap-3 group cursor-pointer z-10"
          >
            <div className="relative">
              <img 
                src="/imagesproject/logo.ico.jpg" 
                alt="Talent Hub Logo" 
                className="w-11 h-11 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 hidden">
                <GraduationCap className="w-5.5 h-5.5 text-white" />
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                Talent Hub
              </div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wider uppercase leading-tight">
                Empowering Mathematical Excellence
              </div>
            </div>
          </Link>

          {/* Center Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
            {/* Courses Dropdown */}
            <div 
              ref={coursesDropdownRef}
              className="relative"
              onMouseEnter={handleCoursesMouseEnter}
              onMouseLeave={handleCoursesMouseLeave}
            >
              <button className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                isActive("/courses")
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-slate-700 hover:text-indigo-600 hover:bg-slate-50"
              }`}>
                Courses
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${coursesOpen ? 'rotate-180' : ''}`} />
              </button>

              {coursesOpen && (
                <div 
                  className="absolute top-full left-0 mt-1.5 w-60 bg-white rounded-xl shadow-2xl border border-slate-200/70 overflow-hidden py-1.5 z-50"
                  onMouseEnter={handleCoursesMouseEnter}
                  onMouseLeave={handleCoursesMouseLeave}
                >
                  <Link href="/courses/abacus">
                    <div className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-3 ${
                      isActive("/courses/abacus")
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}>
                      <Calculator className="w-4 h-4" />
                      Study Abacus
                    </div>
                  </Link>
                  <Link href="/courses/vedic-maths">
                    <div className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-3 ${
                      isActive("/courses/vedic-maths")
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}>
                      <BookOpen className="w-4 h-4" />
                      Vedic Maths
                    </div>
                  </Link>
                  <Link href="/courses/handwriting">
                    <div className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-3 ${
                      isActive("/courses/handwriting")
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}>
                      <PenTool className="w-4 h-4" />
                      Handwriting
                    </div>
                  </Link>
                  <Link href="/courses/stem">
                    <div className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-3 ${
                      isActive("/courses/stem")
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}>
                      <Rocket className="w-4 h-4" />
                      STEM
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Create Paper Dropdown */}
            <div 
              ref={createPaperDropdownRef}
              className="relative"
              onMouseEnter={handleCreatePaperMouseEnter}
              onMouseLeave={handleCreatePaperMouseLeave}
            >
              <button className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                isActive("/create") || isActive("/vedic-maths")
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-slate-700 hover:text-indigo-600 hover:bg-slate-50"
              }`}>
                <FileText className="w-4 h-4" />
                Create Paper
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${createPaperOpen ? 'rotate-180' : ''}`} />
              </button>

              {createPaperOpen && (
                <div 
                  className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl shadow-2xl border border-slate-200/70 overflow-hidden py-1.5 z-50"
                  onMouseEnter={handleCreatePaperMouseEnter}
                  onMouseLeave={handleCreatePaperMouseLeave}
                >
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    Abacus
                  </div>
                  <Link href="/create/junior">
                    <div className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-3 ${
                      isActive("/create/junior")
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}>
                      <Sparkles className="w-4 h-4" />
                      Junior Level
                    </div>
                  </Link>
                  <Link href="/create/basic">
                    <div className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-3 ${
                      isActive("/create/basic")
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}>
                      <BookOpen className="w-4 h-4" />
                      Basic Level
                    </div>
                  </Link>
                  <Link href="/create/advanced">
                    <div className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-3 ${
                      isActive("/create/advanced")
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}>
                      <Trophy className="w-4 h-4" />
                      Advanced Level
                    </div>
                  </Link>
                  <div className="px-3 py-2 mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wider border-t border-slate-100 border-b border-slate-100">
                    Vedic Maths
                  </div>
                  <Link href="/vedic-maths/level-1">
                    <div className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-3 ${
                      isActive("/vedic-maths")
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}>
                      <BookOpen className="w-4 h-4" />
                      Vedic Maths
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Mental Math Button */}
            <Link href="/mental">
              <button className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                isActive("/mental")
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-slate-700 hover:text-indigo-600 hover:bg-slate-50"
              }`}>
                <Brain className="w-4 h-4" />
                Mental Math
              </button>
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <div 
                  ref={userMenuRef}
                  className="relative"
                  onMouseEnter={handleUserMenuEnter}
                  onMouseLeave={handleUserMenuLeave}
                >
                  <button className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-50/80 transition-colors">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-9 h-9 rounded-full ring-2 ring-slate-200" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-slate-200">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {userMenuOpen && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200/70 overflow-hidden z-50"
                      onMouseEnter={handleUserMenuEnter}
                      onMouseLeave={handleUserMenuLeave}
                    >
                      <div className="p-3 border-b border-slate-100">
                        <div className="font-semibold text-slate-900 text-sm">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs font-medium text-indigo-600">{user.total_points} points</span>
                          {user.current_streak > 0 && (
                            <span className="text-xs font-medium text-orange-600">🔥 {user.current_streak} day streak</span>
                          )}
                        </div>
                      </div>
                      
                      <Link href="/dashboard">
                        <div className="px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 flex items-center gap-2 cursor-pointer transition-colors">
                          <BarChart3 className="w-4 h-4" />
                          Dashboard
                        </div>
                      </Link>
                      
                      {isAdmin && (
                        <Link href="/admin">
                          <div className="px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50 flex items-center gap-2 cursor-pointer transition-colors">
                            <Shield className="w-4 h-4" />
                            Admin Dashboard
                          </div>
                        </Link>
                      )}
                      
                      <button
                        onClick={logout}
                        className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 text-left transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link href="/login">
                <button className="hidden sm:flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  Sign In
                </button>
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-50/80 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-700" />
              ) : (
                <Menu className="w-6 h-6 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/50 pt-4 pb-4 mt-2">
            <div className="flex flex-col gap-1">
              <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Courses</div>
              <Link href="/courses/abacus" onClick={() => setMobileMenuOpen(false)}>
                <div className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50/80 rounded-lg flex items-center gap-3 transition-colors">
                  <Calculator className="w-4 h-4" />
                  Study Abacus
                </div>
              </Link>
              <Link href="/courses/vedic-maths" onClick={() => setMobileMenuOpen(false)}>
                <div className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50/80 rounded-lg flex items-center gap-3 transition-colors">
                  <BookOpen className="w-4 h-4" />
                  Vedic Maths
                </div>
              </Link>
              <Link href="/courses/handwriting" onClick={() => setMobileMenuOpen(false)}>
                <div className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50/80 rounded-lg flex items-center gap-3 transition-colors">
                  <PenTool className="w-4 h-4" />
                  Handwriting
                </div>
              </Link>
              <Link href="/courses/stem" onClick={() => setMobileMenuOpen(false)}>
                <div className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50/80 rounded-lg flex items-center gap-3 transition-colors">
                  <Rocket className="w-4 h-4" />
                  STEM
                </div>
              </Link>
              <div className="border-t border-slate-200/50 my-2"></div>
              <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Create Paper</div>
              <div className="px-2 py-1">
                <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Abacus</div>
                <Link href="/create/junior" onClick={() => setMobileMenuOpen(false)}>
                  <div className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50/80 rounded-lg flex items-center gap-3 transition-colors">
                    <Sparkles className="w-4 h-4" />
                    Junior Level
                  </div>
                </Link>
                <Link href="/create/basic" onClick={() => setMobileMenuOpen(false)}>
                  <div className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50/80 rounded-lg flex items-center gap-3 transition-colors">
                    <BookOpen className="w-4 h-4" />
                    Basic Level
                  </div>
                </Link>
                <Link href="/create/advanced" onClick={() => setMobileMenuOpen(false)}>
                  <div className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50/80 rounded-lg flex items-center gap-3 transition-colors">
                    <Trophy className="w-4 h-4" />
                    Advanced Level
                  </div>
                </Link>
                <div className="px-2 py-1 mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vedic Maths</div>
                <Link href="/vedic-maths/level-1" onClick={() => setMobileMenuOpen(false)}>
                  <div className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50/80 rounded-lg flex items-center gap-3 transition-colors">
                    <BookOpen className="w-4 h-4" />
                    Vedic Maths
                  </div>
                </Link>
              </div>
              <Link href="/mental" onClick={() => setMobileMenuOpen(false)}>
                <div className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50/80 rounded-lg transition-colors">
                  Mental Math
                </div>
              </Link>
              {!isAuthenticated && (
                <div className="mt-3 pt-3 border-t border-slate-200/50">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="mx-4 w-auto px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:shadow-lg transition-all">
                      Sign In
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
