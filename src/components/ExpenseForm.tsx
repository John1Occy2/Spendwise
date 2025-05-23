import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CalendarIcon, CameraIcon, UploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpenseFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: ExpenseData) => void;
}

interface ExpenseData {
  amount: string;
  date: Date;
  category: string;
  description: string;
  paymentMethod: string;
  receipt?: File | null;
}

const categories = [
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Housing",
  "Healthcare",
  "Education",
  "Travel",
  "Personal Care",
  "Other",
];

const paymentMethods = [
  "Credit Card",
  "Debit Card",
  "Cash",
  "Bank Transfer",
  "Mobile Payment",
  "Other",
];

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  open = true,
  onOpenChange = () => {},
  onSubmit = () => {},
}) => {
  const [expenseData, setExpenseData] = useState<ExpenseData>({
    amount: "",
    date: new Date(),
    category: "",
    description: "",
    paymentMethod: "",
    receipt: null,
  });

  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleInputChange = (field: keyof ExpenseData, value: any) => {
    setExpenseData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setExpenseData((prev) => ({ ...prev, receipt: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanReceipt = () => {
    setIsScanning(true);
    // Simulate receipt scanning process
    setTimeout(() => {
      setIsScanning(false);
      // Mock data from receipt scanning
      setExpenseData((prev) => ({
        ...prev,
        amount: "42.99",
        category: "Food & Dining",
        description: "Grocery shopping",
        paymentMethod: "Credit Card",
      }));
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(expenseData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add New Expense
          </DialogTitle>
          <DialogDescription>
            Enter the details of your expense. You can manually input the
            information or scan a receipt.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={expenseData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expenseData.date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expenseData.date ? (
                      format(expenseData.date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expenseData.date}
                    onSelect={(date) => date && handleInputChange("date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={expenseData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={expenseData.paymentMethod}
                onValueChange={(value) =>
                  handleInputChange("paymentMethod", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter expense details"
              value={expenseData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Receipt</Label>
            <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-md">
              {receiptPreview ? (
                <div className="relative w-full">
                  <img
                    src={receiptPreview}
                    alt="Receipt preview"
                    className="max-h-[200px] mx-auto object-contain"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setReceiptPreview(null);
                      setExpenseData((prev) => ({ ...prev, receipt: null }));
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-4">
                    <div>
                      <input
                        id="receipt-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Label
                        htmlFor="receipt-upload"
                        className="cursor-pointer"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 rounded-full bg-primary/10">
                            <UploadIcon className="h-6 w-6 text-primary" />
                          </div>
                          <span>Upload Receipt</span>
                        </div>
                      </Label>
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleScanReceipt}
                        disabled={isScanning}
                        className="h-auto py-3 px-4"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 rounded-full bg-primary/10">
                            <CameraIcon className="h-6 w-6 text-primary" />
                          </div>
                          <span>
                            {isScanning ? "Scanning..." : "Scan Receipt"}
                          </span>
                        </div>
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Upload a photo of your receipt for automatic expense
                    detection
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseForm;
