import { Link, useLocation } from "wouter";
import { GraduationCap, MapPin, Heart, Calculator, BookOpen, PenTool, Rocket, FileText, Brain, Trophy, BarChart3 } from "lucide-react";

export default function Footer() {
  const [location, setLocation] = useLocation();

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

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-6">
          {/* Column 1: Brand */}
          <div className="lg:col-span-2">
            <a 
              href="/" 
              onClick={handleLogoClick}
              className="flex items-center gap-3 mb-4 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">
                  Talent Hub
                </div>
                <div className="text-xs text-slate-400 font-medium">Empowering Mathematical Excellence</div>
              </div>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-4">
              Transforming mathematics learning through innovative tools and personalized practice.
            </p>
            <p className="text-slate-500 text-xs font-medium">
              18+ Years of Teaching Excellence
            </p>
          </div>

          {/* Column 2: Programs */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Programs</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/courses/abacus">
                  <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                    <Calculator className="w-3.5 h-3.5" />
                    Abacus
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/courses/vedic-maths">
                  <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    Vedic Maths
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/courses/handwriting">
                  <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                    <PenTool className="w-3.5 h-3.5" />
                    Handwriting
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/courses/stem">
                  <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                    <Rocket className="w-3.5 h-3.5" />
                    STEM
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Tools */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Tools</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/create">
                  <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    Create Papers
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/mental">
                  <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                    <Brain className="w-3.5 h-3.5" />
                    Mental Math
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5" />
                    Leaderboard
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5" />
                    Progress Tracking
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Branches */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Contact & Branches</h3>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium">Rohini Sector - 16</p>
                  <p className="text-xs text-slate-400">New Delhi</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium">Rohini Sector - 11</p>
                  <p className="text-xs text-slate-400">New Delhi</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-pink-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium">Gurgaon</p>
                  <p className="text-xs text-slate-400">Haryana</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © 2026 Talent Hub. Made with <Heart className="w-3 h-3 text-red-400 fill-red-400 inline" /> for students worldwide.
          </p>
          <p className="text-xs text-slate-500">
            Empowering mathematical excellence, one calculation at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}


