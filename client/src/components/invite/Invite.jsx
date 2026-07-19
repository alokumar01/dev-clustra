import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { generateInviteToken } from "@/app/services/invite.service";

export default function InviteView() {
    const [loading, setLoading] = useState(false);
    const [inviteToken, setInviteToken] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerateInvite = async () => {
        setLoading(true);
        try {
            const res = await generateInviteToken();
            setInviteToken(res.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Card className="p-6">
                <div>
                    <h2>You can generate link and invite someone for chat...</h2>

                    {inviteToken && (
                        <div className="bg-sky-300 rounded-2xl p-6">
                            <p>{inviteToken.fullUrl}</p>
                        </div>
                    )}

                    <Button className="p-2 mt-20" onClick={() => handleGenerateInvite()}>
                        Generate Invite link
                    </Button>
                </div>

            </Card>
        </div>
    )
}
