import { useState } from "react";
import { Link } from "wouter";
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
  Rocket
} from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const userName = user?.name?.split(' ')[0] || 'there';
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const toggleCourse = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative container mx-auto px-6 py-16 md:py-20">
          {/* Hero Section */}
        <div id="hero-section" className="max-w-6xl mx-auto text-center mb-20 md:mb-24 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full text-sm font-semibold text-blue-600 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Sparkles className="w-4 h-4" />
            <span>Welcome to the Future of Math Learning</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              {isAuthenticated ? `Welcome back, ${userName}!` : 'Master Mathematics'}
            </span>
            {isAuthenticated && (
              <span className="block text-slate-900 mt-2 text-3xl md:text-4xl lg:text-5xl">
                Ready for another challenge?
              </span>
            )}
            {!isAuthenticated && (
              <span className="block text-slate-900 mt-2">
                Your Way
              </span>
            )}
            </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            {isAuthenticated 
              ? "Continue your journey to mathematical excellence. Practice, track your progress, and watch yourself improve every day."
              : "Create stunning practice papers, challenge your mental math skills, and track your progress—all in one beautiful, intuitive platform designed for students who refuse to settle."
            }
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 md:mb-16">
            {isAuthenticated ? (
              <>
                <Link href="/mental">
                  <button className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <span className="relative z-10 flex items-center gap-3">
                      <Brain className="w-5 h-5" />
                      Start Mental Math Practice
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </Link>
                <Link href="/dashboard">
                  <button className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-indigo-600 bg-white/90 backdrop-blur-sm border-2 border-indigo-200 rounded-2xl shadow-lg hover:shadow-xl hover:border-indigo-300 transform hover:-translate-y-1 transition-all duration-300">
                    View Your Progress
                    <Trophy className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/create">
                  <button className="group relative inline-flex items-center justify-center px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <span className="relative z-10 flex items-center gap-3">
                      <Sparkles className="w-5 h-5" />
                      Get Started Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </Link>
                <Link href="/login">
                  <button className="group inline-flex items-center justify-center px-10 py-4 text-base font-semibold text-indigo-600 bg-white/90 backdrop-blur-sm border-2 border-indigo-200 rounded-2xl shadow-lg hover:shadow-xl hover:border-indigo-300 transform hover:-translate-y-1 transition-all duration-300">
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Courses Section */}
        <div className="max-w-7xl mx-auto mb-20 md:mb-24">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Courses Offered by
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mt-2">
                Talent Hub
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Comprehensive programs designed to unlock your full potential
            </p>
          </div>

          <div className="space-y-6">
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
                      <p className="text-slate-600 text-base md:text-lg font-medium">Master the ancient art of mental calculation</p>
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
                          The Abacus is one of the most effective tools for developing mental math skills. Our comprehensive program teaches students to perform complex calculations mentally, improving concentration, memory, and mathematical understanding.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Learn Junior, Basic, and Advanced levels</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Practice with custom-generated worksheets</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Track progress with detailed analytics</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Build mental calculation speed and accuracy</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Improve concentration and cognitive abilities</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-8">
                        <Link href="/courses/abacus">
                          <button className="group w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                            Explore Abacus
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </Link>
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
                      <p className="text-slate-600 text-base md:text-lg font-medium">Ancient techniques for modern minds</p>
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
                          Vedic Mathematics offers powerful techniques to solve complex mathematical problems quickly and efficiently. Learn 16 sutras (formulas) and 13 sub-sutras that make arithmetic operations faster and more intuitive.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Master 4 progressive levels of complexity</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Learn rapid multiplication and division techniques</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Solve square roots and cube roots mentally</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Understand patterns and number relationships</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Build confidence in competitive exams</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-8">
                        <Link href="/courses/vedic-maths">
                          <button className="group w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                            Explore Vedic Maths
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </Link>
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
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Handwriting</h3>
                      <p className="text-slate-600 text-base md:text-lg font-medium">Transform your writing into an art</p>
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
                          Good handwriting is a skill that opens doors. Our structured program helps students develop clear, beautiful, and consistent handwriting through systematic practice and expert guidance.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Learn proper letter formation and spacing</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Practice with guided worksheets and templates</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Develop consistency and legibility</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Improve writing speed without sacrificing quality</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Build confidence in academic writing</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-8">
                        <Link href="/courses/handwriting">
                          <button className="group w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                            Explore Handwriting
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
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
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">STEM</h3>
                      <p className="text-slate-600 text-base md:text-lg font-medium">Robotics • IoT • Drones • Innovation</p>
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
                          Explore the future of technology through our comprehensive STEM program. Master Robotics, IoT, Drones, and more through hands-on projects and real-world applications that prepare you for tomorrow's careers.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Phase 1: Paper Circuits - Learn electronics fundamentals</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Phase 2: Robotics - Build and program robots</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Phase 3: IoT - Create connected smart devices</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Phase 4: Advanced IoT - Cloud and data analytics</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                            </div>
                            <span className="text-slate-700 font-medium">Phase 5: Drones - Master aerial technology</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-8">
                        <Link href="/courses/stem">
                          <button className="group w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                            Explore STEM
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Features Grid */}
        <div className="max-w-7xl mx-auto mb-20 md:mb-24">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Everything You Need to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mt-2">
                Excel in Mathematics
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Powerful tools designed with one goal: helping you become the best mathematician you can be.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl border border-slate-200/50 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <FileText className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Custom Paper Generator</h3>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4">
                  Create professional, customized practice papers tailored to your curriculum. Choose difficulty levels, 
                  question types, and formats that match your learning journey.
                </p>
                <Link href="/create" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
                  Try it now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl border border-slate-200/50 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Brain className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Mental Math Practice</h3>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4">
                  Sharpen your mental calculation skills with timed challenges. Track your speed, accuracy, and progress 
                  as you master complex calculations in your head.
                </p>
                <Link href="/mental" className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all">
                  Start practicing
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl border border-slate-200/50 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <TrendingUp className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Progress Tracking</h3>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4">
                  Watch yourself improve with detailed analytics, progress charts, and personalized insights. 
                  Every practice session brings you closer to mathematical mastery.
                </p>
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all">
                  View dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl border border-slate-200/50 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Award className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Gamification & Rewards</h3>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4">
                  Earn points, unlock badges, and climb leaderboards. Make learning fun and motivating 
                  with our engaging reward system that celebrates every achievement.
                </p>
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-pink-600 font-semibold hover:gap-3 transition-all">
                  See achievements
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl border border-slate-200/50 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Zap className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4">
                  Generate papers in seconds, not minutes. Our optimized platform ensures you spend more 
                  time learning and less time waiting.
                </p>
                <span className="inline-flex items-center gap-2 text-green-600 font-semibold">
                  Instant generation
                </span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl border border-slate-200/50 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Users className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Built for Everyone</h3>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4">
                  Whether you're a student, teacher, or parent, our platform adapts to your needs. 
                  Simple enough for beginners, powerful enough for experts.
                </p>
                <span className="inline-flex items-center gap-2 text-orange-600 font-semibold">
                  Beginner-friendly
                </span>
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
