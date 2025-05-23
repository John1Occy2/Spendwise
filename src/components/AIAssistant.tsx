import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  Send,
  Award,
  TrendingUp,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings: string;
  category: string;
}

interface PointActivity {
  id: string;
  title: string;
  points: number;
  date: Date;
}

interface InvestmentAdvice {
  id: string;
  title: string;
  description: string;
  riskLevel: "Low" | "Medium" | "High";
  potentialReturn: string;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("chat");

  // Sample data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI financial assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);

  const recommendations: Recommendation[] = [
    {
      id: "1",
      title: "Reduce subscription services",
      description:
        "You're spending $45 monthly on streaming services. Consider consolidating to save money.",
      potentialSavings: "$25/month",
      category: "Entertainment",
    },
    {
      id: "2",
      title: "Coffee budget alert",
      description:
        "Your coffee shop spending is 30% higher than last month. Try brewing at home some days.",
      potentialSavings: "$35/month",
      category: "Food & Drink",
    },
    {
      id: "3",
      title: "Utility savings opportunity",
      description:
        "Your electricity bill seems high. Consider energy-efficient options or usage monitoring.",
      potentialSavings: "$20/month",
      category: "Utilities",
    },
  ];

  const pointActivities: PointActivity[] = [
    {
      id: "1",
      title: "Stayed under budget this week",
      points: 50,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      title: "Added expense receipts consistently",
      points: 25,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      title: "Set up a savings goal",
      points: 100,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  ];

  const investmentAdvice: InvestmentAdvice[] = [
    {
      id: "1",
      title: "Index Fund Investment",
      description:
        "Based on your profile, consider allocating 40% of your investment budget to S&P 500 index funds.",
      riskLevel: "Medium",
      potentialReturn: "7-10% annually",
    },
    {
      id: "2",
      title: "Emergency Fund",
      description:
        "Before additional investments, ensure you have 3-6 months of expenses in a high-yield savings account.",
      riskLevel: "Low",
      potentialReturn: "3-4% annually",
    },
    {
      id: "3",
      title: "Technology Sector ETFs",
      description:
        "With your risk tolerance, a small position (10%) in tech sector ETFs could enhance returns.",
      riskLevel: "High",
      potentialReturn: "10-15% annually",
    },
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I've analyzed your recent spending patterns. You might want to consider reducing your dining out expenses, which are 20% higher than last month.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Render the minimized button when assistant is minimized
  if (!isOpen) {
    return (
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <Button
          onClick={toggleOpen}
          size="icon"
          className="h-12 w-12 rounded-full bg-primary shadow-lg hover:bg-primary/90"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 right-4 z-50 bg-background border rounded-lg shadow-xl"
        style={{
          width: isMinimized ? "300px" : "350px",
          height: isMinimized ? "60px" : "500px",
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=finance"
                alt="AI Assistant"
              />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">Financial Assistant</h3>
              <p className="text-xs text-muted-foreground">Here to help</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMinimize}
              className="h-8 w-8"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleOpen}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              className="flex flex-col h-[calc(500px-56px)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Tabs
                defaultValue="chat"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="chat" className="text-xs">
                    <MessageSquare className="h-3 w-3 mr-1" /> Chat
                  </TabsTrigger>
                  <TabsTrigger value="points" className="text-xs">
                    <Award className="h-3 w-3 mr-1" /> Points
                  </TabsTrigger>
                  <TabsTrigger value="invest" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" /> Invest
                  </TabsTrigger>
                </TabsList>

                {/* Chat Tab */}
                <TabsContent
                  value="chat"
                  className="flex flex-col h-[calc(500px-110px)]"
                >
                  <ScrollArea className="flex-1 p-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-3 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>

                  <div className="p-3 border-t mt-auto">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Ask me anything about your finances..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button size="icon" onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Points Tab */}
                <TabsContent
                  value="points"
                  className="h-[calc(500px-110px)] overflow-auto"
                >
                  <div className="p-4">
                    <div className="mb-6 text-center">
                      <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-2">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">175 Points</h3>
                      <p className="text-sm text-muted-foreground">
                        Keep up the good work!
                      </p>
                    </div>

                    <h4 className="font-medium mb-2">Recent Activities</h4>
                    {pointActivities.map((activity) => (
                      <Card key={activity.id} className="mb-3">
                        <CardContent className="p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">
                              {activity.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.date.toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-sm">
                            +{activity.points}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Investment Tab */}
                <TabsContent
                  value="invest"
                  className="h-[calc(500px-110px)] overflow-auto"
                >
                  <div className="p-4">
                    <h4 className="font-medium mb-3">
                      Personalized Investment Advice
                    </h4>

                    {investmentAdvice.map((advice) => (
                      <Card key={advice.id} className="mb-4">
                        <CardHeader className="p-3 pb-1">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm">
                              {advice.title}
                            </CardTitle>
                            <Badge
                              variant={
                                advice.riskLevel === "Low"
                                  ? "outline"
                                  : advice.riskLevel === "Medium"
                                    ? "secondary"
                                    : "default"
                              }
                              className="text-xs"
                            >
                              {advice.riskLevel} Risk
                            </Badge>
                          </div>
                          <CardDescription className="text-xs mt-1">
                            Potential: {advice.potentialReturn}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <p className="text-sm">{advice.description}</p>
                        </CardContent>
                      </Card>
                    ))}

                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="h-3 w-3 mr-1" /> Adjust Investment
                        Profile
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAssistant;
