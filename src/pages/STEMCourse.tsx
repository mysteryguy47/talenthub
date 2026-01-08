import { Link } from "wouter";
import { ArrowLeft, Cpu, Clock, Users, Award, Star, Target, Zap, Brain, TrendingUp, CheckCircle2, Rocket, CircuitBoard, Bot, Wifi, Satellite } from "lucide-react";

export default function STEMCourse() {
  const phases = [
    { 
      icon: CircuitBoard,
      title: "Paper Circuits", 
      desc: "Learn the fundamentals of electronics through hands-on paper circuit projects. Understand basic concepts of electricity, circuits, and conductivity in a fun, accessible way.",
      topics: ["Basic circuit concepts", "Conductive materials", "LED integration", "Series and parallel circuits", "Creative circuit design"]
    },
    { 
      icon: Bot,
      title: "Robotics", 
      desc: "Dive into the world of robotics! Build and program robots to perform tasks. Learn about sensors, motors, and programming logic while creating amazing robotic projects.",
      topics: ["Robot assembly", "Sensor integration", "Basic programming", "Motor control", "Problem-solving with robots"]
    },
    { 
      icon: Wifi,
      title: "IoT (Internet of Things)", 
      desc: "Connect everyday objects to the internet! Learn to create smart devices that communicate and interact. Build projects that combine hardware and software seamlessly.",
      topics: ["IoT fundamentals", "Microcontrollers", "Wireless communication", "Data collection", "Remote monitoring"]
    },
    { 
      icon: Cpu,
      title: "Advanced IoT", 
      desc: "Take your IoT skills to the next level! Work with advanced sensors, cloud platforms, and data analytics. Create sophisticated connected systems with real-world applications.",
      topics: ["Advanced sensors", "Cloud integration", "Data analytics", "Machine learning basics", "Industrial IoT applications"]
    },
    { 
      icon: Rocket,
      title: "Drones", 
      desc: "Master the technology behind unmanned aerial vehicles! Learn drone assembly, flight controls, programming, and applications. Explore aerial photography, mapping, and autonomous flight.",
      topics: ["Drone mechanics", "Flight controls", "Aerial photography", "GPS navigation", "Autonomous programming"]
    }
  ];

  const benefits = [
    { icon: Brain, title: "Problem Solving", desc: "Develop critical thinking and analytical skills through hands-on projects" },
    { icon: Target, title: "Future Ready", desc: "Prepare for careers in technology, engineering, and innovation" },
    { icon: Zap, title: "Creative Innovation", desc: "Combine creativity with technology to build amazing projects" },
    { icon: TrendingUp, title: "Skill Development", desc: "Learn coding, electronics, and engineering concepts" },
    { icon: Award, title: "Portfolio Building", desc: "Create impressive projects for your portfolio and college applications" },
    { icon: Users, title: "Collaboration", desc: "Work on team projects and learn collaboration skills" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-4 text-center font-bold text-lg shadow-lg">
        🚀 Coming Soon - Enrollments Opening Next Month! 🚀
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-700/50 to-pink-700/50"></div>
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
              <Rocket className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              STEM Innovation
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Explore the future of technology! Master Robotics, IoT, Drones, and more through hands-on projects and real-world applications.
            </p>
            <button className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-orange-600 bg-white rounded-2xl shadow-2xl hover:shadow-white/50 transform hover:-translate-y-1 transition-all duration-300 opacity-75 cursor-not-allowed" disabled>
              Coming Soon
              <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 md:py-20">
        {/* Overview */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200/50">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Clock className="w-8 h-8 text-orange-600" />
              The Future is STEM
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed mb-6 font-medium">
                Science, Technology, Engineering, and Mathematics (STEM) education is the cornerstone of innovation and progress in the 21st century. Our comprehensive STEM program is designed to ignite curiosity, foster creativity, and build real-world skills that prepare students for the careers of tomorrow.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mb-6 font-medium">
                From building paper circuits to programming autonomous drones, our curriculum takes students on an exciting journey through cutting-edge technologies. Each phase builds upon the previous one, ensuring a solid foundation while encouraging exploration and innovation. Students learn by doing, working on projects that combine theory with practical application.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed font-medium">
                Our hands-on approach ensures that students don't just learn about technology—they create it. Whether it's designing a smart home system, programming a robot, or flying a drone, every project reinforces critical thinking, problem-solving, and collaboration skills that are essential in today's interconnected world.
              </p>
            </div>
          </div>
        </div>

        {/* 5 Phases */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Five Exciting Phases
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Progressive learning from fundamentals to advanced applications
            </p>
          </div>

          <div className="space-y-8">
            {phases.map((phase, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <phase.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="mt-4 text-center md:text-left">
                      <div className="inline-flex items-center justify-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                        Phase {index + 1}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{phase.title}</h3>
                    <p className="text-lg text-slate-700 font-medium leading-relaxed mb-4">{phase.desc}</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {phase.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 font-medium">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose STEM?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Discover the incredible advantages of STEM education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl border border-slate-200/50 transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600 font-medium">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Program Highlights
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              What makes our STEM program exceptional
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Project-Based Learning</h3>
              <p className="text-slate-700 font-medium leading-relaxed">
                Every concept is reinforced through hands-on projects. Build real devices, solve real problems, and see your ideas come to life.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Expert Instructors</h3>
              <p className="text-slate-700 font-medium leading-relaxed">
                Learn from industry professionals and experienced educators who bring real-world expertise to every lesson.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Certification</h3>
              <p className="text-slate-700 font-medium leading-relaxed">
                Earn certificates upon completion of each phase, building a portfolio that showcases your technical skills and achievements.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Career Preparation</h3>
              <p className="text-slate-700 font-medium leading-relaxed">
                Develop skills that are in high demand. Our curriculum aligns with industry needs, preparing you for exciting careers in technology.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 rounded-3xl p-12 md:p-16 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Be Among the First to Enroll!
              </h2>
              <p className="text-xl text-white/90 mb-8 font-medium">
                Join our waitlist and get notified when enrollments open. Start your STEM journey with us!
              </p>
              <button className="group inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-orange-600 bg-white rounded-2xl shadow-2xl hover:shadow-white/50 transform hover:-translate-y-1 transition-all duration-300 opacity-75 cursor-not-allowed" disabled>
                Join Waitlist (Coming Soon)
                <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





