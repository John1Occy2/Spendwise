import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  ChevronDown,
  Home,
  PieChart,
  Settings,
  User,
  Wallet,
} from "lucide-react";
import ExpenseSummary from "./ExpenseSummary";
import SpendingTrends from "./SpendingTrends";
import AIAssistant from "./AIAssistant";
import ExpenseForm from "./ExpenseForm";

const HomePage = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">FinTrack</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Reports
              </Button>
              <Button variant="ghost" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                      alt="User avatar"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block">John Doe</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <Button onClick={() => setShowExpenseForm(true)}>Add Expense</Button>
        </div>

        {/* Expense Summary Cards */}
        <section className="mb-8">
          <ExpenseSummary />
        </section>

        {/* Spending Trends */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Spending Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <SpendingTrends />
                </TabsContent>
                <TabsContent value="categories">
                  <SpendingTrends chartType="pie" />
                </TabsContent>
                <TabsContent value="timeline">
                  <SpendingTrends chartType="line" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Financial Goals */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Financial Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Emergency Fund
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">$3,500</p>
                        <p className="text-xs text-muted-foreground">
                          of $10,000 goal
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-medium">35%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Vacation Fund
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">$1,200</p>
                        <p className="text-xs text-muted-foreground">
                          of $3,000 goal
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-medium">40%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      New Car
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">$5,000</p>
                        <p className="text-xs text-muted-foreground">
                          of $25,000 goal
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-medium">20%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* AI Assistant Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setShowAIAssistant(!showAIAssistant)}
        >
          <span className="sr-only">Open AI Assistant</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        </Button>
      </div>

      {/* AI Assistant Widget */}
      {showAIAssistant && (
        <div className="fixed bottom-24 right-6 z-50">
          <AIAssistant onClose={() => setShowAIAssistant(false)} />
        </div>
      )}

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <ExpenseForm onClose={() => setShowExpenseForm(false)} />
      )}
    </div>
  );
};

export default HomePage;
