export const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.splatfile.ink";

export const signinUrl = "/users/signin";

export const profileUrl = (userId: string) => `/users/${userId}/profile`;
