import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Plus, 
  Trash2, 
  Download,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateResume } from "../components/generate";
import { jsPDF } from "jspdf";
import axios from "axios";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  profession: string;
  summary: string;
  linkedin?: string;
  github?: string;
}

interface Experience {
  company: string;
  position: string;
  place: string;
  duration: string;
  achievements: string[];
}

interface Education {
  institution: string;
  degree: string;
  details: string;
  place: string;
  year: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  details: string;
  link?: string;
}

interface SkillSection {
  header: string;
  skills: string[];
}

interface CustomSection {
  name: string;
  items: {
    title: string;
    place: string;
    duration: string;
    description: string;
    content: string[];
  }[];
}

const BuildResume = () => {
  const instanceUrl = import.meta.env.INSTANCE_URL;
  const [activeTab, setActiveTab] = useState("personal");
  const { toast } = useToast();

  // State for all resume sections
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    profession: "",
    summary: "",
    linkedin: "",
    github: ""
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    { company: "", position: "", place: "", duration: "", achievements: [""] }
  ]);

  const [educations, setEducations] = useState<Education[]>([
    { institution: "", degree: "", details: "", place: "", year: "" }
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    { name: "", issuer: "", date: "", details: "", link: "" }
  ]);

  const [skillSections, setSkillSections] = useState<SkillSection[]>([
    { header: "Technical Skills", skills: [""] }
  ]);

  const [customSections, setCustomSections] = useState<CustomSection[]>([]);

  const addExperience = () => {
    setExperiences([...experiences, { company: "", position: "", place: "", duration: "", achievements: [""] }]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addAchievement = (expIndex: number) => {
    const updated = [...experiences];
    updated[expIndex].achievements.push("");
    setExperiences(updated);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  const addEducation = () => {
    setEducations([...educations, { institution: "", degree: "", details: "", place: "", year: "" }]);
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducations(updated);
  };

  const addCertification = () => {
    setCertifications([...certifications, { name: "", issuer: "", date: "", details: "", link: "" }]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const addSkillSection = () => {
    setSkillSections([...skillSections, { header: "", skills: [""] }]);
  };

  const addSkill = (sectionIndex: number) => {
    const updated = [...skillSections];
    updated[sectionIndex].skills.push("");
    setSkillSections(updated);
  };

  const downloadEnhancedResume = async () => {

    const resumeHTML = generateResume({
          personalInfo: personalInfo,
          experiences: experiences,
          educations: educations,
          certifications: certifications,
          skillSections: skillSections,
          customSections: customSections
    });
    const win = window.open("", "_blank");
    win.document.write(resumeHTML);
    win.document.close();
    
    toast({
      title: "Resume Generated!",
      description: "Your resume has been generated successfully.",
    });

    try {
      await axios.post(`${instanceUrl}/api/stats/increment/build`);
    } catch (err) {
      console.error(err);
    }

    // Here you would typically send this data to your backend or generate a PDF
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Professional Resume Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            Build your professional resume with our easy-to-use builder
          </p>
        </div>

        {/* Horizontal Navigation Tabs */}
        <Card className="shadow-card mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { id: "personal", label: "Personal", icon: User },
                { id: "experience", label: "Experience", icon: Briefcase },
                { id: "education", label: "Education", icon: GraduationCap },
                { id: "certifications", label: "Certifications", icon: Award },
                { id: "skills", label: "Skills", icon: Code },
                { id: "custom", label: "Custom", icon: Plus },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-lg"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Form Content */}
        <div>
            <Card className="shadow-card">
              <CardContent className="p-8">
                {/* Personal Information */}
                {activeTab === "personal" && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <User className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold">Personal Information</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={personalInfo.fullName}
                          onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                          placeholder="john.doe@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={personalInfo.location}
                          onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                          placeholder="City, State"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="profession">Profession</Label>
                      <Input
                        id="profession"
                        value={personalInfo.profession}
                        onChange={(e) => setPersonalInfo({...personalInfo, profession: e.target.value})}
                        placeholder="Software Engineer"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input
                          id="linkedin"
                          value={personalInfo.linkedin}
                          onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
                          placeholder="linkedin.com/in/johndoe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="github">GitHub Profile</Label>
                        <Input
                          id="github"
                          value={personalInfo.github}
                          onChange={(e) => setPersonalInfo({...personalInfo, github: e.target.value})}
                          placeholder="github.com/johndoe"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="summary">Professional Summary *</Label>
                      <Textarea
                        id="summary"
                        value={personalInfo.summary}
                        onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})}
                        placeholder="Brief overview of your professional background and key achievements..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                )}

                {/* Experience Section */}
                {activeTab === "experience" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">Work Experience</h2>
                      </div>
                      <Button onClick={addExperience} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Experience
                      </Button>
                    </div>

                    {experiences.map((exp, index) => (
                      <Card key={index} className="border">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold">Experience {index + 1}</h3>
                            {experiences.length > 1 && (
                              <Button 
                                onClick={() => removeExperience(index)} 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Company</Label>
                              <Input
                                value={exp.company}
                                onChange={(e) => updateExperience(index, "company", e.target.value)}
                                placeholder="Company Name"
                              />
                            </div>
                            <div>
                              <Label>Position</Label>
                              <Input
                                value={exp.position}
                                onChange={(e) => updateExperience(index, "position", e.target.value)}
                                placeholder="Job Title"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Location</Label>
                              <Input
                                value={exp.place}
                                onChange={(e) => updateExperience(index, "place", e.target.value)}
                                placeholder="City, State"
                              />
                            </div>
                            <div>
                              <Label>Duration</Label>
                              <Input
                                value={exp.duration}
                                onChange={(e) => updateExperience(index, "duration", e.target.value)}
                                placeholder="Jan 2020 - Present"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <Label>Key Achievements</Label>
                              <Button 
                                onClick={() => addAchievement(index)}
                                variant="outline" 
                                size="sm"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add
                              </Button>
                            </div>
                            {exp.achievements.map((achievement, achIndex) => (
                              <div key={achIndex} className="flex gap-2 mb-2">
                                <Input
                                  value={achievement}
                                  onChange={(e) => {
                                    const updated = [...experiences];
                                    updated[index].achievements[achIndex] = e.target.value;
                                    setExperiences(updated);
                                  }}
                                  placeholder="Describe your achievement..."
                                  className="flex-1"
                                />
                                {exp.achievements.length > 1 && (
                                  <Button
                                    onClick={() => {
                                      const updated = [...experiences];
                                      updated[index].achievements.splice(achIndex, 1);
                                      setExperiences(updated);
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Other sections would be implemented similarly... */}
                {/* For brevity, I'll show just the structure for other tabs */}
                
                {activeTab === "education" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">Education</h2>
                      </div>
                      <Button onClick={addEducation} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Education
                      </Button>
                    </div>

                    {educations.map((edu, index) => (
                      <Card key={index} className="border">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold">Education {index + 1}</h3>
                            {educations.length > 1 && (
                              <Button 
                                onClick={() => removeEducation(index)} 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Institution</Label>
                              <Input
                                value={edu.institution}
                                onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                placeholder="University Name"
                              />
                            </div>
                            <div>
                              <Label>Degree</Label>
                              <Input
                                value={edu.degree}
                                onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                placeholder="Bachelor of Science"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Location</Label>
                              <Input
                                value={edu.place}
                                onChange={(e) => updateEducation(index, "place", e.target.value)}
                                placeholder="City, State"
                              />
                            </div>
                            <div>
                              <Label>Year</Label>
                              <Input
                                value={edu.year}
                                onChange={(e) => updateEducation(index, "year", e.target.value)}
                                placeholder="2020"
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Details</Label>
                            <Textarea
                              value={edu.details}
                              onChange={(e) => updateEducation(index, "details", e.target.value)}
                              placeholder="GPA, honors, relevant coursework..."
                              className="min-h-[80px]"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Certifications Section */}
                {activeTab === "certifications" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <Award className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">Certifications</h2>
                      </div>
                      <Button onClick={addCertification} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Certification
                      </Button>
                    </div>

                    {certifications.map((cert, index) => (
                      <Card key={index} className="border">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold">Certification {index + 1}</h3>
                            {certifications.length > 1 && (
                              <Button 
                                onClick={() => removeCertification(index)} 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Certification Name</Label>
                              <Input
                                value={cert.name}
                                onChange={(e) => updateCertification(index, "name", e.target.value)}
                                placeholder="AWS Certified Developer"
                              />
                            </div>
                            <div>
                              <Label>Issuer</Label>
                              <Input
                                value={cert.issuer}
                                onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                                placeholder="Amazon Web Services"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Date</Label>
                              <Input
                                value={cert.date}
                                onChange={(e) => updateCertification(index, "date", e.target.value)}
                                placeholder="March 2023"
                              />
                            </div>
                            <div>
                              <Label>Link (Optional)</Label>
                              <Input
                                value={cert.link}
                                onChange={(e) => updateCertification(index, "link", e.target.value)}
                                placeholder="https://certification-link.com"
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Details</Label>
                            <Textarea
                              value={cert.details}
                              onChange={(e) => updateCertification(index, "details", e.target.value)}
                              placeholder="Description of certification..."
                              className="min-h-[80px]"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Skills Section */}
                {activeTab === "skills" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <Code className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">Skills</h2>
                      </div>
                      <Button onClick={addSkillSection} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Skill Section
                      </Button>
                    </div>

                    {skillSections.map((section, sectionIndex) => (
                      <Card key={sectionIndex} className="border">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold">Skill Section {sectionIndex + 1}</h3>
                            {skillSections.length > 1 && (
                              <Button 
                                onClick={() => {
                                  const updated = skillSections.filter((_, i) => i !== sectionIndex);
                                  setSkillSections(updated);
                                }} 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div>
                            <Label>Section Header</Label>
                            <Input
                              value={section.header}
                              onChange={(e) => {
                                const updated = [...skillSections];
                                updated[sectionIndex].header = e.target.value;
                                setSkillSections(updated);
                              }}
                              placeholder="Technical Skills"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <Label>Skills</Label>
                              <Button 
                                onClick={() => addSkill(sectionIndex)}
                                variant="outline" 
                                size="sm"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Skill
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {section.skills.map((skill, skillIndex) => (
                                <div key={skillIndex} className="flex gap-2">
                                  <Input
                                    value={skill}
                                    onChange={(e) => {
                                      const updated = [...skillSections];
                                      updated[sectionIndex].skills[skillIndex] = e.target.value;
                                      setSkillSections(updated);
                                    }}
                                    placeholder="JavaScript, React, Node.js..."
                                    className="flex-1"
                                  />
                                  {section.skills.length > 1 && (
                                    <Button
                                      onClick={() => {
                                        const updated = [...skillSections];
                                        updated[sectionIndex].skills.splice(skillIndex, 1);
                                        setSkillSections(updated);
                                      }}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Custom Sections */}
                {activeTab === "custom" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <Plus className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">Custom Sections</h2>
                      </div>
                      <Button 
                        onClick={() => {
                          setCustomSections([...customSections, {
                            name: "",
                            items: [{
                              title: "",
                              place: "",
                              duration: "",
                              description: "",
                              content: [""]
                            }]
                          }]);
                        }} 
                        variant="outline" 
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Custom Section
                      </Button>
                    </div>

                    {customSections.map((section, sectionIndex) => (
                      <Card key={sectionIndex} className="border">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold">Custom Section {sectionIndex + 1}</h3>
                            <Button 
                              onClick={() => {
                                const updated = customSections.filter((_, i) => i !== sectionIndex);
                                setCustomSections(updated);
                              }} 
                              variant="ghost" 
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div>
                            <Label>Section Name</Label>
                            <Input
                              value={section.name}
                              onChange={(e) => {
                                const updated = [...customSections];
                                updated[sectionIndex].name = e.target.value;
                                setCustomSections(updated);
                              }}
                              placeholder="Volunteer Experience"
                            />
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Label>Items</Label>
                              <Button 
                                onClick={() => {
                                  const updated = [...customSections];
                                  updated[sectionIndex].items.push({
                                    title: "",
                                    place: "",
                                    duration: "",
                                    description: "",
                                    content: [""]
                                  });
                                  setCustomSections(updated);
                                }}
                                variant="outline" 
                                size="sm"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Item
                              </Button>
                            </div>

                            {section.items.map((item, itemIndex) => (
                              <Card key={itemIndex} className="border-l-4 border-l-primary/20">
                                <CardContent className="p-4 space-y-3">
                                  <div className="flex justify-between items-start">
                                    <span className="text-sm font-medium text-muted-foreground">Item {itemIndex + 1}</span>
                                    {section.items.length > 1 && (
                                      <Button 
                                        onClick={() => {
                                          const updated = [...customSections];
                                          updated[sectionIndex].items.splice(itemIndex, 1);
                                          setCustomSections(updated);
                                        }} 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-red-600"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    )}
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-3">
                                    <div>
                                      <Label className="text-xs">Title</Label>
                                      <Input
                                        value={item.title}
                                        onChange={(e) => {
                                          const updated = [...customSections];
                                          updated[sectionIndex].items[itemIndex].title = e.target.value;
                                          setCustomSections(updated);
                                        }}
                                        placeholder="Project Title"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Place</Label>
                                      <Input
                                        value={item.place}
                                        onChange={(e) => {
                                          const updated = [...customSections];
                                          updated[sectionIndex].items[itemIndex].place = e.target.value;
                                          setCustomSections(updated);
                                        }}
                                        placeholder="Organization"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-3">
                                    <div>
                                      <Label className="text-xs">Duration</Label>
                                      <Input
                                        value={item.duration}
                                        onChange={(e) => {
                                          const updated = [...customSections];
                                          updated[sectionIndex].items[itemIndex].duration = e.target.value;
                                          setCustomSections(updated);
                                        }}
                                        placeholder="Jan 2023 - Mar 2023"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Description</Label>
                                      <Input
                                        value={item.description}
                                        onChange={(e) => {
                                          const updated = [...customSections];
                                          updated[sectionIndex].items[itemIndex].description = e.target.value;
                                          setCustomSections(updated);
                                        }}
                                        placeholder="Brief description"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex justify-between items-center mb-2">
                                      <Label className="text-xs">Content</Label>
                                      <Button 
                                        onClick={() => {
                                          const updated = [...customSections];
                                          updated[sectionIndex].items[itemIndex].content.push("");
                                          setCustomSections(updated);
                                        }}
                                        variant="outline" 
                                        size="sm"
                                      >
                                        <Plus className="w-3 h-3 mr-1" />
                                        Add
                                      </Button>
                                    </div>
                                    {item.content.map((content, contentIndex) => (
                                      <div key={contentIndex} className="flex gap-2 mb-2">
                                        <Input
                                          value={content}
                                          onChange={(e) => {
                                            const updated = [...customSections];
                                            updated[sectionIndex].items[itemIndex].content[contentIndex] = e.target.value;
                                            setCustomSections(updated);
                                          }}
                                          placeholder="Content item..."
                                          className="flex-1"
                                        />
                                        {item.content.length > 1 && (
                                          <Button
                                            onClick={() => {
                                              const updated = [...customSections];
                                              updated[sectionIndex].items[itemIndex].content.splice(contentIndex, 1);
                                              setCustomSections(updated);
                                            }}
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-8 pt-8 border-t">
                  <Button variant="outline" size="lg">
                    <Eye className="w-5 h-5 mr-2" />
                    Preview JSON
                  </Button>
                  <Button variant="gradient" size="lg" onClick={downloadEnhancedResume}>
                    <Download className="w-5 h-5 mr-2" />
                    Generate Black & White Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default BuildResume;
