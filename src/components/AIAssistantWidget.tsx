import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Award,
  TrendingUp,
  Lightbulb,
  ChevronUp,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AIAssistantWidgetProps {
  isOpen?: boolean;
  onClose?: () => void;
  userName?: string;
  points?: number;
  recommendations?: Array<{
    id: string;
    title: string;
    description: string;
    impact: number;
  }>;
  habits?: Array<{
    id: string;
    name: string;
    progress: number;
    pointsReward: number;
  }>;
  investments?: Array<{
    id: string;
    name: string;
    risk: "Low" | "Medium" | "High";
    potentialReturn: string;
    description: string;
  }>;
  userId?: string;
}

const AIAssistantWidget = ({
  isOpen = true,
  onClose = () => {},
  userName = "Alex",
  points = 750,
  userId = "demo-user",
  recommendations = [
    {
      id: "rec1",
      title: "Reduce subscription services",
      description:
        "You're spending $45 monthly on unused subscriptions. Consider cancelling Netflix and Spotify premium.",
      impact: 45,
    },
    {
      id: "rec2",
      title: "Switch to meal planning",
      description:
        "Your restaurant spending is 30% above average. Meal planning could save you $120 monthly.",
      impact: 120,
    },
    {
      id: "rec3",
      title: "Refinance your loan",
      description:
        "Current rates are lower than your auto loan. Refinancing could save $75 monthly.",
      impact: 75,
    },
  ],
  habits = [
    {
      id: "hab1",
      name: "Stay under grocery budget",
      progress: 80,
      pointsReward: 50,
    },
    {
      id: "hab2",
      name: "Save 10% of income",
      progress: 65,
      pointsReward: 100,
    },
    {
      id: "hab3",
      name: "No impulse purchases",
      progress: 30,
      pointsReward: 75,
    },
  ],
  investments = [
    {
      id: "inv1",
      name: "Index Fund Portfolio",
      risk: "Low",
      potentialReturn: "6-8% annually",
      description:
        "Diversified index funds with low fees, ideal for long-term growth with minimal risk.",
    },
    {
      id: "inv2",
      name: "Dividend Stocks",
      risk: "Medium",
      potentialReturn: "4-10% annually",
      description:
        "Quality companies that pay regular dividends, providing income and moderate growth.",
    },
    {
      id: "inv3",
      name: "Tech Growth Stocks",
      risk: "High",
      potentialReturn: "10-15%+ annually",
      description:
        "High-growth technology companies with potential for significant returns but higher volatility.",
    },
  ],
}: AIAssistantWidgetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [realTimeInvestments, setRealTimeInvestments] = useState(investments);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content: `Hello ${userName}! How can I help with your finances today?`,
    },
  ]);

  // Fetch real-time investment data
  useEffect(() => {
    const fetchRealTimeInvestmentData = async () => {
      try {
        // In a real implementation, this would call a financial API
        // For now, we'll simulate real-time data with random fluctuations
        const updatedInvestments = investments.map((inv) => {
          const randomChange = (Math.random() * 2 - 1) * 2; // Random between -2% and +2%
          const returnRange = inv.potentialReturn.split("-");
          const lowerBound = parseFloat(returnRange[0]);
          const upperBound = parseFloat(returnRange[1]);
          const newLower = Math.max(1, lowerBound + randomChange).toFixed(1);
          const newUpper = Math.max(
            parseFloat(newLower) + 2,
            upperBound + randomChange,
          ).toFixed(1);

          return {
            ...inv,
            potentialReturn: `${newLower}-${newUpper}% annually`,
            lastUpdated: new Date().toISOString(),
            trend: randomChange > 0 ? "up" : "down",
            changePercent: Math.abs(randomChange).toFixed(2),
          };
        });

        setRealTimeInvestments(updatedInvestments);
      } catch (error) {
        console.error("Error fetching investment data:", error);
      }
    };

    fetchRealTimeInvestmentData();

    // Update investment data every 30 seconds
    const intervalId = setInterval(fetchRealTimeInvestmentData, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Fetch user's financial data for personalized recommendations
  useEffect(() => {
    const fetchUserFinancialData = async () => {
      try {
        // In a real implementation, this would fetch data from Supabase
        // For now, we'll use the default data
      } catch (error) {
        console.error("Error fetching user financial data:", error);
      }
    };

    fetchUserFinancialData();
  }, [userId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    setChatHistory([...chatHistory, { role: "user", content: message }]);
    setIsLoading(true);

    try {
      // In a production app, this would call an API endpoint that uses OpenAI or another AI service
      // For now, we'll simulate more intelligent responses based on keywords

      const userMessage = message.toLowerCase();
      let aiResponse = "";

      // Save interaction to database for future training
      try {
        await dbHelpers.saveAIInteraction({
          user_id: userId,
          message: message,
          response: aiResponse,
          interaction_type: "chat",
        });
      } catch (error) {
        console.error("Error saving AI interaction:", error);
      }

      // Generate response based on keywords
      if (
        userMessage.includes("invest") ||
        userMessage.includes("stock") ||
        userMessage.includes("market")
      ) {
        const randomInvestment =
          realTimeInvestments[
            Math.floor(Math.random() * realTimeInvestments.length)
          ];
        aiResponse = `Based on your risk profile and current market conditions, I recommend considering ${randomInvestment.name}. This investment has ${randomInvestment.risk} risk with potential returns of ${randomInvestment.potentialReturn}. ${randomInvestment.description}`;
      } else if (
        userMessage.includes("save") ||
        userMessage.includes("saving")
      ) {
        aiResponse =
          "I've analyzed your spending patterns and found that you could save an additional $215 monthly by optimizing your subscription services and reducing dining out expenses. Would you like me to create a detailed savings plan for you?";
      } else if (
        userMessage.includes("budget") ||
        userMessage.includes("spend")
      ) {
        aiResponse =
          "Your current monthly spending is 15% higher than last month, primarily in the Entertainment and Dining categories. I recommend setting category-specific budgets to help you stay on track. Would you like me to suggest some budget limits based on your income?";
      } else if (
        userMessage.includes("goal") ||
        userMessage.includes("target")
      ) {
        aiResponse =
          "Based on your current savings rate, you're on track to reach your vacation savings goal by August. However, your retirement contributions are 10% below the recommended amount for your age group. Would you like some suggestions to optimize your retirement savings?";
      } else {
        aiResponse =
          "I've analyzed your recent financial activity and noticed a few opportunities. You could save approximately $120 this month by cooking at home more often, and your investment portfolio could benefit from more diversification. Would you like specific recommendations?";
      }

      // Add AI response to chat with slight delay to feel more natural
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content: aiResponse,
          },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error while processing your request. Please try again later.",
        },
      ]);
      setIsLoading(false);
    }

    setMessage("");
  };

  const toggleWidget = () => {
    setIsExpanded(!isExpanded);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background">
      {/* Collapsed Button */}
      {!isExpanded && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Button
            onClick={toggleWidget}
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center bg-primary hover:bg-primary/90"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </motion.div>
      )}

      {/* Expanded Widget */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[350px] rounded-lg shadow-xl overflow-hidden border bg-card"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-primary-foreground">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=finance"
                    alt="AI Assistant"
                  />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">Financial Assistant</h3>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    <span className="text-xs">{points} points</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleWidget}
                className="text-primary-foreground hover:bg-primary/90"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>

            {/* Tabs */}
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
                <TabsTrigger value="recommendations" className="text-xs">
                  <Lightbulb className="h-3 w-3 mr-1" /> Tips
                </TabsTrigger>
                <TabsTrigger value="investments" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" /> Invest
                </TabsTrigger>
              </TabsList>

              {/* Chat Tab */}
              <TabsContent value="chat" className="p-0">
                <div className="h-[350px] flex flex-col">
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {chatHistory.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-2 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-2 bg-muted flex items-center gap-2">
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          <span className="text-sm">
                            Analyzing your finances...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask about your finances..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        className="flex-1"
                      />
                      <Button size="icon" onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations" className="p-0">
                <div className="h-[350px] overflow-y-auto p-3 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Financial Habits</h3>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Award className="h-3 w-3" /> {points} pts
                    </Badge>
                  </div>

                  {/* Habits */}
                  <div className="space-y-3 mb-4">
                    {habits.map((habit) => (
                      <div
                        key={habit.id}
                        className="bg-muted/50 p-3 rounded-lg"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">
                            {habit.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {habit.pointsReward} pts
                          </Badge>
                        </div>
                        <Progress value={habit.progress} className="h-2" />
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {habit.progress}% complete
                        </span>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-medium mt-4">Saving Opportunities</h3>

                  {/* Recommendations */}
                  {recommendations.map((rec) => (
                    <Card key={rec.id} className="bg-card">
                      <CardHeader className="p-3 pb-1">
                        <CardTitle className="text-sm flex justify-between">
                          {rec.title}
                          <Badge className="ml-2">Save ${rec.impact}/mo</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-1">
                        <CardDescription className="text-xs">
                          {rec.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Investments Tab */}
              <TabsContent value="investments" className="p-0">
                <div className="h-[350px] overflow-y-auto p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Investment Opportunities</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <RefreshCw className="h-3 w-3" />
                      <span>Live data</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on your risk profile and real-time market conditions
                  </p>

                  {realTimeInvestments.map((inv) => (
                    <Card key={inv.id} className="bg-card">
                      <CardHeader className="p-3 pb-1">
                        <CardTitle className="text-sm flex justify-between items-center">
                          {inv.name}
                          <Badge
                            className={`text-xs ${getRiskColor(inv.risk)}`}
                          >
                            {inv.risk} Risk
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-xs font-medium flex items-center justify-between">
                          <span>Potential Return: {inv.potentialReturn}</span>
                          {inv.trend && (
                            <span
                              className={
                                inv.trend === "up"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                              title="Change since last update"
                            >
                              {inv.trend === "up" ? "↑" : "↓"}{" "}
                              {inv.changePercent}%
                            </span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 pt-1">
                        <p className="text-xs">{inv.description}</p>
                      </CardContent>
                      <CardFooter className="p-3 pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs w-full"
                          onClick={() =>
                            setActiveTab("chat") ||
                            setMessage(
                              `Tell me more about ${inv.name} investment opportunity`,
                            )
                          }
                        >
                          Get Personalized Advice
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <div className="p-2 border-t text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={onClose}
              >
                <X className="h-3 w-3 mr-1" /> Close Assistant
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistantWidget;
