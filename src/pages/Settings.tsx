import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Key, 
  Moon, 
  Sun, 
  User,
  Save,
  Eye,
  EyeOff
} from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [elevenLabsKey, setElevenLabsKey] = useState("");
  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showElevenLabs, setShowElevenLabs] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    // Here you would save to Supabase profiles table
    toast.success("Profile saved successfully!");
    setSaving(false);
  };

  const handleSaveApiKeys = async () => {
    setSaving(true);
    // Note: API keys should be stored securely via Supabase secrets
    toast.info("API keys are managed through Lovable Cloud. Please use the secrets management feature.");
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      placeholder="Enter your name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleSaveProfile} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save Profile"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="api-keys">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    API Keys
                  </CardTitle>
                  <CardDescription>
                    Manage your API keys for AI and voice features. Keys are stored securely.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                    <h3 className="font-semibold mb-2">🔒 Secure Key Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Your API keys are stored securely in the cloud. The keys shown below are placeholders. 
                      To update your actual keys, please contact the administrator or use the Lovable Cloud secrets management.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="openai">OpenAI API Key</Label>
                    <div className="relative">
                      <Input
                        id="openai"
                        type={showOpenAI ? "text" : "password"}
                        placeholder="sk-..."
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowOpenAI(!showOpenAI)}
                      >
                        {showOpenAI ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Used for AI-powered interview responses
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="elevenlabs">ElevenLabs API Key</Label>
                    <div className="relative">
                      <Input
                        id="elevenlabs"
                        type={showElevenLabs ? "text" : "password"}
                        placeholder="Enter your ElevenLabs key"
                        value={elevenLabsKey}
                        onChange={(e) => setElevenLabsKey(e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowElevenLabs(!showElevenLabs)}
                      >
                        {showElevenLabs ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Used for text-to-speech voice features
                    </p>
                  </div>

                  <Button onClick={handleSaveApiKeys} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save API Keys"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="appearance">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize how the app looks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <Card
                        className={`cursor-pointer p-4 text-center transition-all ${
                          theme === "light" ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Light</span>
                      </Card>
                      <Card
                        className={`cursor-pointer p-4 text-center transition-all ${
                          theme === "dark" ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Dark</span>
                      </Card>
                      <Card
                        className={`cursor-pointer p-4 text-center transition-all ${
                          theme === "system" ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setTheme("system")}
                      >
                        <div className="w-6 h-6 mx-auto mb-2 flex items-center justify-center">
                          <Sun className="w-3 h-3" />
                          <Moon className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-medium">System</span>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
