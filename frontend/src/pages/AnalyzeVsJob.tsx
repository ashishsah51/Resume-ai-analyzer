import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, BarChart3, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { generateResume } from "../components/generate"
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

interface ATSResult {
  atsScore: number;
  domain: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  explanation: string;
  suggestions: string[];
}

const AnalyzeVsJob = () => {
  const instanceUrl = process.env.INSTANCE_URL;
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
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

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please upload a resume and enter job description",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("resumeFile", resumeFile);
    formData.append("jdText", jobDescription);
    formData.append("resumeVsJJob", 'true');

    setIsAnalyzing(true);

    // Make API Call
    try {
      const response = await axios.post(`${instanceUrl}/api/analyze`, formData);
      setResult(response.data);
      await axios.post(`${instanceUrl}/api/stats/increment/analyze`);
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
    const resumeText = result.missingKeywords
                        .map(keyword => keyword.toUpperCase()) // Map over missingKeywords
                        .concat(result.suggestions.map(suggestion => suggestion.toLowerCase())) // Map over suggestions and concatenate
                        .join(", "); // Join them into a single string

    setIsEnhancing(true);
    const formData = new FormData();
    formData.append("resumeFile", resumeFile);
    formData.append("sugText", resumeText);

    // Make API Call
    try {
      const response = await axios.post(`${instanceUrl}/api/enhance`, formData);
      console.log('Enhancement response:', response);
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
      await axios.post(`${instanceUrl}/api/stats/increment/enhance`);
    } catch (error) {
      console.log(error.message);
      console.error("Server Error:", error);
      alert("❌ Failed to analyze resume. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Resume vs Job Description Analysis
          </h1>
          <p className="text-xl text-muted-foreground">
            Upload your resume and paste the job description to get detailed ATS compatibility analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Upload Resume */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-primary" />
                <span>Upload Resume</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drop your resume here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported formats: PDF, DOC, DOCX
                  </p>
                </label>
              </div>
              {resumeFile && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">{resumeFile.name}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Job Description</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="job-description" className="sr-only">
                Paste the job description here
              </Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Analyze Button */}
        <div className="text-center mb-8">
          <Button
            variant="gradient"
            size="lg"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !resumeFile || !jobDescription.trim()}
            className="px-12 py-4 text-lg"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            {isAnalyzing ? "Analyzing..." : "Analyze ATS Score"}
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Score Overview */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-center text-2xl">ATS Compatibility Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBackground(result.atsScore)} border-4 border-current ${getScoreColor(result.atsScore)}`}>
                  <span className="text-4xl font-bold">{result.atsScore}%</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {result.domain}
                  </h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {result.explanation}
                  </p>
                </div>
                <Progress value={result.atsScore} className="w-full max-w-md mx-auto" />
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Matched Keywords */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>Matched Keywords</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedKeywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Missing Keywords */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    <span>Missing Keywords</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Suggestions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <span>Improvement Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-muted-foreground">{suggestion}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

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

export default AnalyzeVsJob;