import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  PlusIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: string;
  suggestion?: string;
}

const GoalTracker = ({ goals = defaultGoals }: { goals?: Goal[] }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [selectedCategory, setSelectedCategory] = useState<string>();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Financial Goals</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <PlusIcon className="h-4 w-4" />
              <span>New Goal</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Financial Goal</DialogTitle>
              <DialogDescription>
                Set a new financial goal with a target amount and date.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="goal-title">Goal Title</Label>
                <Input
                  id="goal-title"
                  placeholder="e.g., New Car, Emergency Fund"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="target-amount">Target Amount</Label>
                <Input id="target-amount" type="number" placeholder="5000" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="debt">Debt Repayment</SelectItem>
                    <SelectItem value="purchase">Major Purchase</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Target Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Create Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = Math.round(
            (goal.currentAmount / goal.targetAmount) * 100,
          );
          return (
            <Card key={goal.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  {progress >= 100 && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <CheckCircleIcon className="h-3 w-3 mr-1" /> Achieved
                    </span>
                  )}
                </div>
                <CardDescription className="flex justify-between">
                  <span>Target: ${goal.targetAmount.toLocaleString()}</span>
                  <span>Due: {format(goal.targetDate, "MMM d, yyyy")}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-1 flex justify-between text-sm">
                  <span>${goal.currentAmount.toLocaleString()} saved</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
              {goal.suggestion && (
                <CardFooter className="pt-0 pb-3 px-6 bg-amber-50">
                  <div className="flex items-start text-xs text-amber-800">
                    <AlertCircleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <p>{goal.suggestion}</p>
                  </div>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-8">
          <TrendingUpIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No financial goals yet</p>
          <p className="text-gray-400 text-sm">
            Create a goal to start tracking your progress
          </p>
        </div>
      )}
    </div>
  );
};

const defaultGoals: Goal[] = [
  {
    id: "1",
    title: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 6500,
    targetDate: new Date(2023, 11, 31),
    category: "savings",
  },
  {
    id: "2",
    title: "New Car",
    targetAmount: 25000,
    currentAmount: 8750,
    targetDate: new Date(2024, 5, 15),
    category: "purchase",
    suggestion:
      "Consider increasing monthly contributions by $150 to meet your target date.",
  },
  {
    id: "3",
    title: "Vacation Fund",
    targetAmount: 3000,
    currentAmount: 3000,
    targetDate: new Date(2023, 6, 1),
    category: "savings",
  },
];

export default GoalTracker;
