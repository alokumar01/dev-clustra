"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  const [preview, setPreview] = useState(user?.avatar || "");

  const [formData, setFormData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
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
        formData.username.trim() !== user?.username ||
        formData.bio.trim() !== (user?.bio || "");

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
        <Button className="w-full rounded-xl sm:w-auto cursor-pointer">
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-0 sm:max-w-xl"
      >
        <DialogHeader className="border-b border-border px-5 py-4 sm:px-6">
          <DialogTitle className="text-lg">
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update the details teammates see across DevClustra.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-5 py-5 sm:px-6">
          {/* Avatar */}

          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-secondary/35 p-5 sm:flex-row">
            <label
              htmlFor="avatar-upload"
              className="shrink-0 cursor-pointer"
            >
              <div className="relative">
                {preview ? (
                  <Image
                    src={preview}
                    alt="profile avatar"
                    width={104}
                    height={104}
                    unoptimized
                    className="aspect-square rounded-full border object-cover"
                  />
                ) : (
                  <div className="flex size-[104px] items-center justify-center rounded-full border bg-muted text-3xl font-semibold text-muted-foreground">
                    {formData.username?.[0]?.toUpperCase() || "U"}
                  </div>
                )}

                <div className="absolute bottom-0 right-0 rounded-full border bg-background p-2 shadow-sm">
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

            <div className="text-center sm:text-left">
              <p className="text-sm font-medium">Profile photo</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Choose a clear square image so your avatar stays sharp in chat.
              </p>
            </div>
          </div>

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

        </div>

        <DialogFooter className="rounded-b-xl">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
