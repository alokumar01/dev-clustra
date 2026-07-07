"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Rocket, ShieldPlus, UserRoundPlus } from "lucide-react";
import { signupWithAxios } from "@/app/services/auth.service";
import { AuthShell } from "@/components/ui/auth-shell";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        // if (error) {
        //   setError("");
        // }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await signupWithAxios(formData);

            toast.success(response?.message || "Signup successful!");

            router.push("/login");
        } catch (submitError) {
            console.log("submit error", submitError);
            toast.error(submitError.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthShell
            badge="Create account"
            title="Start building with Dev Clustra"
            description="Set up your account in a few seconds and move straight into your workspace with a cleaner, more confident onboarding flow."
            heroTitle="An onboarding screen that finally feels production-ready."
            heroDescription="This signup refresh adds better layout rhythm, stronger guidance, and a more modern visual system while keeping your existing API integration intact."
            highlights={[
                {
                    icon: UserRoundPlus,
                    title: "Less friction upfront",
                    description:
                        "Helpful copy and cleaner field structure make the first interaction easier to understand.",
                },
                {
                    icon: ShieldPlus,
                    title: "Safer first impression",
                    description:
                        "Trust signals and clearer spacing make the experience feel more polished and credible.",
                },
                {
                    icon: Rocket,
                    title: "Ready to scale",
                    description:
                        "A reusable auth shell gives login and signup a shared visual language you can extend later.",
                },
            ]}
            alternatePrompt="Already have an account?"
            alternateHref="/login"
            alternateLabel="Sign in"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <FieldSet>
                    <FieldGroup className="gap-4">
                        <Field>
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                className="h-11 rounded-xl bg-background"
                            />
                            <FieldDescription>
                                Pick a unique handle people will recognize in
                                your workspace.
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="email">
                                Email address
                            </FieldLabel>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="h-11 rounded-xl bg-background"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                className="h-11 rounded-xl bg-background"
                            />
                            <FieldDescription>
                                Use at least 8 characters so your account starts
                                with a solid baseline.
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </FieldSet>

                {/* {error ? (
          <FieldError className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2.5">
            {error}
          </FieldError>
        ) : null} */}

                <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-xl text-sm font-semibold"
                >
                    {loading ? <Spinner /> : "Create account"}
                    <ArrowRight className="size-4" />
                </Button>

                <Separator />

                {/* <p className="text-center text-sm leading-6 text-muted-foreground">
          Your account will be created through the existing backend signup endpoint.
        </p> */}
            </form>
        </AuthShell>
    );
}
