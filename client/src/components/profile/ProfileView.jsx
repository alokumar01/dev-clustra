import { Card } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import EditProfileDialog from "./EditProfileDialog";

export default function ProfileView({ user }) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">

      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-5 items-center">
            <Image
              src={user.avatar}
              alt="profile"
              width={100}
              height={100}
              className="rounded-full border"
              unoptimized
            />

            <div>
              <h1 className="text-3xl font-bold">
                {user.username}
              </h1>

              <p className="text-gray-500">
                @{user.username}
              </p>

              <p className="mt-2 text-sm">
                {user.bio || "No bio added yet"}
              </p>
            </div>
          </div>

          <Button>
            <EditProfileDialog user={user} />
          </Button>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Personal Information
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <InfoRow
            label="Username"
            value={user.username}
          />

          <InfoRow
            label="Email"
            value={user.email}
          />

          <InfoRow
            label="Bio"
            value={user.bio || "Not provided"}
          />
        </div>
      </Card>

      {/* Account Details */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Account Details
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <InfoRow
            label="Status"
            value={user.accountStatus}
          />

          <InfoRow
            label="Email Verified"
            value={user.isEmailVerified ? "✅ Verified" : "❌ Not Verified"}
          />

          <InfoRow
            label="Joined"
            value={new Date(user.createdAt).toLocaleDateString()}
          />

          <InfoRow
            label="Last Updated"
            value={new Date(user.updatedAt).toLocaleDateString()}
          />

          <InfoRow
            label="Last Username Change"
            value={
              user.lastUsernameChange
                ? new Date(
                    user.lastUsernameChange
                  ).toLocaleDateString()
                : "Never"
            }
          />
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-medium">
        {value}
      </p>
    </div>
  );
}