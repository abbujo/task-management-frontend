export const fetchGitHubUser = async (token: string) => {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch GitHub user");
    }
  
    return response.json();
  };
  