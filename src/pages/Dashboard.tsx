import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Settings,
  PlusCircle,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import AIAssistantWidget from "@/components/AIAssistantWidget";
import DataVisualization from "@/components/DataVisualization";
import GoalTracker from "@/components/GoalTracker";
import ExpenseSummary from "@/components/ExpenseSummary";
import SpendingTrends from "@/components/SpendingTrends";
import ExpenseForm from "@/components/ExpenseForm";
import AccountLinking from "@/components/AccountLinking";

const Dashboard = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for the dashboard
  const userData = {
    name: "Alex Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    totalBalance: 12450.75,
    monthlyIncome: 5000,
    monthlyExpenses: 3200.5,
    savingsGoal: 20000,
    currentSavings: 8500,
  };

  const recentTransactions = [
    {
      id: 1,
      name: "Grocery Store",
      amount: -120.5,
      category: "Food",
      date: "2023-06-15",
    },
    {
      id: 2,
      name: "Salary Deposit",
      amount: 5000.0,
      category: "Income",
      date: "2023-06-01",
    },
    {
      id: 3,
      name: "Electric Bill",
      amount: -85.2,
      category: "Utilities",
      date: "2023-06-10",
    },
    {
      id: 4,
      name: "Restaurant",
      amount: -65.75,
      category: "Dining",
      date: "2023-06-12",
    },
    {
      id: 5,
      name: "Online Shopping",
      amount: -129.99,
      category: "Shopping",
      date: "2023-06-08",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Financial Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        {/* User Summary */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${userData.totalBalance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +2.5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${userData.monthlyIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Received on 1st of each month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${userData.monthlyExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                -5.2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            <Button onClick={() => setShowExpenseForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </div>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Spending Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SpendingTrends />
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Expense Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ExpenseSummary />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataVisualization />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{transaction.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>{transaction.date}</span>
                          <span className="mx-2">•</span>
                          <span>{transaction.category}</span>
                        </div>
                      </div>
                      <div
                        className={`text-lg font-bold ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts" className="mt-6">
            <AccountLinking userId={userData.name} />
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Savings Goal</CardTitle>
                </CardHeader>
                <CardContent>
                  <GoalTracker />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Investment Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Index Fund Portfolio</h3>
                        <Button variant="ghost" size="sm">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Low risk, 6-8% annual returns
                      </p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Tech Growth Stocks</h3>
                        <Button variant="ghost" size="sm">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Medium risk, 10-15% potential returns
                      </p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Real Estate Fund</h3>
                        <Button variant="ghost" size="sm">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Medium risk, 8-12% annual returns
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <h3 className="font-medium">Spending Pattern Analysis</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your dining expenses have increased by 15% compared to
                      last month. Consider setting a budget for this category.
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <h3 className="font-medium">Savings Opportunity</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      You could save $150 monthly by refinancing your current
                      loans at today's interest rates.
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <h3 className="font-medium">Budget Alert</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      You've reached 85% of your entertainment budget for this
                      month. Consider limiting expenses in this category.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* AI Assistant Widget */}
      <div className="fixed bottom-6 right-6">
        <AIAssistantWidget />
      </div>

      {/* Expense Form Dialog */}
      {showExpenseForm && (
        <ExpenseForm open={showExpenseForm} onOpenChange={setShowExpenseForm} />
      )}
    </div>
  );
};

export default Dashboard;
