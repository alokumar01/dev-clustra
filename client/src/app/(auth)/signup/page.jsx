"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { signupWithAxios } from "@/app/services/auth.service";
import { AuthShell } from "@/components/ui/auth-shell";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useSearchParams, usePathname } from "next/navigation";
// import {  } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // const pathName = usePathname();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await signupWithAxios(formData);

            toast.success(response?.message || "Signup successful!");
            router.push("/login");
            
        } catch (submitError) {
            toast.error(submitError.response?.data?.message || "Unable to create account.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthShell
            badge="Create account"
            title="Create your DevClustra account"
            description="Create an account, verify your email, and then continue to the collaboration workspace."
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
                                This name appears in conversations and invite flows.
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
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                inputClassName="h-11 rounded-xl bg-background"
                            />
                            <FieldDescription>
                                Use at least 8 characters.
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </FieldSet>


                <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-xl text-sm font-semibold"
                >
                    {loading ? <Spinner /> : "Create account"}
                    <ArrowRight className="size-4" />
                </Button>

                <Separator />
            </form>
        </AuthShell>
    );
}
