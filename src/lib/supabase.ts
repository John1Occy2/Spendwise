import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for common database operations
export const dbHelpers = {
  // User operations
  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Expense operations
  async getExpenses(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from("expenses")
      .select(
        `
        *,
        categories(name, color, icon)
      `,
      )
      .eq("user_id", userId)
      .order("expense_date", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async addExpense(expense: {
    user_id: string;
    amount: number;
    description?: string;
    category_id?: string;
    payment_method?: string;
    expense_date: string;
    receipt_url?: string;
  }) {
    const { data, error } = await supabase
      .from("expenses")
      .insert(expense)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Category operations
  async getCategories(userId: string) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
      .order("name");

    if (error) throw error;
    return data;
  },

  async addCategory(category: {
    user_id: string;
    name: string;
    color?: string;
    icon?: string;
  }) {
    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Goal operations
  async getGoals(userId: string) {
    const { data, error } = await supabase
      .from("financial_goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async addGoal(goal: {
    user_id: string;
    title: string;
    description?: string;
    target_amount: number;
    target_date?: string;
  }) {
    const { data, error } = await supabase
      .from("financial_goals")
      .insert(goal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateGoalProgress(goalId: string, currentAmount: number) {
    const { data, error } = await supabase
      .from("financial_goals")
      .update({ current_amount: currentAmount })
      .eq("id", goalId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // AI interaction operations
  async saveAIInteraction(interaction: {
    user_id: string;
    message: string;
    response: string;
    interaction_type?: string;
  }) {
    const { data, error } = await supabase
      .from("ai_interactions")
      .insert(interaction)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Points and gamification
  async getUserPoints(userId: string) {
    const { data, error } = await supabase
      .from("user_points")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserPoints(userId: string, pointsToAdd: number) {
    const { data: currentPoints } = await supabase
      .from("user_points")
      .select("points, level")
      .eq("user_id", userId)
      .single();

    if (!currentPoints) return null;

    const newPoints = currentPoints.points + pointsToAdd;
    const newLevel = Math.floor(newPoints / 100) + 1; // Level up every 100 points

    const { data, error } = await supabase
      .from("user_points")
      .update({
        points: newPoints,
        level: newLevel,
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Linked accounts operations
  async getLinkedAccounts(userId: string) {
    const { data, error } = await supabase
      .from("linked_accounts")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async addLinkedAccount(account: {
    user_id: string;
    account_type: "bank" | "mobile_wallet" | "credit_card";
    provider_name: string;
    account_name: string;
    account_id: string;
    account_number_masked?: string;
    balance?: number;
    currency?: string;
  }) {
    const { data, error } = await supabase
      .from("linked_accounts")
      .insert(account)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAccountBalance(accountId: string, balance: number) {
    const { data, error } = await supabase
      .from("linked_accounts")
      .update({
        balance,
        last_sync_at: new Date().toISOString(),
      })
      .eq("id", accountId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeLinkedAccount(accountId: string) {
    const { error } = await supabase
      .from("linked_accounts")
      .update({ is_active: false })
      .eq("id", accountId);

    if (error) throw error;
    return true;
  },

  // Account transactions operations
  async getAccountTransactions(userId: string, accountId?: string, limit = 50) {
    let query = supabase
      .from("account_transactions")
      .select(
        `
        *,
        linked_accounts(account_name, provider_name, account_type)
      `,
      )
      .eq("user_id", userId)
      .order("transaction_date", { ascending: false })
      .limit(limit);

    if (accountId) {
      query = query.eq("linked_account_id", accountId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async syncAccountTransactions(accountId: string, transactions: any[]) {
    const { data, error } = await supabase
      .from("account_transactions")
      .upsert(transactions, {
        onConflict: "linked_account_id,transaction_id",
      })
      .select();

    if (error) throw error;
    return data;
  },

  // Analytics helpers
  async getSpendingByCategory(
    userId: string,
    startDate?: string,
    endDate?: string,
  ) {
    let query = supabase
      .from("expenses")
      .select(
        `
        amount,
        categories(name, color)
      `,
      )
      .eq("user_id", userId);

    if (startDate) query = query.gte("expense_date", startDate);
    if (endDate) query = query.lte("expense_date", endDate);

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async getMonthlySpending(userId: string, year: number) {
    const { data, error } = await supabase
      .from("expenses")
      .select("amount, expense_date")
      .eq("user_id", userId)
      .gte("expense_date", `${year}-01-01`)
      .lte("expense_date", `${year}-12-31`)
      .order("expense_date");

    if (error) throw error;
    return data;
  },

  async getCombinedTransactions(userId: string, limit = 100) {
    // Get both manual expenses and account transactions
    const [expensesResult, transactionsResult] = await Promise.all([
      this.getExpenses(userId, limit / 2),
      this.getAccountTransactions(userId, undefined, limit / 2),
    ]);

    // Combine and sort by date
    const combined = [
      ...expensesResult.map((expense) => ({
        ...expense,
        source: "manual",
        date: expense.expense_date,
      })),
      ...transactionsResult.map((transaction) => ({
        ...transaction,
        source: "linked_account",
        date: transaction.transaction_date,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return combined.slice(0, limit);
  },

  // Email verification operations
  async sendVerificationEmail(email: string, fullName: string) {
    try {
      // Validate email format before sending
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-send-verification-email",
        {
          body: { email, fullName },
        },
      );

      if (error) {
        console.error("Email sending error:", error);
        throw new Error(error.message || "Failed to send verification email");
      }

      return data;
    } catch (error) {
      console.error("Send verification email error:", error);
      throw error;
    }
  },

  async verifyEmailCode(email: string, code: string) {
    try {
      // Validate inputs
      if (!email || !code) {
        throw new Error("Email and verification code are required");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      if (code.length !== 6 || !/^\d{6}$/.test(code)) {
        throw new Error("Verification code must be 6 digits");
      }

      // Check if the code exists and is valid
      const { data, error } = await supabase
        .from("email_verifications")
        .select("*")
        .eq("email", email)
        .eq("code", code)
        .eq("verified", false)
        .gte("expires_at", new Date().toISOString())
        .single();

      if (error) {
        console.error("Database error during verification:", error);
        if (error.code === "PGRST116") {
          throw new Error("Invalid or expired verification code");
        }
        throw new Error("Database error occurred during verification");
      }

      if (!data) {
        throw new Error("Invalid or expired verification code");
      }

      // Mark the code as verified
      const { error: updateError } = await supabase
        .from("email_verifications")
        .update({
          verified: true,
          verified_at: new Date().toISOString(),
        })
        .eq("id", data.id);

      if (updateError) {
        console.error(
          "Database error during verification update:",
          updateError,
        );
        throw new Error("Failed to verify code");
      }

      return data;
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    }
  },
};
