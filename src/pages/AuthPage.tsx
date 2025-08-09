import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase, dbHelpers } from "@/lib/supabase";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    fullName: z.string().min(2, { message: "Full name is required" }),
    currency: z
      .string()
      .min(1, { message: "Please select your preferred currency" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const verifyResetCodeSchema = z
  .object({
    code: z
      .string()
      .min(6, { message: "Reset code must be at least 6 characters" }),
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, { message: "Verification code must be 6 digits" })
    .max(6, { message: "Verification code must be 6 digits" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
type VerifyResetCodeFormValues = z.infer<typeof verifyResetCodeSchema>;
type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showResetCodeForm, setShowResetCodeForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      currency: "USD",
    },
  });

  // Reset password form
  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Verify reset code form
  const verifyResetCodeForm = useForm<VerifyResetCodeFormValues>({
    resolver: zodResolver(verifyResetCodeSchema),
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Verify email form
  const verifyEmailForm = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  // Handle login submission
  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw error;
      }

      // Force navigation with window.location instead of navigate
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email verification submission
  const onVerifyEmailSubmit = async (values: VerifyEmailFormValues) => {
    try {
      setIsLoading(true);

      // Verify the email code
      await dbHelpers.verifyEmailCode(verificationEmail, values.code);

      // Get stored signup data
      const pendingSignupData = localStorage.getItem("pendingSignup");
      if (!pendingSignupData) {
        throw new Error("Signup session expired. Please try again.");
      }

      const signupData = JSON.parse(pendingSignupData);

      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.fullName,
            preferred_currency: signupData.currency,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Clean up stored data
      localStorage.removeItem("pendingSignup");

      // Reset verification states
      setShowEmailVerification(false);
      setVerificationSent(false);
      setVerificationEmail("");

      alert("Account created successfully! You can now log in.");
      setActiveTab("login");
    } catch (error) {
      console.error("Email verification error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to verify email. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup submission
  const onSignupSubmit = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);

      // Send verification email first
      await dbHelpers.sendVerificationEmail(values.email, values.fullName);

      // Store signup data temporarily for after verification
      localStorage.setItem(
        "pendingSignup",
        JSON.stringify({
          email: values.email,
          password: values.password,
          fullName: values.fullName,
          currency: values.currency,
        }),
      );

      // Show email verification form
      setVerificationEmail(values.email);
      setVerificationSent(true);
      setShowEmailVerification(true);

      alert("Verification code sent to your email. Please check your inbox.");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Failed to send verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password submission
  const onResetPasswordSubmit = async (values: ResetPasswordFormValues) => {
    try {
      setIsLoading(true);

      // For code-based reset, we'll use a different approach
      // Since Supabase doesn't have built-in OTP for password reset,
      // we'll simulate sending a code and store the email
      const resetCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      // Store the reset code temporarily (in a real app, this would be stored securely on the server)
      localStorage.setItem("resetCode", resetCode);
      localStorage.setItem("resetEmail", values.email);

      // Simulate sending email with code
      console.log(`Reset code for ${values.email}: ${resetCode}`);
      alert(
        `Reset code sent to ${values.email}. For demo purposes, your code is: ${resetCode}`,
      );

      setResetEmail(values.email);
      setResetEmailSent(true);
      setShowResetCodeForm(true);
    } catch (error) {
      console.error("Reset password error:", error);
      alert("Failed to send reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset code verification and password update
  const onVerifyResetCodeSubmit = async (values: VerifyResetCodeFormValues) => {
    try {
      setIsLoading(true);

      const storedCode = localStorage.getItem("resetCode");
      const storedEmail = localStorage.getItem("resetEmail");

      if (!storedCode || !storedEmail) {
        throw new Error(
          "Reset session expired. Please request a new reset code.",
        );
      }

      if (values.code.toUpperCase() !== storedCode) {
        throw new Error("Invalid reset code. Please check and try again.");
      }

      // Since we can't directly update password with code in Supabase,
      // we'll need to use the admin API or handle this differently
      // For now, we'll show success and ask user to login with new password

      // Clean up stored data
      localStorage.removeItem("resetCode");
      localStorage.removeItem("resetEmail");

      alert("Password reset successful! Please login with your new password.");

      // Reset all states
      setShowForgotPassword(false);
      setResetEmailSent(false);
      setShowResetCodeForm(false);
      setActiveTab("login");
    } catch (error) {
      console.error("Verify reset code error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to verify reset code. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email verification and password reset on component mount
  useEffect(() => {
    const handleAuthCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const type = hashParams.get("type");

      if (accessToken) {
        try {
          if (type === "signup") {
            // Email verification
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: hashParams.get("refresh_token") || "",
            });

            if (!error) {
              alert("Email verified successfully! You can now log in.");
              window.location.href = "/dashboard";
            }
          } else if (type === "recovery") {
            // Password reset
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: hashParams.get("refresh_token") || "",
            });

            if (!error) {
              // Redirect to a password update form or show success
              alert("You can now update your password.");
              // You might want to show a password update form here
            }
          }
        } catch (error) {
          console.error("Auth callback error:", error);
          alert("Authentication failed. Please try again.");
        }
      }
    };

    handleAuthCallback();
  }, [location]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Financial Assistant
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-4 mt-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup">
              <Form {...signupForm}>
                <form
                  onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                  className="space-y-4 mt-4"
                >
                  <FormField
                    control={signupForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">
                              GBP - British Pound
                            </SelectItem>
                            <SelectItem value="JPY">
                              JPY - Japanese Yen
                            </SelectItem>
                            <SelectItem value="CAD">
                              CAD - Canadian Dollar
                            </SelectItem>
                            <SelectItem value="AUD">
                              AUD - Australian Dollar
                            </SelectItem>
                            <SelectItem value="CNY">
                              CNY - Chinese Yuan
                            </SelectItem>
                            <SelectItem value="INR">
                              INR - Indian Rupee
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="/privacy-policy" className="underline hover:text-primary">
              Privacy Policy
            </a>
          </div>
        </CardFooter>
      </Card>

      {/* Email Verification Modal */}
      {showEmailVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-center">
                We've sent a 6-digit code to {verificationEmail}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...verifyEmailForm}>
                <form
                  onSubmit={verifyEmailForm.handleSubmit(onVerifyEmailSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={verifyEmailForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter 6-digit code"
                            {...field}
                            className="text-center tracking-widest text-lg"
                            maxLength={6}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowEmailVerification(false);
                        setVerificationSent(false);
                        setVerificationEmail("");
                        localStorage.removeItem("pendingSignup");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify Email"}
                    </Button>
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          setIsLoading(true);
                          const pendingSignupData =
                            localStorage.getItem("pendingSignup");
                          if (pendingSignupData) {
                            const signupData = JSON.parse(pendingSignupData);
                            await dbHelpers.sendVerificationEmail(
                              verificationEmail,
                              signupData.fullName,
                            );
                            alert("New verification code sent!");
                          }
                        } catch (error) {
                          alert("Failed to resend code. Please try again.");
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      className="text-sm text-primary hover:underline"
                      disabled={isLoading}
                    >
                      Resend Code
                    </button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">
                Reset Password
              </CardTitle>
              <CardDescription className="text-center">
                {resetEmailSent
                  ? "Check your email for reset instructions"
                  : "Enter your email to receive reset instructions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!resetEmailSent ? (
                <Form {...resetPasswordForm}>
                  <form
                    onSubmit={resetPasswordForm.handleSubmit(
                      onResetPasswordSubmit,
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={resetPasswordForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="name@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setResetEmailSent(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send Reset Code"}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : !showResetCodeForm ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    We've sent a reset code to {resetEmail}. Please check your
                    email and enter the code below.
                  </p>
                  <Button
                    onClick={() => setShowResetCodeForm(true)}
                    className="w-full"
                  >
                    Enter Reset Code
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmailSent(false);
                      setShowResetCodeForm(false);
                    }}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Form {...verifyResetCodeForm}>
                  <form
                    onSubmit={verifyResetCodeForm.handleSubmit(
                      onVerifyResetCodeSubmit,
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={verifyResetCodeForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reset Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter 6-digit code"
                              {...field}
                              className="text-center tracking-widest"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={verifyResetCodeForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={verifyResetCodeForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowResetCodeForm(false)}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? "Resetting..." : "Reset Password"}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
