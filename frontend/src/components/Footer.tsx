import { Link, useLocation } from "wouter";
import { GraduationCap, Mail, Phone, MapPin, Instagram, Heart } from "lucide-react";

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

      <div className="relative container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <a 
              href="/" 
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 mb-4 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-105">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                  Talent Hub
                </div>
                <div className="text-xs text-slate-400 font-medium">Empowering Mathematical Excellence</div>
              </div>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-4">
              Transforming mathematics learning through innovative tools and personalized practice.
            </p>
            <div className="flex items-center gap-3">
              <a href="mailto:ayushkhurana47@gmail.com" className="w-9 h-9 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-200 group">
                <Mail className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </a>
              <a href="tel:9266117055" className="w-9 h-9 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-200 group">
                <Phone className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-200 group">
                <MapPin className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </a>
              <a href="https://www.instagram.com/talenthub16?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-200 group">
                <Instagram className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/">
                  <span className={`text-sm text-slate-400 hover:text-white transition-colors cursor-pointer ${location === '/' ? 'text-white font-medium' : ''}`}>
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/create">
                  <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">
                    Create Papers
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/mental">
                  <span className={`text-sm text-slate-400 hover:text-white transition-colors cursor-pointer ${location.startsWith('/mental') ? 'text-white font-medium' : ''}`}>
                    Mental Math
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <span className={`text-sm text-slate-400 hover:text-white transition-colors cursor-pointer ${location.startsWith('/dashboard') ? 'text-white font-medium' : ''}`}>
                    Dashboard
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Documentation
                </span>
              </li>
              <li>
                <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Tutorials
                </span>
              </li>
              <li>
                <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Support
                </span>
              </li>
              <li>
                <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Branch Locations */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Branches</h3>
            <ul className="space-y-2.5">
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
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            © {new Date().getFullYear()} Talent Hub. Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for students worldwide.
          </p>
          <p className="text-xs text-slate-500">
            Empowering mathematical excellence, one calculation at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}


