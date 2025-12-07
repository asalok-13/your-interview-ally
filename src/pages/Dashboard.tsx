import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getRoleById, roles } from "@/data/roles";
import { 
  ArrowLeft, 
  Clock, 
  MessageSquare,
  Play,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

interface Interview {
  id: string;
  role_id: string;
  role_title: string;
  created_at: string;
  duration_seconds: number | null;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loadingInterviews, setLoadingInterviews] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchInterviews();
    }
  }, [user]);

  const fetchInterviews = async () => {
    try {
      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInterviews(data || []);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoadingInterviews(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">My Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Interviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{interviews.length}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Topics Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {new Set(interviews.map((i) => i.role_id)).size}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Available Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{roles.length}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Start New Interview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold mb-4">Start New Interview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {roles.map((role) => (
              <Card
                key={role.id}
                className={`cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br ${role.bgGradient} border-0 text-white`}
                onClick={() => navigate(`/interview/${role.id}`)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <role.icon className="w-6 h-6" />
                  <span className="font-medium text-sm">{role.title}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Interview History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold mb-4">Interview History</h2>
          {loadingInterviews ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : interviews.length === 0 ? (
            <Card className="p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">No interviews yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start your first mock interview to see it here
              </p>
              <Button onClick={() => navigate("/")}>
                <Play className="w-4 h-4 mr-2" />
                Start Interview
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {interviews.map((interview) => {
                const role = getRoleById(interview.role_id);
                return (
                  <Card key={interview.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role?.bgGradient || "from-gray-500 to-gray-600"} flex items-center justify-center text-white`}>
                          {role && <role.icon className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-medium">{interview.role_title}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(interview.created_at), "MMM d, yyyy")}
                            </span>
                            {interview.duration_seconds && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {Math.round(interview.duration_seconds / 60)} min
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
