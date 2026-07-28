import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import EditProfileDialog from "./EditProfileDialog";
import { CalendarDays, CheckCircle2, Mail, UserRound } from "lucide-react";

export default function ProfileView({ user }) {
  const username = user?.username || "Developer";
  const email = user?.email || "No email available";
  const joined = user?.createdAt ? formatDate(user.createdAt) : "Recently";

  return (
    <section className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
      <Card className="border-border/80 bg-background/95 shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <Avatar className="size-24 ring-4 ring-primary/10">
                <AvatarImage src={user?.avatar} alt={`${username} avatar`} />
                <AvatarFallback className="text-2xl">
                  {username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
                    {username}
                  </h1>
                  {user?.isEmailVerified && (
                    <Badge variant="outline" className="h-7 rounded-full border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]">
                      <CheckCircle2 className="size-3.5" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  @{username}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {user?.bio || "No bio added yet."}
                </p>
              </div>
            </div>

            <EditProfileDialog user={user} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/80 bg-background/95 shadow-sm">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 p-5 pt-0 sm:grid-cols-2 sm:p-6 sm:pt-0">
            <InfoTile icon={UserRound} label="Username" value={username} />
            <InfoTile icon={Mail} label="Email" value={email} />
            <InfoTile icon={CalendarDays} label="Joined" value={joined} />
            <InfoTile
              icon={CheckCircle2}
              label="Email Status"
              value={user?.isEmailVerified ? "Verified" : "Not verified"}
            />
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-primary text-primary-foreground shadow-sm">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-5 sm:p-6">
            <div>
              <p className="text-sm font-medium text-primary-foreground/75">
                DevClustra Profile
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Built around your workspace identity.
              </h2>
            </div>
            <p className="text-sm leading-6 text-primary-foreground/80">
              Keep your username, bio, and avatar current so teammates can
              recognize you quickly in chats.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/35 p-4">
      <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-words font-medium">
        {value}
      </p>
    </div>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
