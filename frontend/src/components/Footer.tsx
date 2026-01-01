import { Link, useLocation } from "wouter";
import { Sparkles, Mail, Github, Linkedin, Twitter, Heart } from "lucide-react";

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
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <a 
              href="/" 
              onClick={handleLogoClick}
              className="flex items-center gap-3 mb-6 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 flex items-center justify-center shadow-2xl group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-110">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                  Talent Hub
                </div>
                <div className="text-sm text-slate-300 font-medium">Empowering Mathematical Excellence</div>
              </div>
            </a>
            <p className="text-slate-300 text-lg leading-relaxed max-w-md mb-6">
              Transforming the way students learn mathematics through innovative tools and personalized practice. 
              We're here to unlock every learner's potential, one calculation at a time.
            </p>
            <div className="flex items-center gap-4">
              <a href="mailto:contact@talenthub.com" className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 group">
                <Mail className="w-5 h-5 text-slate-300 group-hover:text-white" />
              </a>
              <a href="#" className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 group">
                <Github className="w-5 h-5 text-slate-300 group-hover:text-white" />
              </a>
              <a href="#" className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 group">
                <Linkedin className="w-5 h-5 text-slate-300 group-hover:text-white" />
              </a>
              <a href="#" className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 group">
                <Twitter className="w-5 h-5 text-slate-300 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <span className={`text-slate-300 hover:text-white transition-colors cursor-pointer ${location === '/' ? 'text-white font-semibold' : ''}`}>
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/create">
                  <span className="text-slate-300 hover:text-white transition-colors cursor-pointer">
                    Create Papers
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/mental">
                  <span className={`text-slate-300 hover:text-white transition-colors cursor-pointer ${location.startsWith('/mental') ? 'text-white font-semibold' : ''}`}>
                    Mental Math
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <span className={`text-slate-300 hover:text-white transition-colors cursor-pointer ${location.startsWith('/dashboard') ? 'text-white font-semibold' : ''}`}>
                    Dashboard
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Resources</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-slate-300 hover:text-white transition-colors cursor-pointer">
                  Documentation
                </span>
              </li>
              <li>
                <span className="text-slate-300 hover:text-white transition-colors cursor-pointer">
                  Tutorials
                </span>
              </li>
              <li>
                <span className="text-slate-300 hover:text-white transition-colors cursor-pointer">
                  Support
                </span>
              </li>
              <li>
                <span className="text-slate-300 hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm flex items-center gap-2">
            © {new Date().getFullYear()} Talent Hub. Made with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> for students worldwide.
          </p>
          <p className="text-slate-400 text-sm">
            Empowering mathematical excellence, one calculation at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}


