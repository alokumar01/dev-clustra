"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { checkUsername, signupWithAxios } from "@/app/services/auth.service";
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
import { useDebounce } from "@/lib/useDebounce";

export default function SignupPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({ username: "", email: "", password: "",});
    const [usernameStatus, setUsernameStatus] = useState("idle");
    const [userAvailable, setUserAvailable] = useState(null);
    const latestUsername = useRef("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        if (name === "username") {
            latestUsername.current = value.trim();
            setUserAvailable(null);
            setUsernameStatus(value.trim() ? "checking" : "idle");
        }
    }

    // DEBOUNCE ON CHECK USERNAME WHILE CREATING ACCOUNT
    const debouncedSearch = useDebounce(formData.username);

    useEffect(() => {
        if (!debouncedSearch.trim()) {
            setUserAvailable(null);
            setUsernameStatus("idle");
            return;
        }

        // if length of username is less than 3 then return
        if (debouncedSearch.trim().length < 3) {
            setUserAvailable(null);
            setUsernameStatus("validation");
            return;
        }

        let ignore = false;

        // check username availability
        const fetchUsername = async () => {
            setUsernameStatus("checking");

            try {
                const usernameAvail = await checkUsername(debouncedSearch.trim());

                if (ignore || latestUsername.current !== debouncedSearch.trim()) return;

                setUserAvailable(usernameAvail.available);
                setUsernameStatus(usernameAvail.available ? "available" : "unavailable");
            } catch (error) {
                if (ignore || latestUsername.current !== debouncedSearch.trim()) return;

                setUserAvailable(null);
                setUsernameStatus("error");
                console.error("error in check username in signup: ", error);
            }
        };

        fetchUsername();

        return () => {
            ignore = true;
        };
    }, [debouncedSearch]);

    const usernameFeedback = {
        checking: "Checking username...",
        validation: "Username must be between 3 and 18 characters.",
        available: "Username is available.",
        unavailable: "Username already exists.",
        error: "Could not check username right now.",
    }[usernameStatus];

    const isUsernameInvalid = usernameStatus === "unavailable";
    const disableSubmit = loading || usernameStatus === "checking" || usernameStatus === "validation" || userAvailable === false;

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
                            <div className="relative">
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Choose a username"
                                    aria-invalid={isUsernameInvalid}
                                    className="h-11 rounded-xl bg-background pr-10"
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    {usernameStatus === "checking" && (
                                        <Spinner className="size-4 text-muted-foreground" />
                                    )}
                                    {usernameStatus === "available" && (
                                        <CheckCircle2 className="size-4 text-green-600" />
                                    )}
                                    {usernameStatus === "unavailable" && (
                                        <XCircle className="size-4 text-destructive" />
                                    )}
                                </div>
                            </div>
                            <FieldDescription
                                className={
                                    usernameStatus === "available"
                                        ? "text-green-600"
                                        : usernameStatus === "validation" ||
                                            usernameStatus === "unavailable" ||
                                            usernameStatus === "error" ? "text-destructive"
                                        : ""
                                }
                            >
                                {usernameFeedback || "This name appears in conversations and invite flows."}
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
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                inputClassName="h-11 rounded-xl bg-background"
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>


                <Button
                    type="submit"
                    disabled={disableSubmit}
                    className="h-11 w-full rounded-xl text-sm font-semibold cursor-pointer"
                >
                    {loading ? <Spinner /> : "Create account"}
                    <ArrowRight className="size-4" />
                </Button>

                <Separator />
            </form>
        </AuthShell>
    );
}
