import type { Metadata } from "next";
import { ProfileView } from "@/features/profile/ProfileView/ProfileView";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return <ProfileView />;
}
