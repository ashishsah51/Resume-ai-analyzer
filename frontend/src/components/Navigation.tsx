import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, BarChart3, Sparkles, User, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  console.log('user:', user);

  const navItems = [
    { path: "/analyze", label: "Analyze vs Job", icon: BarChart3 },
    { path: "/score", label: "Resume Score", icon: FileText },
    { path: "/enhance", label: "Enhance Resume", icon: Sparkles },
    { path: "/build", label: "Build Resume", icon: User },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Resume AI
              </span>
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            {
              user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-2"
                >
                  <span className="font-medium">Hi, {user.name || user.email}</span>
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/auth")}
                  className="flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )
            }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;