import {
  createClientComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { notFound } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const ROUTER = "ROUTER" as const;
export const SERVER_COMPONENT = "SERVER_COMPONENT" as const;
export const CLIENT_COMPONENT = "CLIENT_COMPONENT" as const;
export type ContextType =
  | typeof SERVER_COMPONENT
  | typeof CLIENT_COMPONENT
  | typeof ROUTER;

export const createSupabaseClient = (context: ContextType) => {
  switch (context) {
    case CLIENT_COMPONENT:
      return createClientComponentClient({
        supabaseUrl,
        supabaseKey,
      });
  }
  throw new Error("Invalid contextType");
};

export const getUserProfile = async (supabase: SupabaseClient) => {
  // const { user } = await supabase.from("");
  // return user;
};

export const createOrGetMyProfile = async (supabase: SupabaseClient) => {
  const user = await supabase.auth.getUser();
  console.log("userId", user.data.user?.id);

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.data.user?.id)
    .maybeSingle();

  if (!data) {
    const { data, error } = await supabase.from("profiles").insert([
      {
        user_id: user.data.user?.id,
        name: user.data.user?.email,
        twitter_name: "",
        twitter_id: "",
        switch_name: "",
        switch_in_game_name: "",
        switch_friend_code: "",
        switch_friend_link: "",
        x_match_info: {},
        rule_favorite_info: {},
        play_style: "Newbie",
        weapon_gear_info: {},
      },
    ]);
    return data;
  }

  return data;
};

export const getProfile = async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  return data;
};
