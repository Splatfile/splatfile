import { ApifyClient } from "apify";

export const createApifyClient = () => {
  const token = process.env.APIFY_API_KEY;

  if (!token) {
    throw new Error("APIFY_API_KEY is not defined");
  }

  return new ApifyClient({
    token: token,
  });
};

export const requestCapturingProfile = async (
  client: ApifyClient,
  userId: string,
) => {
  const capture_actor_id = process.env.APIFY_CAPTURING_ACTOR_ID;

  if (!capture_actor_id) {
    throw new Error("CAPTURE_ACTOR_ID is not defined");
  }

  return await client.actor(capture_actor_id).call({
    url: `https://example.com/users/${userId}/profile`,
  });
};
