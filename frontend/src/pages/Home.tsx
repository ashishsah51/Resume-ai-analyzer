import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FileText, BarChart3, Sparkles, User, CheckCircle, Users, Star } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const counters = await getCounters();
        setStats([
          { number: `${counters.visitCount}`, label: "Total Visits" },
          { number: "98%", label: "Accuracy Rate" },
          { number: `${counters.resumeAnalyzerCount}`, label: "Resumes Analyzed" },
          { number: `${counters.buildResumeCount + counters.enhanceResumeCount}`, label: "Resumes Built/Enhanced" }
        ]);
      } catch (err) {
        console.error(err);
      }
    }

    async function incrementVisit() {
      try {
        await axios.post("http://localhost:5000/api/stats/increment/visit");
      } catch (err) {
        console.error(err);
      }
    }
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (!hasVisited) {
      incrementVisit(); // call backend once
      sessionStorage.setItem("hasVisited", "true");
    }
    fetchStats();
  }, []);
  const features = [
    {
      icon: BarChart3,
      title: "Analyze vs Job",
      description: "Upload your resume and paste the job description to get detailed ATS compatibility analysis",
      path: "/analyze"
    },
    {
      icon: FileText,
      title: "Resume Score",
      description: "Get an overall ATS compatibility score for your resume",
      path: "/score"
    },
    {
      icon: Sparkles,
      title: "Enhance Resume",
      description: "Improve your existing resume with AI-powered suggestions and optimizations",
      path: "/enhance"
    },
    {
      icon: User,
      title: "Build Resume",
      description: "Create a professional resume from scratch using our intuitive builder",
      path: "/build"
    }
  ];

  const getCounters = async () => {
    const res = await fetch("http://localhost:5000/api/stats");
    const data = await res.json();
    if (!res.ok) throw new Error("Failed to fetch counters");
    return data;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Resume Analysis</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Optimize Your Resume with{" "}
                <span className="text-yellow-300">AI Intelligence</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                Get instant ATS scores, keyword analysis, and AI-powered suggestions to 
                land your dream job. Build professional resumes that pass through 
                applicant tracking systems.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => navigate("/analyze")}
                  className="text-lg px-8 py-4"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Analyze Resume
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg px-8 py-4"
                  onClick={() => navigate("/build")}
                >
                  Build Resume
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src={heroImage} 
                  alt="AI Resume Analysis Dashboard" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 mt-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-yellow-300 mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Resume vs Job Description Analysis
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Upload your resume and paste the job description to get detailed ATS compatibility analysis
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-card transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 bg-white shadow-lg"
                  onClick={() => navigate(feature.path)}
                >
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Optimize Your Resume?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of professionals who have successfully landed their dream jobs with our AI-powered resume optimization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4"
              onClick={() => navigate("/analyze")}
            >
              Start Analyzing Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-primary hover:bg-white/10 text-lg px-8 py-4"
              onClick={() => navigate("/auth")}
            >
              Create Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;