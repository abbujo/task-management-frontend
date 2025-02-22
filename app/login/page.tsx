"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GITHUB_AUTH_URL } from "@/lib/githubAuth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (token) {
      router.push("/dashboard");
      return;
    }

    // Get OAuth `code` from URL
    const code = searchParams.get("code");
    if (code) {
      setLoading(true);
      fetch(`/api/githubAuth?code=${code}`)
        .then((res) => res.json())
        .then(async (data) => {
          console.log("GitHub Token Response:", data); // Debugging

          if (data.access_token) {
            localStorage.setItem("github_token", data.access_token);

            // Fetch GitHub user info and store in localStorage
            try {
              const userRes = await fetch("https://api.github.com/user", {
                headers: { Authorization: `Bearer ${data.access_token}` },
              });

              const userData = await userRes.json();
              localStorage.setItem("github_user", JSON.stringify(userData));

              router.push("/dashboard"); // Redirect to dashboard after login
            } catch (err) {
              console.error("Error fetching user info:", err);
              alert("GitHub login failed. Please try again.");
              router.push("/login");
            }
          } else {
            console.error("GitHub login failed:", data.error);
            alert("GitHub login failed. Please try again.");
            router.push("/login");
          }
        })
        .catch((error) => {
          console.error("Error during GitHub authentication:", error);
          alert("Login failed. Please try again.");
          router.push("/login");
        })
        .finally(() => setLoading(false));
    }
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Task Manager</h1>
      <p className="text-gray-600 mb-6">
        Log in with GitHub to access your projects and tasks.
      </p>

      {loading ? (
        <p className="text-blue-500">Authenticating...</p>
      ) : (
        <Button asChild>
          <a href={GITHUB_AUTH_URL}>Login with GitHub</a>
        </Button>
      )}
    </div>
  );
}
