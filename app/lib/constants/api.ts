import { z } from "zod";

export const getRecentUpdatedUsers = () => {
  return "/api/users/recent";
};

export const RecentUserObject = z.object({
  userId: z.string(),
  name: z.string(),
  lastUpdated: z.string(),
});
