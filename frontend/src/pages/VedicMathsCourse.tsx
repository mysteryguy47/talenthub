import { Link } from "wouter";
import { ArrowLeft, BookOpen, Clock, Users, Award, Star, Target, Zap, Brain, TrendingUp, CheckCircle2, Sparkles } from "lucide-react";

export default function VedicMathsCourse() {
  const reviews = [
    { name: "Anjali Mehta", rating: 5, comment: "Vedic Maths has made calculations so much easier for my son! He's now the fastest in his class." },
    { name: "Vikram Desai", rating: 5, comment: "The sutras are magical! My daughter can solve complex problems in seconds now." },
    { name: "Sneha Reddy", rating: 5, comment: "Best decision to enroll. The mental calculation speed improvement is incredible." },
    { name: "Karan Malhotra", rating: 5, comment: "Perfect for competitive exams. These techniques are game-changers!" }
  ];

  const benefits = [
    { icon: Zap, title: "Lightning Fast", desc: "Calculate 10-15 times faster than conventional methods" },
    { icon: Brain, title: "Mental Agility", desc: "Develop sharper mental calculation skills" },
    { icon: Target, title: "Exam Success", desc: "Perfect for competitive and board exams" },
    { icon: TrendingUp, title: "Concept Clarity", desc: "Understand number patterns and relationships" },
    { icon: Award, title: "Confidence Boost", desc: "Build confidence through mastery of techniques" },
    { icon: Sparkles, title: "Creative Thinking", desc: "Enhance creative problem-solving abilities" }
  ];

  const curriculum = [
    { 
      level: "Level 1", 
      topics: ["Introduction to Vedic Maths", "Sutras and Sub-sutras", "Base method for multiplication", "Nikhilam multiplication"]
    },
    { 
      level: "Level 2", 
      topics: ["Vertical & Crosswise multiplication", "Squaring numbers", "Division techniques", "Digit sum method"]
    },
    { 
      level: "Level 3", 
      topics: ["Square roots", "Cube roots", "Percentage calculations", "LCM & HCF methods"]
    },
    { 
      level: "Level 4", 
      topics: ["Advanced multiplication", "Complex division", "Magic squares", "Competition-level problems"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700/50 to-pink-700/50"></div>
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
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Vedic Mathematics
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Ancient techniques for modern minds. Master 16 sutras and unlock the power of rapid mental calculations.
            </p>
            <Link href="/vedic-maths/level-1">
              <button className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-purple-600 bg-white rounded-2xl shadow-2xl hover:shadow-white/50 transform hover:-translate-y-1 transition-all duration-300">
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
              <Clock className="w-8 h-8 text-purple-600" />
              Ancient Wisdom, Modern Application
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed mb-6 font-medium">
                Vedic Mathematics is a collection of techniques based on the ancient Indian system of mathematics found in the Vedas. These methods were rediscovered by Sri Bharati Krishna Tirthaji (1884-1960) between 1911 and 1918 and published in 1965 as "Vedic Mathematics."
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mb-6 font-medium">
                The system is based on 16 Sutras (formulas) and 13 Sub-sutras (sub-formulas) that provide a systematic approach to solving mathematical problems. These techniques enable students to perform calculations mentally, often 10-15 times faster than conventional methods.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed font-medium">
                What makes Vedic Mathematics unique is its simplicity and flexibility. The same problem can be solved using different sutras, allowing students to choose the method that works best for them. This approach not only speeds up calculations but also enhances understanding of mathematical concepts and patterns.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Learn Vedic Maths?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Unlock incredible advantages for academic and competitive success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl border border-slate-200/50 transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
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
              Comprehensive Curriculum
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Four progressive levels from fundamentals to mastery
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {curriculum.map((level, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-xl font-bold text-white">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{level.level}</h3>
                <ul className="space-y-2">
                  {level.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 font-medium">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Key Sutras */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200/50">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">
              Core Principles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-xl font-bold text-purple-900 mb-3">16 Main Sutras</h3>
                <p className="text-slate-700 font-medium">
                  Fundamental formulas covering all arithmetic operations, from basic addition to complex calculations like square roots and cube roots.
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-xl p-6 border border-pink-200">
                <h3 className="text-xl font-bold text-pink-900 mb-3">13 Sub-sutras</h3>
                <p className="text-slate-700 font-medium">
                  Supporting formulas that complement the main sutras, providing additional methods and shortcuts for specific problem types.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Student Success Stories
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Real results from our Vedic Maths learners
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
          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 rounded-3xl p-12 md:p-16 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700/50 to-pink-700/50"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Begin Your Vedic Maths Journey
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium">
                Master ancient techniques and transform your calculation speed. Start your learning journey today.
              </p>
              <Link href="/vedic-maths/level-1">
                <button className="group inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-purple-600 bg-white rounded-2xl shadow-2xl hover:shadow-white/50 transform hover:-translate-y-1 transition-all duration-300">
                  Start Learning Now
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


