import { Link } from "wouter";
import { ArrowLeft, PenTool, Clock, Users, Award, Star, Target, Zap, Brain, TrendingUp, CheckCircle2, BookOpen } from "lucide-react";

export default function HandwritingCourse() {
  const reviews = [
    { name: "Riya Patel", rating: 5, comment: "My handwriting improved so much! Now my teachers always praise my notes. The systematic approach really works!" },
    { name: "Arjun Nair", rating: 5, comment: "Perfect program! My son's handwriting went from messy to beautiful in just a few months. Highly recommend!" },
    { name: "Kavita Sharma", rating: 5, comment: "The guided practice sheets and expert feedback made all the difference. My daughter's confidence has soared!" },
    { name: "Nikhil Joshi", rating: 5, comment: "Excellent course structure. The step-by-step approach helped me develop consistent and legible handwriting." }
  ];

  const benefits = [
    { icon: BookOpen, title: "Clear Communication", desc: "Write legibly so others can read your work easily" },
    { icon: Award, title: "Academic Success", desc: "Better grades as teachers can clearly understand your answers" },
    { icon: TrendingUp, title: "Professional Image", desc: "Make a strong impression with elegant handwriting" },
    { icon: Zap, title: "Improved Speed", desc: "Write faster while maintaining quality and clarity" },
    { icon: Brain, title: "Cognitive Benefits", desc: "Enhance fine motor skills and hand-eye coordination" },
    { icon: Target, title: "Self-Confidence", desc: "Build confidence through mastery of a fundamental skill" }
  ];

  const curriculum = [
    { 
      level: "Foundation", 
      topics: ["Proper posture and grip", "Basic strokes and lines", "Letter formation basics", "Alphabet practice (A-Z)"]
    },
    { 
      level: "Intermediate", 
      topics: ["Word spacing and alignment", "Sentence structure", "Paragraph writing", "Speed building exercises"]
    },
    { 
      level: "Advanced", 
      topics: ["Cursive writing techniques", "Flourishes and style", "Consistency drills", "Specialized formats"]
    },
    { 
      level: "Mastery", 
      topics: ["Personal style development", "Advanced techniques", "Creative writing", "Professional presentation"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-700/50 to-emerald-700/50"></div>
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
              <PenTool className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Handwriting Excellence
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Transform your writing into an art. Develop clear, beautiful, and consistent handwriting that makes a lasting impression.
            </p>
            <button className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-green-600 bg-white rounded-2xl shadow-2xl hover:shadow-white/50 transform hover:-translate-y-1 transition-all duration-300">
              Enroll Now
              <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 md:py-20">
        {/* Brief History */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200/50">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-600" />
              The Art of Handwriting
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed mb-6 font-medium">
                Handwriting has been a fundamental form of communication for thousands of years. From ancient cave paintings to modern calligraphy, the ability to write clearly and beautifully has always been valued. In today's digital age, good handwriting remains essential for academic success, professional communication, and personal expression.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mb-6 font-medium">
                Research shows that handwriting activates different parts of the brain compared to typing. It improves memory retention, enhances learning, and develops fine motor skills. Studies have found that students who write by hand remember information better and perform better on exams. Good handwriting also boosts confidence and makes a positive impression on teachers, employers, and peers.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed font-medium">
                Our comprehensive handwriting program is designed for students of all ages. We combine traditional techniques with modern teaching methods to help you develop beautiful, legible handwriting. Our structured approach focuses on proper form, consistency, and gradual skill building, ensuring that every student can achieve handwriting excellence.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Handwriting Matters
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Discover the lifelong benefits of excellent handwriting
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl border border-slate-200/50 transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
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
              Four progressive levels from fundamentals to mastery
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {curriculum.map((level, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-xl font-bold text-white">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{level.level}</h3>
                <ul className="space-y-2">
                  {level.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 font-medium">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Makes Our Program Special
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Comprehensive features designed for success
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Guided Practice Sheets</h3>
              <p className="text-slate-700 font-medium leading-relaxed">
                Access hundreds of professionally designed practice sheets that progress from basic strokes to advanced writing. Each sheet is carefully crafted to build skills gradually.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Expert Feedback</h3>
              <p className="text-slate-700 font-medium leading-relaxed">
                Receive personalized feedback from handwriting experts who provide detailed guidance on form, spacing, and style improvements.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Progress Tracking</h3>
              <p className="text-slate-700 font-medium leading-relaxed">
                Monitor your improvement with before-and-after comparisons, progress charts, and milestone achievements that keep you motivated.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Flexible Learning</h3>
              <p className="text-slate-700 font-medium leading-relaxed">
                Learn at your own pace with our flexible program structure. Practice when it's convenient for you and get support when you need it.
              </p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Real stories from our handwriting students
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/50">
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
          <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-12 md:p-16 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Handwriting?
              </h2>
              <p className="text-xl text-white/90 mb-8 font-medium">
                Join thousands of students who have achieved handwriting excellence
              </p>
              <button className="group inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-green-600 bg-white rounded-2xl shadow-2xl hover:shadow-white/50 transform hover:-translate-y-1 transition-all duration-300">
                Enroll Now
                <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





