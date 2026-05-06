"use client";

import React, { useState } from "react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "@/app/services/auth.service";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await forgotPassword( email );
      toast.success(response?.message || "Password reset link will be sent to your email, if your account exists.");
    } catch (submitError) {
      toast.error(
        submitError.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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

      <Button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Submit"}
      </Button>
    </form>
  );
}