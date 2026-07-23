"use client";

import { ArrowRight, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { forgotPassword } from "@/app/services/auth.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      const successMessage =
        response?.message ||
        "If this account exists, a password reset link has been sent to your email.";

      setMessage(successMessage);
      setSubmitted(true);
      toast.success(successMessage);

      window.setTimeout(() => {
        router.push("/login");
      }, 1400);
    } catch (submitError) {
      const errorMessage =
        submitError?.response?.data?.message || "Something went wrong. Please try again.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-border/70 bg-card/90 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader className="space-y-2 px-6 pt-6 sm:px-8">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <MailCheck className="size-4" />
            <span>Forgot password</span>
          </div>
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>
            {submitted
              ? "We’ve sent the next step to your inbox. You’ll be redirected to login shortly."
              : "Enter your email and we’ll help you get back into your account."}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6 sm:px-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <FieldSet>
                <FieldGroup className="gap-4">
                  <Field>
                    <FieldLabel htmlFor="email">Email address</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-11 rounded-xl bg-background"
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Button type="submit" disabled={loading} className="w-full">
                {<Spinner /> ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4 rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <MailCheck className="size-4 text-primary" />
                {message}
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/login")}
              >
                Go to login
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
