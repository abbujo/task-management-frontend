export const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
export const GITHUB_REDIRECT_URI = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;

export const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user`;
