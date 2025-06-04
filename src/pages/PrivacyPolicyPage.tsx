import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl bg-background">
      <div className="mb-8">
        <Link to="/auth">
          <Button variant="outline" size="sm">
            ← Back to Login
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Introduction
          </h2>
          <p>
            This Privacy Policy explains how our Financial Assistant application
            ("we", "our", or "us") collects, uses, and shares your personal
            information when you use our services. We are committed to
            protecting your privacy and ensuring the security of your personal
            information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Information We Collect
          </h2>
          <p className="mb-2">
            We collect the following types of information when you use our
            Financial Assistant application:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Account Information:</strong> When you create an account,
              we collect your name, email address, and password.
            </li>
            <li>
              <strong>Financial Information:</strong> We collect information
              about your expenses, income, financial goals, and spending habits.
            </li>
            <li>
              <strong>Bank Account Information:</strong> If you choose to link
              your bank accounts, we collect account information through secure
              OAuth connections.
            </li>
            <li>
              <strong>Usage Information:</strong> We collect information about
              how you interact with our application, including the features you
              use and the time spent on different sections.
            </li>
            <li>
              <strong>Device Information:</strong> We collect information about
              the device you use to access our service, including device type,
              operating system, and browser type.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            How We Use Your Information
          </h2>
          <p className="mb-2">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide and maintain our service</li>
            <li>
              To personalize your experience and deliver tailored financial
              insights
            </li>
            <li>
              To analyze your spending patterns and provide recommendations
            </li>
            <li>
              To communicate with you about your account and provide customer
              support
            </li>
            <li>To improve our services and develop new features</li>
            <li>To detect and prevent fraudulent activity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Data Security
          </h2>
          <p>
            We implement appropriate security measures to protect your personal
            information from unauthorized access, alteration, disclosure, or
            destruction. These measures include encryption of sensitive data,
            regular security assessments, and strict access controls. However,
            no method of transmission over the Internet or electronic storage is
            100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Data Sharing and Disclosure
          </h2>
          <p className="mb-2">
            We may share your information in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Service Providers:</strong> We may share your information
              with third-party service providers who help us operate our
              service.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your
              information if required by law or in response to valid requests
              from public authorities.
            </li>
            <li>
              <strong>Business Transfers:</strong> If we are involved in a
              merger, acquisition, or sale of assets, your information may be
              transferred as part of that transaction.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may share your information
              with third parties when we have your consent to do so.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Your Rights
          </h2>
          <p className="mb-2">
            Depending on your location, you may have the following rights
            regarding your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              The right to access the personal information we hold about you
            </li>
            <li>The right to request correction of inaccurate information</li>
            <li>The right to request deletion of your personal information</li>
            <li>
              The right to restrict or object to processing of your personal
              information
            </li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Cookies and Tracking Technologies
          </h2>
          <p>
            We use cookies and similar tracking technologies to track activity
            on our service and hold certain information. Cookies are files with
            a small amount of data that may include an anonymous unique
            identifier. You can instruct your browser to refuse all cookies or
            to indicate when a cookie is being sent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Children's Privacy
          </h2>
          <p>
            Our service is not intended for use by children under the age of 13.
            We do not knowingly collect personal information from children under
            13. If you are a parent or guardian and you are aware that your
            child has provided us with personal information, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Changes to This Privacy Policy
          </h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date. You are advised to review this
            Privacy Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Contact Us
          </h2>
          <p className="mb-2">
            If you have any questions about this Privacy Policy or need
            assistance, please contact us using the information below:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Email:</strong> johnoccy19@gmail.com
            </li>
            <li>
              <strong>Phone:</strong> 0745924902
            </li>
          </ul>
        </section>

        <div className="pt-4 border-t border-border">
          <p className="text-sm">Last Updated: June 15, 2023</p>
        </div>
      </div>
    </div>
  );
}
