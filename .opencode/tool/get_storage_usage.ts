import { tool } from "@opencode-ai/plugin"

export default tool({
  name: "get_storage_usage",
  description: "Get storage quota and usage statistics for the project. Returns total_bytes, file_count, and quota_bytes. Use this to check how much storage space is available.",
  parameters: {},
  execute: async () => {
    const response = await fetch("https://launchpulse.ai/api/storage/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: "you-are-an-expert-game-dev",
        token: "lp_youarean_adf4cde4da9e4079",
        path: "usage",
        params: {}
      })
    });
    const result = await response.json();
    return JSON.stringify(result, null, 2);
  }
});

