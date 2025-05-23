import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, LineChart, Filter } from "lucide-react";

interface SpendingTrendsProps {
  data?: {
    categories: Array<{
      name: string;
      amount: number;
      color: string;
    }>;
    timeSeriesData: Array<{
      date: string;
      amount: number;
    }>;
  };
}

const SpendingTrends = ({
  data = {
    categories: [
      { name: "Food & Dining", amount: 450, color: "#FF6384" },
      { name: "Housing", amount: 1200, color: "#36A2EB" },
      { name: "Transportation", amount: 350, color: "#FFCE56" },
      { name: "Entertainment", amount: 200, color: "#4BC0C0" },
      { name: "Shopping", amount: 300, color: "#9966FF" },
      { name: "Utilities", amount: 180, color: "#FF9F40" },
    ],
    timeSeriesData: [
      { date: "Jan", amount: 2500 },
      { date: "Feb", amount: 2300 },
      { date: "Mar", amount: 2700 },
      { date: "Apr", amount: 2400 },
      { date: "May", amount: 2800 },
      { date: "Jun", amount: 2200 },
    ],
  },
}: SpendingTrendsProps) => {
  const [timeFrame, setTimeFrame] = useState("month");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Mock chart components - in a real implementation, you would use a charting library like recharts
  const BarChartComponent = () => (
    <div className="h-64 w-full bg-background flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-l relative">
      {data.categories.map((category, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className="w-12 rounded-t-sm"
            style={{
              height: `${(category.amount / 1200) * 100}%`,
              backgroundColor: category.color,
              opacity:
                selectedCategories.length === 0 ||
                selectedCategories.includes(category.name)
                  ? 1
                  : 0.3,
            }}
          />
          <span className="text-xs mt-1 text-muted-foreground truncate max-w-16">
            {category.name}
          </span>
        </div>
      ))}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between pointer-events-none">
        <span className="text-xs text-muted-foreground">$1200</span>
        <span className="text-xs text-muted-foreground">$600</span>
        <span className="text-xs text-muted-foreground">$0</span>
      </div>
    </div>
  );

  const PieChartComponent = () => (
    <div className="h-64 w-full flex items-center justify-center relative">
      <div className="w-40 h-40 rounded-full overflow-hidden relative">
        {data.categories.map((category, index) => {
          const isActive =
            selectedCategories.length === 0 ||
            selectedCategories.includes(category.name);
          const totalAmount = data.categories.reduce(
            (sum, cat) => sum + cat.amount,
            0,
          );
          const percentage = (category.amount / totalAmount) * 100;
          const startAngle = data.categories
            .slice(0, index)
            .reduce((sum, cat) => sum + (cat.amount / totalAmount) * 360, 0);

          return (
            <div
              key={index}
              className="absolute top-0 left-0 w-full h-full"
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(((startAngle + percentage * 1.8) * Math.PI) / 180)}% ${50 - 50 * Math.sin(((startAngle + percentage * 1.8) * Math.PI) / 180)}%, ${50 + 50 * Math.cos((startAngle * Math.PI) / 180)}% ${50 - 50 * Math.sin((startAngle * Math.PI) / 180)}%)`,
                backgroundColor: category.color,
                opacity: isActive ? 1 : 0.3,
              }}
            />
          );
        })}
      </div>
      <div className="absolute right-0 top-0 h-full flex flex-col gap-2 justify-center">
        {data.categories.map((category, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-xs">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const LineChartComponent = () => (
    <div className="h-64 w-full bg-background flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-l relative">
      <svg className="w-full h-full" viewBox="0 0 600 200">
        <polyline
          fill="none"
          stroke="#4BC0C0"
          strokeWidth="2"
          points={data.timeSeriesData
            .map(
              (point, i) =>
                `${i * 100 + 50},${200 - (point.amount / 3000) * 180}`,
            )
            .join(" ")}
        />
        {data.timeSeriesData.map((point, i) => (
          <circle
            key={i}
            cx={i * 100 + 50}
            cy={200 - (point.amount / 3000) * 180}
            r="4"
            fill="#4BC0C0"
          />
        ))}
        {data.timeSeriesData.map((point, i) => (
          <text
            key={i}
            x={i * 100 + 50}
            y="220"
            textAnchor="middle"
            className="text-xs fill-muted-foreground"
          >
            {point.date}
          </text>
        ))}
      </svg>
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between pointer-events-none">
        <span className="text-xs text-muted-foreground">$3000</span>
        <span className="text-xs text-muted-foreground">$1500</span>
        <span className="text-xs text-muted-foreground">$0</span>
      </div>
    </div>
  );

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <Card className="w-full bg-background">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Spending Trends</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Filter className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="bar" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" /> Categories
              </TabsTrigger>
              <TabsTrigger value="pie" className="flex items-center gap-1">
                <PieChart className="h-4 w-4" /> Distribution
              </TabsTrigger>
              <TabsTrigger value="line" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" /> Over Time
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {data.categories.map((category, index) => (
              <Badge
                key={index}
                variant={
                  selectedCategories.includes(category.name)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => toggleCategory(category.name)}
              >
                {category.name}
              </Badge>
            ))}
          </div>

          <TabsContent value="bar" className="mt-0">
            <BarChartComponent />
          </TabsContent>
          <TabsContent value="pie" className="mt-0">
            <PieChartComponent />
          </TabsContent>
          <TabsContent value="line" className="mt-0">
            <LineChartComponent />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SpendingTrends;
