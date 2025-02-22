import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.json({ error: "Failed to get access token" }, { status: 500 });
  }

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return NextResponse.json({ error: tokenData.error_description }, { status: 400 });
  }

  return NextResponse.json({ access_token: tokenData.access_token });
}
