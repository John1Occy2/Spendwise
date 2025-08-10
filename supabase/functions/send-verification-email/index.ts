import { corsHeaders } from "@shared/cors.ts";
import { createTransporter } from "@shared/email.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Enhanced error logging utility
const logError = (context: string, error: any) => {
  console.error(`[${context}] Error:`, {
    message: error?.message || "Unknown error",
    stack: error?.stack,
    timestamp: new Date().toISOString(),
  });
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    // Validate request method
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Use POST." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 405,
        },
      );
    }

    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      logError("JSON_PARSE", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    const { email, fullName } = requestBody;

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Initialize Supabase client with validation
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      logError(
        "ENV_VALIDATION",
        new Error("Missing required environment variables"),
      );
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Store verification code in database
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    const now = new Date().toISOString();

    // First, try to delete any existing unverified codes for this email
    await supabase
      .from("email_verifications")
      .delete()
      .eq("email", email)
      .eq("verified", false);

    // Insert new verification code
    const { error: dbError } = await supabase
      .from("email_verifications")
      .insert({
        email,
        code: verificationCode,
        expires_at: expiresAt.toISOString(),
        verified: false,
        created_at: now,
      });

    if (dbError) {
      logError("DATABASE_INSERT", dbError);
      return new Response(
        JSON.stringify({
          error: "Failed to store verification code",
          details:
            process.env.NODE_ENV === "development"
              ? dbError.message
              : undefined,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Create email transporter with error handling
    let transporter;
    try {
      transporter = await createTransporter();
    } catch (transporterError) {
      logError("EMAIL_TRANSPORTER", transporterError);
      return new Response(
        JSON.stringify({ error: "Email service configuration error" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Financial Assistant</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e9ecef; }
          .code-box { background: #f8f9fa; border: 2px solid #007bff; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 4px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6c757d; }
          .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Financial Assistant</h1>
            <p>Email Verification</p>
          </div>
          <div class="content">
            <h2>Hello ${fullName || "there"}!</h2>
            <p>Thank you for signing up for Financial Assistant. To complete your registration, please verify your email address using the code below:</p>
            
            <div class="code-box">
              <div class="code">${verificationCode}</div>
            </div>
            
            <p>Enter this code in the verification form to activate your account.</p>
            
            <p><strong>Important:</strong></p>
            <ul>
              <li>This code will expire in 10 minutes</li>
              <li>If you didn't create an account, please ignore this email</li>
              <li>Never share this code with anyone</li>
            </ul>
            
            <p>If you have any questions, please contact our support team.</p>
            
            <p>Best regards,<br>The Financial Assistant Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; 2024 Financial Assistant. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
      Financial Assistant - Email Verification
      
      Hello ${fullName || "there"}!
      
      Thank you for signing up for Financial Assistant. To complete your registration, please verify your email address using the code below:
      
      Verification Code: ${verificationCode}
      
      Enter this code in the verification form to activate your account.
      
      Important:
      - This code will expire in 10 minutes
      - If you didn't create an account, please ignore this email
      - Never share this code with anyone
      
      If you have any questions, please contact our support team.
      
      Best regards,
      The Financial Assistant Team
      
      This is an automated message. Please do not reply to this email.
    `;

    // Send email with enhanced error handling
    try {
      const fromEmail = Deno.env.get("SMTP_FROM_EMAIL");
      if (!fromEmail) {
        throw new Error("SMTP_FROM_EMAIL environment variable is not set");
      }

      await transporter.sendMail({
        from: `"Financial Assistant" <${fromEmail}>`,
        to: email,
        subject: "Verify Your Email - Financial Assistant",
        text: textContent,
        html: htmlContent,
      });
    } catch (emailError) {
      logError("EMAIL_SEND", emailError);

      // Clean up the verification code if email fails
      await supabase
        .from("email_verifications")
        .delete()
        .eq("email", email)
        .eq("code", verificationCode);

      return new Response(
        JSON.stringify({
          error: "Failed to send verification email",
          details:
            process.env.NODE_ENV === "development"
              ? emailError.message
              : undefined,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification email sent successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    logError("GENERAL_ERROR", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
