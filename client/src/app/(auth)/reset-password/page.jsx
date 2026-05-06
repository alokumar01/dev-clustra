"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { resetPassword } from "@/app/services/auth.service";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await resetPassword(token, password);
            toast.success(response?.message || "Password reset successfull Client!")
            router.push("/login")
        } catch (submitError) {
            toast.error(
                submitError.response?.data?.message || "Kuch to gadbad hai daya",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className=" max-w-sm item-center justify-center ">
            <CardHeader className="">
                <CardTitle>Dev Clustra</CardTitle>
                <CardDescription>Enter your new password</CardDescription>
                <CardAction>
                    <Button variant="link">
                        <Link href="/login">Login</Link>
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2.5">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="........"
                                required
                            />
                        </div>
                        <div className="grid gap-2.5">
                            <Label htmlFor="password">Confirm Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="........"
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                    {loading ? <Spinner /> : "Submit"}
                </Button>
                </form>
            </CardContent>
        </Card>
    );
}
