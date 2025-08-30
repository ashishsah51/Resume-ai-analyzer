import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, BarChart3, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { generateResume } from "../components/generate"
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

interface ResumeAnalysis {
  overallScore: number;
  sections: {
    name: string;
    score: number;
    feedback: string;
  }[];
  strengths: string[];
  improvements: string[];
}

const ResumeScore = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const { toast } = useToast();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { user, setRedirectPath } = useAuth(); // user comes from AuthContext
  const navigate = useNavigate();
  const location = useLocation();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type)) {
        setResumeFile(file);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} is ready for analysis`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, or DOCX file",
          variant: "destructive",
        });
      }
    }
  };

  const handleGenerateScore = async () => {
    if (!resumeFile) {
      toast({
        title: "Missing resume",
        description: "Please upload a resume file",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call
    const formData = new FormData();
    formData.append("resumeFile", resumeFile);
    formData.append("jdText", '');
    formData.append("resumeVsJJob", 'false');

    setIsAnalyzing(true);

    // Make API Call
    try {
      const response = await axios.post("http://localhost:5000/api/analyze", formData);
      setAnalysis(response.data);
    } catch (error) {
      console.error("Server Error:", error);
      alert("❌ Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const handleEnhance = async () => {
    if (!user) {
      // Save current path so we can return after login
      setRedirectPath(location.pathname);
      navigate("/auth");
      return;
    }
    // Implement enhancement logic here
    const resumeText = analysis.improvements
                        .map(keyword => keyword.toUpperCase()) // Map over missingKeywords
                        .join(", "); // Join them into a single string

    setIsEnhancing(true);
    const formData = new FormData();
    formData.append("resumeFile", resumeFile);
    formData.append("sugText", resumeText);

    // Make API Call
    try {
      const response = await axios.post("http://localhost:5000/api/enhance", formData);
      const resumeHTML = generateResume({
        personalInfo: response.data.structuredData.personalInfo,
        experiences: response.data.structuredData.experiences,
        educations: response.data.structuredData.educations,
        certifications: response.data.structuredData.certifications,
        skillSections: response.data.structuredData.skillSections,
        customSections: response.data.structuredData.customSections
      });
      const win = window.open("", "_blank");
      if (!win) {
        alert("Please allow pop-ups in your browser for this feature.");
        setIsEnhancing(false);
        return;
      }
      win.document.write(resumeHTML);
      win.document.close();
    } catch (error) {
      console.error("Server Error:", error);
      alert("❌ Failed to analyze resume. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Resume ATS Score
          </h1>
          <p className="text-xl text-muted-foreground">
            Get an overall ATS compatibility score for your resume
          </p>
        </div>

        {/* Upload Section */}
        <Card className="shadow-card mb-8">
          <CardContent className="p-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary transition-colors">
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Upload Resume
                </h3>
                <p className="text-gray-600 mb-2">
                  Drop your resume here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </label>
            </div>
            
            {resumeFile && (
              <div className="flex items-center justify-center space-x-2 p-4 bg-green-50 rounded-lg mt-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">{resumeFile.name}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generate Score Button */}
        <div className="text-center mb-8">
          <Button
            variant="gradient"
            size="lg"
            onClick={handleGenerateScore}
            disabled={isAnalyzing || !resumeFile}
            className="px-12 py-4 text-lg"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            {isAnalyzing ? "Generating Score..." : "Generate ATS Score"}
          </Button>
        </div>

        {/* Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Overall ATS Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBackground(analysis.overallScore)} border-4 border-current ${getScoreColor(analysis.overallScore)}`}>
                  <span className="text-4xl font-bold">{analysis.overallScore}%</span>
                </div>
                <Progress value={analysis.overallScore} className="w-full max-w-md mx-auto" />
              </CardContent>
            </Card>

            {/* Section Scores */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Section Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.sections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">{section.name}</span>
                      <span className={`font-semibold ${getScoreColor(section.score)}`}>
                        {section.score}%
                      </span>
                    </div>
                    <Progress value={section.score} className="h-2" />
                    <p className="text-sm text-muted-foreground">{section.feedback}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>Strengths</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Areas for Improvement */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-yellow-600">
                    <AlertCircle className="w-5 h-5" />
                    <span>Areas for Improvement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Enhancement Button */}
            <div className="text-center">
              <Button
                variant="gradient"
                size="lg"
                onClick={handleEnhance}
                disabled={isEnhancing}
                className="px-8 py-3"
              >
                <Lightbulb className="w-5 h-5 mr-2" />
                {isEnhancing ? "Enhancing Resume..." : "Enhance Resume"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeScore;