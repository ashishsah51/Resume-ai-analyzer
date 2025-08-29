import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import AnalyzeVsJob from "./pages/AnalyzeVsJob";
import ResumeScore from "./pages/ResumeScore";
import EnhanceResume from "./pages/EnhanceResume";
import BuildResume from "./pages/BuildResume";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<AnalyzeVsJob />} />
          <Route path="/score" element={<ResumeScore />} />
          <Route path="/enhance" element={<ProtectedRoute><EnhanceResume /></ProtectedRoute>} />
          <Route path="/build" element={<ProtectedRoute><BuildResume /></ProtectedRoute>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
