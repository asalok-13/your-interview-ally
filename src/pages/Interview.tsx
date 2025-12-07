import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { getRoleById } from "@/data/roles";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User as UserIcon,
  Sparkles
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Interview = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  
  const role = getRoleById(roleId || "");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && role && !interviewId) {
      initializeInterview();
    }
  }, [user, role]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const initializeInterview = async () => {
    if (!user || !role) return;

    try {
      // Create interview record
      const { data: interview, error } = await supabase
        .from("interviews")
        .insert({
          user_id: user.id,
          role_id: role.id,
          role_title: role.title,
          mode: "text",
        })
        .select()
        .single();

      if (error) throw error;

      setInterviewId(interview.id);

      // Add initial greeting
      const greeting = `Hello! I'm excited to help you practice for your ${role.title} interview today! 🌟\n\nI'll ask you questions, evaluate your answers, and provide constructive feedback to help you improve. Remember, this is a safe space to learn and grow!\n\nAre you ready to begin? Just say "yes" or "ready" to start!`;
      
      setMessages([{ role: "assistant", content: greeting }]);
      
      // Save greeting to database
      await supabase.from("interview_messages").insert({
        interview_id: interview.id,
        role: "assistant",
        content: greeting,
      });
    } catch (error) {
      console.error("Error initializing interview:", error);
      toast.error("Failed to start interview. Please try again.");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !interviewId || !role) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Save user message
      await supabase.from("interview_messages").insert({
        interview_id: interviewId,
        role: "user",
        content: userMessage,
      });

      // Call AI edge function
      const response = await supabase.functions.invoke("interview-chat", {
        body: {
          messages: [...messages, { role: "user", content: userMessage }],
          roleTitle: role.title,
          roleQuestions: role.questions,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const assistantMessage = response.data.content;
      setMessages((prev) => [...prev, { role: "assistant", content: assistantMessage }]);

      // Save assistant message
      await supabase.from("interview_messages").insert({
        interview_id: interviewId,
        role: "assistant",
        content: assistantMessage,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Role not found</h1>
        <Button onClick={() => navigate("/")}>Go Back Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.bgGradient} flex items-center justify-center`}>
              <role.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">{role.title} Interview</h1>
              <p className="text-xs text-muted-foreground">AI Mock Interview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
              End Interview
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 container mx-auto max-w-3xl p-4">
        <ScrollArea className="h-[calc(100vh-200px)]" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={`bg-gradient-to-br ${role.bgGradient} text-white`}>
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <Card className={`max-w-[80%] p-4 ${
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card"
                }`}>
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </Card>
                {message.role === "user" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-secondary">
                      <UserIcon className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={`bg-gradient-to-br ${role.bgGradient} text-white`}>
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="p-4 bg-card">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 glass border-t p-4">
        <div className="container mx-auto max-w-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Interview;
