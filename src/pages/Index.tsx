import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { roles } from "@/data/roles";
import { 
  Sparkles, 
  LogOut, 
  Settings, 
  LayoutDashboard,
  Shield,
  ArrowRight
} from "lucide-react";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Alok AI Mock</span>
          </Link>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Welcome to{" "}
              <span className="gradient-text">Alok AI Mock</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Practice your technical interview skills with AI-powered mock interviews. 
              Master Excel, Python, Machine Learning, SQL, and more!
            </p>
            {!user && (
              <Button size="lg" variant="gradient" onClick={() => navigate("/auth")}>
                Start Practicing Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Roles Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Choose Your Interview Topic
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card 
                  className={`role-card cursor-pointer group hover:shadow-2xl bg-gradient-to-br ${role.bgGradient} border-0`}
                  onClick={() => {
                    if (user) {
                      navigate(`/interview/${role.id}`);
                    } else {
                      navigate("/auth");
                    }
                  }}
                >
                  <CardContent className="p-6 text-white">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <role.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{role.title}</h3>
                    <p className="text-white/80 text-sm line-clamp-2">
                      {role.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium">
                      Start Interview
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Alok AI Mock. Practice makes perfect!</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
