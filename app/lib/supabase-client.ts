import {
  createClientComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { notFound } from "next/navigation";
import {
  Profile,
  ProfileInsert,
  ProfileUpdate,
} from "@/app/lib/types/supabase-alias";
import { GameInfo, UserInfo, WeaponGearInfo } from "@/app/lib/schemas/profile";

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

export const createOrGetMyProfile = async (
  supabase: SupabaseClient,
): Promise<Profile> => {
  const user = await supabase.auth.getUser();
  if (!user.data.user?.id) {
    notFound();
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.data.user?.id)
    .maybeSingle();

  if (!data) {
    const game_info: GameInfo = {};
    const user_info: UserInfo = {
      nickname: "",
    };

    const weapon_gear_infos: WeaponGearInfo[] = [];

    const insert: ProfileInsert = {
      user_id: user.data.user?.id,
      game_info,
      user_info,
      weapon_gear_infos,
    };

    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          ...insert,
        },
      ])
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
  if (error) {
    throw error;
  }

  return data;
};

export const getProfile = async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", "7973f2b0-ee0d-43ab-aeaf-a4d978e1609d")
    .maybeSingle();

  console.log("getProfile", data, error, userId);
  if (!data) {
    notFound();
  }

  return data;
};

export const updateProfile = async (
  supabase: SupabaseClient,
  profile: ProfileUpdate,
  userId: string,
) => {
  const user = await supabase.auth.getUser();

  if (user.data.user?.id !== userId) {
    console.error("Invalid user id", profile.user_id, user.data.user?.id);
    throw new Error(
      "Invalid user id " + profile.user_id + " " + user.data.user?.id,
    );
  }
  const { data, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("user_id", user.data.user?.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
