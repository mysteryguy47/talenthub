import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import { 
  Sparkles, 
  FileText, 
  Zap, 
  Award, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Brain,
  Trophy,
  ChevronDown,
  Calculator,
  BookOpen,
  PenTool,
  Rocket,
  Target,
  BarChart3,
  Medal,
  CheckCircle2,
  Flame,
  Star,
  ChevronLeft,
  ChevronRight,
  Phone
} from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const userName = user?.name?.split(' ')[0] || 'there';
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle explore button click - navigate and scroll to top
  const handleExploreClick = (path: string) => {
    setLocation(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  // Handle scroll to courses section
  const scrollToCourses = () => {
    const coursesSection = document.getElementById("courses-section");
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleCourse = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev: number) => (prev === 4 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-purple-100/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '10s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s', animationDuration: '12s' }}></div>
        
        {/* Subtle math symbols - very low opacity */}
        <div className="absolute top-32 right-32 text-slate-200/5 text-9xl font-bold select-none" style={{ fontFamily: 'serif' }}>+</div>
        <div className="absolute bottom-40 left-24 text-slate-200/5 text-8xl font-bold select-none" style={{ fontFamily: 'serif' }}>×</div>
        <div className="absolute top-60 left-1/2 text-slate-200/5 text-7xl font-bold select-none" style={{ fontFamily: 'serif' }}>÷</div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-32 md:pb-28">
        {/* Hero Section */}
        <div 
          id="hero-section" 
          className="max-w-5xl mx-auto text-center"
          style={{
            animation: 'fadeUp 0.8s ease-out',
          }}
        >
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
            Building Speed, Accuracy &<br className="hidden sm:block" />
            <span className="text-indigo-600"> Confidence</span> in Young Minds
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-8 md:mb-10 max-w-4xl mx-auto leading-relaxed font-normal">
            Master <span className="font-semibold text-slate-700">Abacus</span>, <span className="font-semibold text-slate-700">Vedic Maths</span>, <span className="font-semibold text-slate-700">Handwriting</span>, and <span className="font-semibold text-slate-700">STEM</span> through our comprehensive online and offline programs. 
            <span className="block mt-2 text-base sm:text-lg">
              Trusted by parents for <span className="font-semibold text-indigo-600">18+ years</span> of teaching excellence.
            </span>
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-10 md:mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm">
              <Award className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">18+ Years of Excellence</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm">
              <Trophy className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">3 Branches</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm">
              <Users className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">500+ Students Trained</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">Online & Offline Programs</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/mental">
              <button className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Mental Math Practice
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
            <button
              onClick={scrollToCourses}
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-700 bg-white rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Explore Courses
              <BookOpen className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Spacing */}
        <div className="h-16 md:h-20"></div>

        {/* Section 1: Our Programs (Courses) */}
        <div id="courses-section" className="max-w-7xl mx-auto mb-24 md:mb-32">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Our Programs
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-normal">
              Comprehensive courses designed to unlock your full potential
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Course 1: Study Abacus */}
            <div className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden transition-all duration-500 ${expandedCourse === 'abacus' ? 'shadow-2xl border-indigo-300' : 'hover:shadow-2xl hover:border-indigo-200'}`}>
              <div 
                className="cursor-pointer p-6 md:p-8"
                onClick={() => toggleCourse('abacus')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 ${expandedCourse === 'abacus' ? 'scale-110 rotate-6' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
                      <Calculator className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Study Abacus</h3>
                      <p className="text-slate-600 text-sm md:text-base font-medium">Age: 5–15 years (Class 1 onwards) • 10 Progressive Levels</p>
                      <p className="text-slate-500 text-xs md:text-sm mt-1">Calculate everything in your mind in seconds</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-6 h-6 md:w-8 md:h-8 text-slate-400 transition-transform duration-300 ${expandedCourse === 'abacus' ? 'rotate-180 text-indigo-600' : 'group-hover:text-indigo-600'}`} />
                </div>
              </div>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedCourse === 'abacus' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 md:px-8 pb-8 md:pb-12 border-t border-slate-200/50 pt-8">
                  <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="space-y-6">
                      <div className="h-64 md:h-80 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-inner border border-blue-200/50">
                        <div className="text-center">
                          <Calculator className="w-24 h-24 md:w-32 md:h-32 text-blue-600 mx-auto mb-4 opacity-80" />
                          <div className="text-6xl md:text-7xl font-bold text-blue-600/30">1234</div>
                          <div className="text-sm text-blue-600/60 font-semibold mt-2">Visual Learning</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium mb-6">
                          Master lightning-fast mental calculations with the ancient abacus. Our structured program focuses on building speed, accuracy, and concentration through 10 progressive levels.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium"><strong>Focus:</strong> Lightning-fast mental calculations, concentration, accuracy</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">10 Levels: 6 Basic + 4 Advanced</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Suitable for ages 5–15 years (Class 1 onwards)</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-8">
                        <button 
                          onClick={() => handleExploreClick("/courses/abacus")}
                          className="group w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                          Explore Program
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course 2: Vedic Maths */}
            <div className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden transition-all duration-500 ${expandedCourse === 'vedic' ? 'shadow-2xl border-purple-300' : 'hover:shadow-2xl hover:border-purple-200'}`}>
              <div 
                className="cursor-pointer p-6 md:p-8"
                onClick={() => toggleCourse('vedic')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 ${expandedCourse === 'vedic' ? 'scale-110 rotate-6' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
                      <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Vedic Maths</h3>
                      <p className="text-slate-600 text-sm md:text-base font-medium">Age: 10+ years (Class 6 onwards) • 4 Progressive Levels</p>
                      <p className="text-slate-500 text-xs md:text-sm mt-1">Uses sutras & sub-sutras</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-6 h-6 md:w-8 md:h-8 text-slate-400 transition-transform duration-300 ${expandedCourse === 'vedic' ? 'rotate-180 text-purple-600' : 'group-hover:text-purple-600'}`} />
                </div>
              </div>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedCourse === 'vedic' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 md:px-8 pb-8 md:pb-12 border-t border-slate-200/50 pt-8">
                  <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="space-y-6">
                      <div className="h-64 md:h-80 bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 rounded-2xl flex items-center justify-center shadow-inner border border-purple-200/50">
                        <div className="text-center">
                          <BookOpen className="w-24 h-24 md:w-32 md:h-32 text-purple-600 mx-auto mb-4 opacity-80" />
                          <div className="text-5xl md:text-6xl font-bold text-purple-600/30 font-mono">16² = 256</div>
                          <div className="text-sm text-purple-600/60 font-semibold mt-2">Rapid Calculations</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium mb-6">
                          Learn ancient Vedic techniques that make complex calculations easy. Master 16 sutras and 13 sub-sutras for both pen & paper and mental math.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium"><strong>Focus:</strong> Complex calculations made easy (pen & paper + mental)</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">4 progressive levels using sutras & sub-sutras</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Starts from Class 6 (10+ years)</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-8">
                        <button 
                          onClick={() => handleExploreClick("/courses/vedic-maths")}
                          className="group w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                          Explore Program
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course 3: Handwriting */}
            <div className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden transition-all duration-500 ${expandedCourse === 'handwriting' ? 'shadow-2xl border-green-300' : 'hover:shadow-2xl hover:border-green-200'}`}>
              <div 
                className="cursor-pointer p-6 md:p-8"
                onClick={() => toggleCourse('handwriting')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 ${expandedCourse === 'handwriting' ? 'scale-110 rotate-6' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
                      <PenTool className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Handwriting Improvement</h3>
                      <p className="text-slate-600 text-sm md:text-base font-medium">Focus on legibility, speed, confidence</p>
                      <p className="text-slate-500 text-xs md:text-sm mt-1">Structured worksheets & guided practice</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-6 h-6 md:w-8 md:h-8 text-slate-400 transition-transform duration-300 ${expandedCourse === 'handwriting' ? 'rotate-180 text-green-600' : 'group-hover:text-green-600'}`} />
                </div>
              </div>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedCourse === 'handwriting' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 md:px-8 pb-8 md:pb-12 border-t border-slate-200/50 pt-8">
                  <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="space-y-6">
                      <div className="h-64 md:h-80 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center shadow-inner border border-green-200/50">
                        <div className="text-center">
                          <PenTool className="w-24 h-24 md:w-32 md:h-32 text-green-600 mx-auto mb-4 opacity-80" />
                          <div className="text-4xl md:text-5xl font-bold text-green-600/40 font-serif italic">Beautiful</div>
                          <div className="text-4xl md:text-5xl font-bold text-green-600/40 font-serif italic mt-2">Handwriting</div>
                          <div className="text-sm text-green-600/60 font-semibold mt-4">Elegant & Legible</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium mb-6">
                          Develop clear, legible, and confident handwriting through structured practice. Our program focuses on improving legibility, speed, and confidence.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium"><strong>Focus:</strong> Legibility, speed, confidence</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Structured worksheets & guided practice</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-8">
                        <button 
                          onClick={() => handleExploreClick("/courses/handwriting")}
                          className="group w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                          Explore Program
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course 4: STEM */}
            <div className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden transition-all duration-500 ${expandedCourse === 'stem' ? 'shadow-2xl border-orange-300' : 'hover:shadow-2xl hover:border-orange-200'}`}>
              <div 
                className="cursor-pointer p-6 md:p-8"
                onClick={() => toggleCourse('stem')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 ${expandedCourse === 'stem' ? 'scale-110 rotate-6' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
                      <Rocket className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">STEM Program</h3>
                      <p className="text-slate-600 text-sm md:text-base font-medium">5 Progressive Levels</p>
                      <p className="text-slate-500 text-xs md:text-sm mt-1">SHUNYA • CHAKRA • YANTRA • ANANTA • GARUDA</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-6 h-6 md:w-8 md:h-8 text-slate-400 transition-transform duration-300 ${expandedCourse === 'stem' ? 'rotate-180 text-orange-600' : 'group-hover:text-orange-600'}`} />
                </div>
              </div>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedCourse === 'stem' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 md:px-8 pb-8 md:pb-12 border-t border-slate-200/50 pt-8">
                  <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="space-y-6">
                      <div className="h-64 md:h-80 bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-inner border border-orange-200/50">
                        <div className="text-center">
                          <Rocket className="w-24 h-24 md:w-32 md:h-32 text-orange-600 mx-auto mb-4 opacity-80" />
                          <div className="text-5xl md:text-6xl font-bold text-orange-600/40 font-mono">STEM</div>
                          <div className="text-sm text-orange-600/60 font-semibold mt-4">Innovation & Technology</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium mb-6">
                          Master cutting-edge technology through hands-on projects. From paper circuits to drone engineering, build real-world skills.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium"><strong>SHUNYA</strong> – Paper Circuits</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium"><strong>CHAKRA</strong> – Robotics</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium"><strong>YANTRA</strong> – Internet of Things</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium"><strong>ANANTA</strong> – Advanced IoT & AI</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium"><strong>GARUDA</strong> – Drone Engineering</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-8">
                        <button 
                          onClick={() => handleExploreClick("/courses/stem")}
                          className="group w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                          Explore Program
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Practice Tools */}
        <div className="max-w-7xl mx-auto mb-24 md:mb-32">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Real Practice Tools
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-normal">
              Talent Hub is not just marketing—we provide actual tools that help students improve speed, accuracy, and confidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Mental Math Practice */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Mental Math Practice</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Timed challenges to sharpen calculation speed. Practice complex operations mentally and track your improvement.
              </p>
              <Link href="/mental" className="text-indigo-600 font-semibold text-sm hover:underline inline-flex items-center gap-1">
                Try it now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Live Paper Attempt */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Live Paper Attempt</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Real exam-style practice papers with instant feedback. Simulate actual test conditions and improve performance.
              </p>
              <Link href="/create" className="text-blue-600 font-semibold text-sm hover:underline inline-flex items-center gap-1">
                Create paper <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Progress Tracking */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Progress Tracking</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Detailed analytics showing your improvement over time. See exactly where you excel and where to focus.
              </p>
              <Link href="/dashboard" className="text-green-600 font-semibold text-sm hover:underline inline-flex items-center gap-1">
                View dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Streaks, Points & Rewards */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Flame className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Streaks, Points & Rewards</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Earn points for every practice session. Maintain daily streaks and unlock rewards as you progress.
              </p>
              <Link href="/dashboard" className="text-orange-600 font-semibold text-sm hover:underline inline-flex items-center gap-1">
                See rewards <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Leaderboards & Competition */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Leaderboards & Competition</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Compete with peers nationally. Climb rankings, see where you stand, and push yourself to improve.
              </p>
              <Link href="/dashboard" className="text-purple-600 font-semibold text-sm hover:underline inline-flex items-center gap-1">
                View leaderboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Speed & Accuracy */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Speed & Accuracy</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Every tool is designed to improve both speed and accuracy. Track your metrics and see real improvement.
              </p>
              <span className="text-cyan-600 font-semibold text-sm">Built into every practice</span>
            </div>
          </div>
        </div>

        {/* Section 4: Olympiads & Achievements */}
        <div className="max-w-7xl mx-auto mb-24 md:mb-32">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Olympiads & Achievements
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-normal">
              Recognized excellence through national competitions and structured assessments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* National & International Olympiads */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Medal className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">National & International Olympiads</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Participate in prestigious math olympiads every year. Showcase your skills on a national and international stage.
              </p>
            </div>

            {/* Medals & Certificates */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Medals & Certificates</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Earn recognition for your achievements. Receive medals and certificates upon completing each level successfully.
              </p>
            </div>

            {/* Monthly Tests */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Monthly Tests</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Regular assessments every last Sunday of the month. Track your progress and identify areas for improvement.
              </p>
            </div>

            {/* Fun Activities */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Fun & Co-curricular Activities</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Learning goes beyond academics. Engage in fun activities that make education enjoyable and memorable.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Photo Gallery / Carousel */}
        <div className="max-w-7xl mx-auto mb-24 md:mb-32">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Learning in Action
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-normal">
              See our students mastering abacus, improving handwriting, and exploring STEM
            </p>
          </div>

          <div className="relative group">
            <div className="overflow-hidden rounded-2xl bg-slate-100">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
              >
                {/* Placeholder images */}
                {/* Slide 1: Abacus Practice */}
                <div className="min-w-full flex-shrink-0">
                  <div className="aspect-video bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-white/80 rounded-2xl flex items-center justify-center shadow-lg">
                        <Calculator className="w-12 h-12 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Abacus Practice</h3>
                      <p className="text-slate-600">Students mastering mental calculations</p>
                    </div>
                  </div>
                </div>

                {/* Slide 2: Handwriting Improvement */}
                <div className="min-w-full flex-shrink-0">
                  <div className="aspect-video bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-white/80 rounded-2xl flex items-center justify-center shadow-lg">
                        <PenTool className="w-12 h-12 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Handwriting Improvement</h3>
                      <p className="text-slate-600">Structured worksheets and guided practice</p>
                    </div>
                  </div>
                </div>

                {/* Slide 3: STEM Activities */}
                <div className="min-w-full flex-shrink-0">
                  <div className="aspect-video bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-white/80 rounded-2xl flex items-center justify-center shadow-lg">
                        <Rocket className="w-12 h-12 text-orange-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">STEM Activities</h3>
                      <p className="text-slate-600">Hands-on learning with robotics and IoT</p>
                    </div>
                  </div>
                </div>

                {/* Slide 4: Classroom Moments */}
                <div className="min-w-full flex-shrink-0">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-white/80 rounded-2xl flex items-center justify-center shadow-lg">
                        <Users className="w-12 h-12 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Classroom Moments</h3>
                      <p className="text-slate-600">Engaged learning in our physical branches</p>
                    </div>
                  </div>
                </div>

                {/* Slide 5: Vedic Maths */}
                <div className="min-w-full flex-shrink-0">
                  <div className="aspect-video bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-white/80 rounded-2xl flex items-center justify-center shadow-lg">
                        <BookOpen className="w-12 h-12 text-pink-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Vedic Maths</h3>
                      <p className="text-slate-600">Learning ancient techniques for modern minds</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={() => setCurrentImageIndex((prev: number) => (prev === 0 ? 4 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 opacity-70 hover:opacity-100 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev: number) => (prev === 4 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 opacity-70 hover:opacity-100 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {[0, 1, 2, 3, 4].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    currentImageIndex === index ? 'bg-indigo-600 w-8' : 'bg-slate-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Testimonials */}
        <div className="max-w-7xl mx-auto mb-24 md:mb-32">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              What Parents & Students Say
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-normal">
              Based on real parent & student feedback
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed italic">
                "My daughter's calculation speed has improved dramatically. She can now solve complex problems mentally in seconds. The structured approach really works!"
              </p>
              <div className="border-t border-slate-200 pt-4">
                <p className="font-semibold text-slate-900">Priya Sharma</p>
                <p className="text-sm text-slate-500">Parent • New Delhi</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed italic">
                "The Vedic Maths techniques are amazing! My son went from struggling with calculations to being the fastest in his class. Highly recommend Talent Hub!"
              </p>
              <div className="border-t border-slate-200 pt-4">
                <p className="font-semibold text-slate-900">Rajesh Kumar</p>
                <p className="text-sm text-slate-500">Parent • Gurgaon</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed italic">
                "I love practicing mental math on the platform. The leaderboard keeps me motivated, and I've improved so much! The practice tools are really helpful."
              </p>
              <div className="border-t border-slate-200 pt-4">
                <p className="font-semibold text-slate-900">Arjun Nair</p>
                <p className="text-sm text-slate-500">Student • Class 8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Final CTA */}
        <div className="max-w-5xl mx-auto mb-24 md:mb-32">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 rounded-3xl p-10 md:p-14 lg:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-indigo-800/50"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                Give Your Child the Advantage of<br className="hidden md:block" /> Structured Learning
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-normal">
                Join 5000+ students who are building speed, accuracy, and confidence with Talent Hub's proven methods.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/mental">
                  <button className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-900 bg-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                    Start Free Practice
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <button className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200">
                  <Phone className="w-5 h-5 mr-2" />
                  Talk to Us
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="max-w-5xl mx-auto text-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 md:p-14 lg:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/50 to-purple-700/50"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                Ready to Transform Your Math Skills?
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium">
                Join thousands of students who are already mastering mathematics with Talent Hub. 
                Start your journey today—it's free, and it only takes a minute.
              </p>
              <Link href="/login">
                <button className="group inline-flex items-center justify-center px-10 py-4 text-base md:text-lg font-bold text-indigo-600 bg-white rounded-2xl shadow-2xl hover:shadow-white/50 transform hover:-translate-y-1 transition-all duration-300">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 mr-3" />
                  Get Started for Free
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
