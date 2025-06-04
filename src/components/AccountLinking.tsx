import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Smartphone,
  Building2,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { usePlaidLink } from "react-plaid-link";
import { supabase, dbHelpers } from "@/lib/supabase";

interface LinkedAccount {
  id: string;
  account_type: "bank" | "mobile_wallet" | "credit_card";
  provider_name: string;
  account_name: string;
  account_number_masked: string;
  balance: number;
  currency: string;
  is_active: boolean;
  last_sync_at: string;
  created_at: string;
}

interface AccountLinkingProps {
  userId?: string;
}

const AccountLinking = ({ userId = "demo-user" }: AccountLinkingProps) => {
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [showBalance, setShowBalance] = useState<Record<string, boolean>>({});
  const [plaidLinkToken, setPlaidLinkToken] = useState<string | null>(null);
  const [usePlaidMethod, setUsePlaidMethod] = useState(false);

  // Form state for linking new account
  const [accountType, setAccountType] = useState<string>("");
  const [providerName, setProviderName] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const bankProviders = [
    "Chase Bank",
    "Bank of America",
    "Wells Fargo",
    "Citibank",
    "Capital One",
    "US Bank",
    "PNC Bank",
    "TD Bank",
    "Other Bank",
  ];

  const walletProviders = [
    "PayPal",
    "Apple Pay",
    "Google Pay",
    "Samsung Pay",
    "Venmo",
    "Cash App",
    "Zelle",
    "Other Wallet",
  ];

  const creditCardProviders = [
    "Visa",
    "Mastercard",
    "American Express",
    "Discover",
    "Capital One",
    "Chase",
    "Citi",
    "Other Card",
  ];

  // Generate a Plaid link token
  const generatePlaidLinkToken = useCallback(async () => {
    try {
      setLoading(true);
      // In a real implementation, this would call your backend to generate a link token
      // For demo purposes, we'll simulate this with a timeout
      setTimeout(() => {
        // This is a fake token - in a real app, you would get this from your server
        setPlaidLinkToken("link-sandbox-12345-temporary-token");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error generating Plaid link token:", error);
      setLoading(false);
    }
  }, []);

  // Configure Plaid Link
  const { open, ready } = usePlaidLink({
    token: plaidLinkToken || "",
    onSuccess: (public_token, metadata) => {
      // In a real implementation, you would send the public_token to your server
      // to exchange it for an access_token and retrieve account data
      console.log("Plaid Link success:", public_token, metadata);

      // Simulate successful account linking
      handlePlaidSuccess(metadata);
    },
    onExit: (err, metadata) => {
      console.log("Plaid Link exit:", err, metadata);
      setLoading(false);
    },
    onEvent: (eventName, metadata) => {
      console.log("Plaid Link event:", eventName, metadata);
    },
  });

  // Handle successful Plaid linking
  const handlePlaidSuccess = async (metadata: any) => {
    try {
      setLoading(true);

      // Simulate account data from Plaid
      const mockAccountId = `plaid_${Date.now()}`;
      const mockBalance = Math.random() * 10000;
      const maskedNumber = `****${Math.floor(Math.random() * 9999)
        .toString()
        .padStart(4, "0")}`;

      const bankName = metadata?.institution?.name || "Plaid Bank";

      const newAccount = {
        user_id: userId,
        account_type: "bank",
        provider_name: bankName,
        account_name: `${bankName} Checking`,
        account_number_masked: maskedNumber,
        account_id: mockAccountId,
        balance: mockBalance,
        currency: "USD",
        is_active: true,
        last_sync_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("linked_accounts")
        .insert(newAccount)
        .select()
        .single();

      if (error) throw error;

      // Reset form and dialog
      setShowLinkDialog(false);
      setUsePlaidMethod(false);
      setPlaidLinkToken(null);

      // Reload accounts
      await loadLinkedAccounts();
    } catch (error) {
      console.error("Error linking Plaid account:", error);
      alert("Failed to link account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinkedAccounts();
  }, [userId]);

  // Launch Plaid when token is ready
  useEffect(() => {
    if (plaidLinkToken && ready && usePlaidMethod) {
      open();
    }
  }, [plaidLinkToken, ready, open, usePlaidMethod]);

  const loadLinkedAccounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("linked_accounts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLinkedAccounts(data || []);
    } catch (error) {
      console.error("Error loading linked accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAccount = async () => {
    if (!accountType || !providerName || !accountName || !username) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      // Simulate account linking process
      const mockAccountId = `${accountType}_${Date.now()}`;
      const mockBalance = Math.random() * 10000;
      const maskedNumber = `****${Math.floor(Math.random() * 9999)
        .toString()
        .padStart(4, "0")}`;

      const newAccount = {
        user_id: userId,
        account_type: accountType as "bank" | "mobile_wallet" | "credit_card",
        provider_name: providerName,
        account_name: accountName,
        account_number_masked: maskedNumber,
        account_id: mockAccountId,
        balance: mockBalance,
        currency: "USD",
        is_active: true,
        last_sync_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("linked_accounts")
        .insert(newAccount)
        .select()
        .single();

      if (error) throw error;

      // Reset form
      setAccountType("");
      setProviderName("");
      setAccountName("");
      setUsername("");
      setPassword("");
      setShowLinkDialog(false);

      // Reload accounts
      await loadLinkedAccounts();
    } catch (error) {
      console.error("Error linking account:", error);
      alert("Failed to link account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAccount = async (accountId: string) => {
    try {
      setSyncing(accountId);

      // Simulate sync process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newBalance = Math.random() * 10000;
      const { error } = await supabase
        .from("linked_accounts")
        .update({
          balance: newBalance,
          last_sync_at: new Date().toISOString(),
        })
        .eq("id", accountId);

      if (error) throw error;

      await loadLinkedAccounts();
    } catch (error) {
      console.error("Error syncing account:", error);
    } finally {
      setSyncing(null);
    }
  };

  const handleRemoveAccount = async (accountId: string) => {
    if (!confirm("Are you sure you want to remove this account?")) return;

    try {
      const { error } = await supabase
        .from("linked_accounts")
        .delete()
        .eq("id", accountId);

      if (error) throw error;

      await loadLinkedAccounts();
    } catch (error) {
      console.error("Error removing account:", error);
    }
  };

  const toggleBalanceVisibility = (accountId: string) => {
    setShowBalance((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "bank":
        return <Building2 className="h-5 w-5" />;
      case "mobile_wallet":
        return <Smartphone className="h-5 w-5" />;
      case "credit_card":
        return <CreditCard className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getProviderOptions = () => {
    switch (accountType) {
      case "bank":
        return bankProviders;
      case "mobile_wallet":
        return walletProviders;
      case "credit_card":
        return creditCardProviders;
      default:
        return [];
    }
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Linked Accounts</h1>
            <p className="text-muted-foreground">
              Connect your bank accounts and mobile wallets for comprehensive
              financial tracking
            </p>
          </div>
          <Button onClick={() => setShowLinkDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Link Account
          </Button>
        </div>

        {loading && linkedAccounts.length === 0 ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading your accounts...</p>
          </div>
        ) : linkedAccounts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Accounts Linked</h3>
              <p className="text-muted-foreground mb-4">
                Connect your first account to start tracking your finances
                automatically
              </p>
              <Button onClick={() => setShowLinkDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Link Your First Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {linkedAccounts.map((account) => (
              <Card key={account.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getAccountIcon(account.account_type)}
                      <div>
                        <CardTitle className="text-sm">
                          {account.account_name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {account.provider_name}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={account.is_active ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {account.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Account
                      </span>
                      <span className="text-sm font-mono">
                        {account.account_number_masked}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Balance
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {showBalance[account.id]
                            ? `$${account.balance?.toLocaleString() || "0.00"}`
                            : "••••••"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBalanceVisibility(account.id)}
                          className="h-6 w-6 p-0"
                        >
                          {showBalance[account.id] ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Last Sync
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {account.last_sync_at
                          ? new Date(account.last_sync_at).toLocaleDateString()
                          : "Never"}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSyncAccount(account.id)}
                        disabled={syncing === account.id}
                        className="flex-1"
                      >
                        {syncing === account.id ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveAccount(account.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Link Account Dialog */}
        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Link New Account</DialogTitle>
              <DialogDescription>
                Connect your bank account or mobile wallet to track transactions
                automatically.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Account Type *
                </label>
                <Select value={accountType} onValueChange={setAccountType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Account</SelectItem>
                    <SelectItem value="mobile_wallet">Mobile Wallet</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {accountType && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Provider *
                  </label>
                  <Select value={providerName} onValueChange={setProviderName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {getProviderOptions().map((provider) => (
                        <SelectItem key={provider} value={provider}>
                          {provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Account Name *
                </label>
                <Input
                  placeholder="e.g., My Checking Account"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Username/Email *
                </label>
                <Input
                  placeholder="Your account username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Password *
                </label>
                <Input
                  type="password"
                  placeholder="Your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <p className="font-medium mb-1">Your data is secure</p>
                    <p>
                      We use bank-level encryption to protect your credentials.
                      Your login information is never stored in plain text.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-medium text-blue-800">
                  Secure Account Linking with Plaid
                </h3>
              </div>
              <p className="text-xs text-blue-800 mb-3">
                Connect your accounts securely using Plaid, a trusted financial
                services platform that enables secure connections with thousands
                of financial institutions.
              </p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setUsePlaidMethod(true);
                  generatePlaidLinkToken();
                }}
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Lock className="h-4 w-4 mr-2" />
                )}
                Connect with Plaid
              </Button>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Or connect manually
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowLinkDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleLinkAccount} disabled={loading}>
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Link Account Manually
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AccountLinking;
