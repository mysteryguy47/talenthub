import { Link } from "wouter";
import { ArrowLeft, Calculator, Clock, Users, Award, Star, Target, Zap, Brain, TrendingUp, CheckCircle2 } from "lucide-react";

export default function AbacusCourse() {
  const reviews = [
    { name: "Priya Sharma", rating: 5, comment: "My daughter's math skills improved dramatically! She can now calculate faster than before." },
    { name: "Rajesh Kumar", rating: 5, comment: "Excellent program! The visual learning approach made it easy for my son to understand complex calculations." },
    { name: "Meera Patel", rating: 5, comment: "Best investment in my child's education. The progress tracking features are amazing." },
    { name: "Amit Singh", rating: 5, comment: "The structured curriculum and practice sheets have transformed my daughter's confidence in math." }
  ];

  const benefits = [
    { icon: Brain, title: "Enhanced Mental Math", desc: "Perform complex calculations mentally without pen and paper" },
    { icon: Zap, title: "Improved Speed", desc: "Calculate faster than traditional methods" },
    { icon: Target, title: "Better Concentration", desc: "Develop focus and attention to detail" },
    { icon: TrendingUp, title: "Stronger Memory", desc: "Improve working memory and recall abilities" },
    { icon: Award, title: "Academic Excellence", desc: "Better performance in math exams and competitions" },
    { icon: Users, title: "Confidence Building", desc: "Build self-confidence through skill mastery" }
  ];

  const curriculum = [
    { level: "Junior", topics: ["Basic abacus structure", "Number recognition 1-99", "Simple addition & subtraction", "Single digit operations"] },
    { level: "Basic", topics: ["Two-digit operations", "Advanced addition & subtraction", "Multiplication basics", "Division fundamentals"] },
    { level: "Advanced", topics: ["Multi-digit operations", "Complex multiplication", "Advanced division", "Mental calculation mastery"] }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/50 to-purple-700/50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-20 md:py-28">
          <Link href="/">
            <button className="flex items-center gap-2 px-5 py-3 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl mb-8 transition-all duration-300 group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Home</span>
            </button>
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl mb-8 shadow-xl border border-white/30">
              <Calculator className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Study Abacus
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Master the ancient art of mental calculation. Transform your mathematical abilities with our comprehensive Abacus program.
            </p>
            <Link href="/create">
              <button className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-600 bg-white rounded-2xl shadow-2xl hover:shadow-white/50 transform hover:-translate-y-1 transition-all duration-300">
                Start Learning Now
                <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 md:py-20">
        {/* Brief History */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200/50">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              A Rich History
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed mb-6 font-medium">
                The Abacus, one of the oldest calculating devices in human history, has been used for over 2,500 years. Originating in ancient Mesopotamia and later perfected in China, the abacus revolutionized mathematical computation before modern calculators existed.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mb-6 font-medium">
                Today, learning the abacus is not just about using a tool—it's about training your brain. Studies show that abacus training develops the right hemisphere of the brain, which is responsible for creativity, visualization, and spatial awareness. This makes abacus training incredibly valuable for developing mental math skills.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed font-medium">
                Our modern approach combines traditional abacus techniques with interactive digital tools, making learning both effective and engaging. Students learn to visualize the abacus in their minds, enabling them to perform complex calculations mentally with remarkable speed and accuracy.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Learn Abacus?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Discover the incredible benefits of abacus training
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl border border-slate-200/50 transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600 font-medium">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Curriculum */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Structured Curriculum
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Progressive learning path from beginner to advanced
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {curriculum.map((level, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-2xl font-bold text-white">{index + 1}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{level.level} Level</h3>
                <ul className="space-y-3">
                  {level.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Parents & Students Say
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Real feedback from our community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 font-medium mb-4 leading-relaxed">"{review.comment}"</p>
                <p className="text-slate-600 font-semibold">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700/50 to-purple-700/50"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Start Your Abacus Journey?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium">
                Join thousands of students mastering mental math with our comprehensive Abacus program.
              </p>
              <Link href="/create">
                <button className="group inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-blue-600 bg-white rounded-2xl shadow-2xl hover:shadow-white/50 transform hover:-translate-y-1 transition-all duration-300">
                  Get Started Free
                  <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





