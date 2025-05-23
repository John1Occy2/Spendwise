import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSignIcon,
  PiggyBankIcon,
  ShoppingBagIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";

interface ExpenseSummaryCardProps {
  title: string;
  value: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  icon: React.ReactNode;
}

const ExpenseSummaryCard = ({
  title = "Summary",
  value = "$0",
  trend = "neutral",
  trendValue = "0%",
  icon = <DollarSignIcon className="h-4 w-4" />,
}: ExpenseSummaryCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {trend === "up" ? (
            <TrendingUpIcon className="mr-1 h-4 w-4 text-green-500" />
          ) : trend === "down" ? (
            <TrendingDownIcon className="mr-1 h-4 w-4 text-red-500" />
          ) : (
            <div className="mr-1 h-4 w-4" />
          )}
          <span
            className={
              trend === "up"
                ? "text-green-500"
                : trend === "down"
                  ? "text-red-500"
                  : ""
            }
          >
            {trendValue}
          </span>
          <span className="ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface ExpenseSummaryProps {
  totalExpenses?: string;
  remainingBudget?: string;
  savingsProgress?: string;
  topCategory?: string;
  expensesTrend?: "up" | "down" | "neutral";
  expensesTrendValue?: string;
  budgetTrend?: "up" | "down" | "neutral";
  budgetTrendValue?: string;
  savingsTrend?: "up" | "down" | "neutral";
  savingsTrendValue?: string;
  categoryTrend?: "up" | "down" | "neutral";
  categoryTrendValue?: string;
}

const ExpenseSummary = ({
  totalExpenses = "$2,450.25",
  remainingBudget = "$1,549.75",
  savingsProgress = "$750.00",
  topCategory = "Dining",
  expensesTrend = "up",
  expensesTrendValue = "12%",
  budgetTrend = "down",
  budgetTrendValue = "8%",
  savingsTrend = "up",
  savingsTrendValue = "20%",
  categoryTrend = "up",
  categoryTrendValue = "15%",
}: ExpenseSummaryProps) => {
  return (
    <div className="w-full bg-background p-4">
      <h2 className="text-xl font-semibold mb-4">Expense Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ExpenseSummaryCard
          title="Monthly Expenses"
          value={totalExpenses}
          trend={expensesTrend}
          trendValue={expensesTrendValue}
          icon={<DollarSignIcon className="h-4 w-4" />}
        />
        <ExpenseSummaryCard
          title="Remaining Budget"
          value={remainingBudget}
          trend={budgetTrend}
          trendValue={budgetTrendValue}
          icon={<ArrowDownIcon className="h-4 w-4" />}
        />
        <ExpenseSummaryCard
          title="Savings Progress"
          value={savingsProgress}
          trend={savingsTrend}
          trendValue={savingsTrendValue}
          icon={<PiggyBankIcon className="h-4 w-4" />}
        />
        <ExpenseSummaryCard
          title={`Top Category: ${topCategory}`}
          value={`${categoryTrendValue} of total`}
          trend={categoryTrend}
          trendValue={categoryTrendValue}
          icon={<ShoppingBagIcon className="h-4 w-4" />}
        />
      </div>
    </div>
  );
};

export default ExpenseSummary;
