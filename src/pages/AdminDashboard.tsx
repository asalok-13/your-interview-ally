import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Users, 
  MessageSquare, 
  Activity,
  Calendar,
  Mail,
  Clock
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  created_at: string;
}

interface Interview {
  id: string;
  user_id: string;
  role_id: string;
  role_title: string;
  created_at: string;
}

const COLORS = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#14b8a6"];

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch all profiles (this will only return users the current user can see based on RLS)
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      // Fetch all interviews
      const { data: interviewsData } = await supabase
        .from("interviews")
        .select("*")
        .order("created_at", { ascending: false });

      setProfiles(profilesData || []);
      setInterviews(interviewsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  // Calculate analytics
  const interviewsByRole = interviews.reduce((acc, interview) => {
    acc[interview.role_title] = (acc[interview.role_title] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const roleChartData = Object.entries(interviewsByRole).map(([name, value]) => ({
    name,
    value,
  }));

  // Daily interviews for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return format(date, "MMM dd");
  });

  const dailyInterviews = last7Days.map((day) => ({
    date: day,
    interviews: interviews.filter(
      (i) => format(new Date(i.created_at), "MMM dd") === day
    ).length,
  }));

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
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{profiles.length}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-pink-500/10 to-pink-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Total Interviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{interviews.length}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Today's Interviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {interviews.filter(
                    (i) => format(new Date(i.created_at), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                  ).length}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Topics Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Object.keys(interviewsByRole).length}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Interviews Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Daily Interviews (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyInterviews}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="interviews" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Interviews by Role */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interviews by Topic</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={roleChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {roleChartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Topic Popularity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={roleChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Registered Users</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : profiles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found. Users will appear here after they sign up.
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {profiles.map((profile) => (
                        <div
                          key={profile.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                              {(profile.display_name || "U")[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">
                                {profile.display_name || "Anonymous User"}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                User ID: {profile.user_id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(profile.created_at), "MMM d, yyyy")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interviews">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : interviews.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No interviews yet.
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {interviews.map((interview) => (
                        <div
                          key={interview.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                              <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-medium">{interview.role_title}</div>
                              <div className="text-sm text-muted-foreground">
                                User: {interview.user_id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(interview.created_at), "MMM d, yyyy HH:mm")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
