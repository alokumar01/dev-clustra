"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
  Camera,
  Loader2,
  User,
  FileText,
} from "lucide-react";

import {
  updateAvatar,
  updateProfile,
} from "@/app/services/auth.service";

import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export default function EditProfileDialog({ user }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getMe = useAuthStore((state) => state.getMe);

  const [preview, setPreview] = useState(user.avatar);

  const [formData, setFormData] = useState({
    username: user.username,
    bio: user.bio || "",
    avatar: null,
  });

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);

    setFormData((prev) => ({
      ...prev,
      avatar: file,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const hasAvatarChange = !!formData.avatar;

      const hasProfileChanges =
        formData.username !== user.username ||
        formData.bio !== (user.bio || "");

      if (!hasAvatarChange && !hasProfileChanges) {
        toast.info("No changes detected");
        return;
      }

      // Upload avatar
      if (hasAvatarChange) {
        const avatarData = new FormData();

        avatarData.append(
          "avatar",
          formData.avatar
        );

        await updateAvatar(avatarData);
      }

      // Update profile
      if (hasProfileChanges) {
        await updateProfile({
          username: formData.username.trim(),
          bio: formData.bio.trim(),
        });
      }

      // Refresh zustand user
      await getMe();

      toast.success(
        "Profile updated successfully"
      );

      setOpen(false);

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button variant="primary">
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-lg"
        aria-describedby="edit-profile-description"
      >
        <DialogHeader>
          <DialogTitle>
            Edit Profile Dupliate
          </DialogTitle>
        </DialogHeader>

        <p
          id="edit-profile-description"
          className="sr-only"
        >
          Edit your profile information.
        </p>

        <div className="space-y-6">
          {/* Avatar */}

          <div className="flex flex-col items-center gap-4">
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer"
            >
              <div className="relative">
                <Image
                  src={preview}
                  alt="profile avatar"
                  width={110}
                  height={110}
                  unoptimized
                  className="rounded-full border object-cover"
                />

                <div className="absolute bottom-0 right-0 rounded-full border bg-background p-2 shadow">
                  <Camera className="h-4 w-4" />
                </div>
              </div>
            </label>

            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <p className="text-xs text-muted-foreground">
              Click avatar to upload a new image
            </p>
          </div>

          <Separator />

          {/* Username */}

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Username
            </Label>

            <Input
              value={formData.username}
              maxLength={20}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />

            <p className="text-xs text-muted-foreground">
              Username can only be changed
              once every 14 days.
            </p>
          </div>

          {/* Bio */}

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Bio
            </Label>

            <Textarea
              rows={4}
              maxLength={160}
              placeholder="Tell people about yourself..."
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
            />

            <div className="text-right text-xs text-muted-foreground">
              {formData.bio.length}/160
            </div>
          </div>

          {/* Actions */}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
