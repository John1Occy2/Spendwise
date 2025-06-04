// This file would contain Plaid API integration code in a real application
// For now, it's a placeholder with mock functions

import { supabase } from "./supabase";

export interface PlaidLinkOptions {
  token: string;
  onSuccess: (publicToken: string, metadata: any) => void;
  onExit?: (err: any, metadata: any) => void;
  onEvent?: (eventName: string, metadata: any) => void;
}

export const plaidHelpers = {
  // In a real app, this would call your backend which would use Plaid's API
  async createLinkToken(userId: string): Promise<string> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `link-sandbox-${userId}-${Date.now()}`;
  },

  async exchangePublicToken(publicToken: string): Promise<string> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `access-sandbox-${Date.now()}`;
  },

  async getAccounts(accessToken: string) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return mock accounts
    return [
      {
        account_id: `acc_${Date.now()}_1`,
        name: "Checking Account",
        mask: "1234",
        type: "depository",
        subtype: "checking",
        balances: {
          available: 1000 + Math.random() * 5000,
          current: 1000 + Math.random() * 5000,
          limit: null,
        },
      },
      {
        account_id: `acc_${Date.now()}_2`,
        name: "Savings Account",
        mask: "5678",
        type: "depository",
        subtype: "savings",
        balances: {
          available: 5000 + Math.random() * 10000,
          current: 5000 + Math.random() * 10000,
          limit: null,
        },
      },
      {
        account_id: `acc_${Date.now()}_3`,
        name: "Credit Card",
        mask: "9012",
        type: "credit",
        subtype: "credit card",
        balances: {
          available: 5000,
          current: -1000 - Math.random() * 2000,
          limit: 5000,
        },
      },
    ];
  },

  async getTransactions(
    accessToken: string,
    startDate: string,
    endDate: string,
  ) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate random transactions
    const transactions = [];
    const merchants = [
      "Amazon",
      "Walmart",
      "Target",
      "Starbucks",
      "Uber",
      "Netflix",
      "Spotify",
      "Apple",
      "Google",
      "Microsoft",
    ];

    const categories = [
      ["Food and Drink", "Restaurants"],
      ["Food and Drink", "Coffee Shop"],
      ["Shops", "Retail"],
      ["Shops", "Online"],
      ["Transportation", "Ride Share"],
      ["Entertainment", "Streaming Services"],
      ["Entertainment", "Music"],
      ["Technology", "Software"],
      ["Technology", "Hardware"],
    ];

    // Generate 20 random transactions
    for (let i = 0; i < 20; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date in the last 30 days

      const merchant = merchants[Math.floor(Math.random() * merchants.length)];
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const amount = Math.round(Math.random() * 10000) / 100; // Random amount between 0 and 100

      transactions.push({
        transaction_id: `tx_${Date.now()}_${i}`,
        account_id: `acc_${Date.now()}_${Math.floor(Math.random() * 3) + 1}`,
        date: date.toISOString().split("T")[0],
        name: merchant,
        merchant_name: merchant,
        amount: amount,
        currency: "USD",
        category,
        pending: Math.random() > 0.9, // 10% chance of being pending
      });
    }

    return transactions;
  },

  // Save Plaid accounts to our database
  async savePlaidAccounts(
    userId: string,
    accounts: any[],
    institutionName: string,
  ) {
    const linkedAccounts = accounts.map((account) => ({
      user_id: userId,
      account_type: account.type === "credit" ? "credit_card" : "bank",
      provider_name: institutionName,
      account_name: account.name,
      account_number_masked: account.mask ? `****${account.mask}` : "****",
      account_id: account.account_id,
      balance: account.balances.available || account.balances.current,
      currency: "USD",
      is_active: true,
      last_sync_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from("linked_accounts")
      .insert(linkedAccounts)
      .select();

    if (error) throw error;
    return data;
  },

  // Save Plaid transactions to our database
  async savePlaidTransactions(userId: string, transactions: any[]) {
    const formattedTransactions = transactions.map((tx) => ({
      user_id: userId,
      linked_account_id: tx.account_id,
      transaction_id: tx.transaction_id,
      amount: tx.amount,
      description: tx.name,
      merchant_name: tx.merchant_name,
      category: tx.category?.[0] || "Uncategorized",
      subcategory: tx.category?.[1] || null,
      transaction_date: tx.date,
      is_pending: tx.pending,
    }));

    const { data, error } = await supabase
      .from("account_transactions")
      .insert(formattedTransactions)
      .select();

    if (error) throw error;
    return data;
  },
};
