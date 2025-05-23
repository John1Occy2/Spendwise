import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, FilterIcon, DownloadIcon } from "lucide-react";
import { format } from "date-fns";

interface DataVisualizationProps {
  data?: {
    categoryData?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    trendData?: Array<{
      date: string;
      amount: number;
    }>;
    comparisonData?: Array<{
      category: string;
      current: number;
      previous: number;
    }>;
    goalData?: Array<{
      goal: string;
      progress: number;
      target: number;
    }>;
  };
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const defaultCategoryData = [
  { name: "Food", value: 400, color: "#0088FE" },
  { name: "Housing", value: 800, color: "#00C49F" },
  { name: "Transportation", value: 300, color: "#FFBB28" },
  { name: "Entertainment", value: 200, color: "#FF8042" },
  { name: "Utilities", value: 150, color: "#8884d8" },
  { name: "Other", value: 100, color: "#82ca9d" },
];

const defaultTrendData = [
  { date: "Jan", amount: 1200 },
  { date: "Feb", amount: 1400 },
  { date: "Mar", amount: 1100 },
  { date: "Apr", amount: 1300 },
  { date: "May", amount: 1500 },
  { date: "Jun", amount: 1200 },
];

const defaultComparisonData = [
  { category: "Food", current: 400, previous: 380 },
  { category: "Housing", current: 800, previous: 800 },
  { category: "Transportation", current: 300, previous: 350 },
  { category: "Entertainment", current: 200, previous: 250 },
  { category: "Utilities", current: 150, previous: 140 },
  { category: "Other", current: 100, previous: 120 },
];

const defaultGoalData = [
  { goal: "Emergency Fund", progress: 5000, target: 10000 },
  { goal: "Vacation", progress: 2000, target: 3000 },
  { goal: "New Car", progress: 8000, target: 20000 },
];

const DataVisualization: React.FC<DataVisualizationProps> = ({
  data = {
    categoryData: defaultCategoryData,
    trendData: defaultTrendData,
    comparisonData: defaultComparisonData,
    goalData: defaultGoalData,
  },
}) => {
  const [chartType, setChartType] = useState("category");
  const [timeRange, setTimeRange] = useState("month");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { categoryData, trendData, comparisonData, goalData } = data;

  const renderCategoryChart = () => (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row h-[350px]">
          <div className="w-full lg:w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full lg:w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="value" fill="#8884d8">
                  {categoryData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTrendChart = () => (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle>Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderComparisonChart = () => (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle>Time Period Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Bar dataKey="current" name="Current Period" fill="#8884d8" />
              <Bar dataKey="previous" name="Previous Period" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderGoalChart = () => (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle>Goal Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={goalData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="goal" type="category" />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Bar dataKey="progress" name="Current Progress" fill="#8884d8" />
              <Bar dataKey="target" name="Target" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full p-4 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Financial Analytics</h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <FilterIcon className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon">
            <DownloadIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="category"
        value={chartType}
        onValueChange={setChartType}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="category">Categories</TabsTrigger>
          <TabsTrigger value="trend">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="goal">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="category">{renderCategoryChart()}</TabsContent>

        <TabsContent value="trend">{renderTrendChart()}</TabsContent>

        <TabsContent value="comparison">{renderComparisonChart()}</TabsContent>

        <TabsContent value="goal">{renderGoalChart()}</TabsContent>
      </Tabs>
    </div>
  );
};

export default DataVisualization;
