"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react"; // ✅ Import Back Icon
import Image from "next/image";

export default function ProfileHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{
    avatar_url: string;
    name: string;
    login: string;
  } | null>(null);
  const [loading, setLoading] = useState(true); // ✅ Loading State

  useEffect(() => {
    const storedUser = localStorage.getItem("github_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // ✅ Ensure re-render happens after profile is loaded
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("github_token");
    localStorage.removeItem("github_user");
    router.push("/login");
  };

  // ✅ Ensure Profile is Always Rendered (Except Login Page)
  if (loading || pathname === "/login") return null;

  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto p-4">
      {/* ✅ Profile Info */}
      <div className="flex items-center gap-4">
        {user?.avatar_url && (
          <Image
            src={user.avatar_url}
            alt="Profile"
            className="rounded-full w-12 h-12"
          />
        )}
        <div>
          <h2 className="text-lg font-semibold">{user?.name || user?.login}</h2>
          <p className="text-sm text-gray-500">@{user?.login}</p>
        </div>
      </div>

      {/* ✅ Back & Logout Buttons */}
      <div className="flex gap-3">
        {pathname !== "/dashboard" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        )}
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
