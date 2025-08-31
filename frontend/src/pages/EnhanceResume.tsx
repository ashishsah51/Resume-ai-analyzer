import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Sparkles, Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { renderResumeText, generateResume } from "../components/generate"
import axios from "axios";

const EnhanceResume = () => {
  const instanceUrl = process.env.INSTANCE_URL;
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedText, setEnhancedText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();
  const [enhancedResume, setEnhancedResume] = useState(null); 

  useEffect(() => {
    if (enhancedText !== null) {
      console.log('enhancedResume updated', enhancedText);
    }
  }, [enhancedText]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type)) {
        setResumeFile(file);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} is ready for enhancement`,
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

  const handleEnhance = async () => {
    if (!resumeFile && !resumeText.trim()) {
      toast({
        title: "Missing resume",
        description: "Please upload a resume file or paste resume text",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);
    const formData = new FormData();
    formData.append("resumeFile", resumeFile);
    formData.append("sugText", resumeText);

    // Make API Call
    try {
      const response = await axios.post(`${instanceUrl}/api/enhance`, formData);
      const resumeTxt = renderResumeText(response.data.structuredData);
      setEnhancedResume(response.data);
      setEnhancedText(resumeTxt);
      setSuggestions(response.data.structuredData.mockSuggestion);
      await axios.post(`${instanceUrl}/api/stats/increment/analyze`);
    } catch (error) {
      console.error("Server Error:", error);
      alert("❌ Failed to analyze resume. Please try again.");
    } 
    
    // Simulate API call
    setTimeout(() => {
      setIsEnhancing(false);
    }, 4000);
  };

  const downloadEnhancedResume = async () => {
    const resumeHTML = generateResume({
      personalInfo: enhancedResume.structuredData.personalInfo,
      experiences: enhancedResume.structuredData.experiences,
      educations: enhancedResume.structuredData.educations,
      certifications: enhancedResume.structuredData.certifications,
      skillSections: enhancedResume.structuredData.skillSections,
      customSections: enhancedResume.structuredData.customSections
    });
    try {
      await axios.post(`${instanceUrl}/api/stats/increment/enhance`);
    } catch (err) {
      console.error(err);
    }
    const win = window.open("", "_blank");
    win.document.write(resumeHTML);
    win.document.close();
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(enhancedText);
    toast({
      title: "Copied to clipboard",
      description: "Enhanced resume has been copied to your clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Enhance Your Resume
          </h1>
          <p className="text-xl text-muted-foreground">
            Improve your existing resume with AI-powered suggestions and optimizations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>Upload Resume to Enhance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                    <TabsTrigger value="text">Paste Text</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <input
                        type="file"
                        id="resume-upload"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          Upload your current resume for AI-powered improvements
                        </p>
                      </label>
                    </div>
                    {resumeFile && (
                      <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                        <FileText className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">{resumeFile.name}</span>
                      </div>
                    )}
                    <p className="text-sm text-gray-500">
                      Supported formats: PDF, DOC, DOCX
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="text" className="space-y-4">
                    <Textarea
                      placeholder="Paste your resume text here..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className="min-h-[300px] resize-none"
                    />
                  </TabsContent>
                </Tabs>

                <Button
                  variant="gradient"
                  size="lg"
                  onClick={handleEnhance}
                  disabled={isEnhancing || (!resumeFile && !resumeText.trim())}
                  className="w-full mt-6"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isEnhancing ? "Enhancing Resume..." : "Enhance Resume"}
                </Button>
              </CardContent>
            </Card>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span>Enhancement Suggestions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-muted-foreground text-sm">{suggestion}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Enhanced Resume Output */}
          {enhancedText && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>Enhanced Resume</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadEnhancedResume}>
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                    {enhancedText}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhanceResume;