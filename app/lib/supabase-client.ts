import { UserInfoObject } from "@/app/lib/schemas/profile";
import {
  GameInfoObject,
  WeaponGearInfo,
} from "@/app/lib/schemas/profile/game-info";
import {
  CaptureRequest,
  CaptureRequestInsert,
  CaptureRequestUpdate,
  Profile,
  ProfileInsert,
  ProfileUpdate,
} from "@/app/lib/types/supabase-alias";
import { PlateInfoObject, TagState } from "@/app/plate/lib/store/use-tag-store";
import {
  createClientComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { notFound } from "next/navigation";
import { z } from "zod";
import lang from "@/app/plate/lang.json";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const initTitle = {
  title: {
    first: 0,
    last: 0,
    string: "100% .52 갤런 유저",
  },
};

const initTagState: TagState = {
  name: "Player",
  title: { ...initTitle.title },
  banner: "Npl_Tutorial00.png",
  layers: 0,
  id: lang["KRko"].sign + "0001",
  badges: ["", "", ""],
  color: "#ffffff",
  bgColours: ["#bbbbbb", "#999999", "#555555", "#222222"],
  isGradient: false,
  isCustom: false,
  gradientDirection: "to bottom",
};

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
    const game_info: z.infer<typeof GameInfoObject> = {
      salmonRunMapPoints: {
        Shakedent: 40,
        Shakehighway: 40,
        Shakelift: 40,
        Shakeship: 40,
        Shakespiral: 40,
        Shakeup: 40,
        Shakerail: 40,
      },
    };
    const user_info: z.infer<typeof UserInfoObject> = {
      twitterInfo: {
        name: "",
        id: "",
      },
    };

    const plate_info: z.infer<typeof PlateInfoObject> = {
      ...initTagState,
    };

    console.log("plate_info:", plate_info);

    const weapon_gear_infos: WeaponGearInfo[] = [];

    const userInfo = user.data.user;
    console.log("userMetadata:", userInfo.user_metadata);

    const name = userInfo.user_metadata?.name;

    user_info.twitterInfo = {
      name: name || "",
      id: userInfo.user_metadata?.user_name || "",
    };
    plate_info.name = name || "Player";

    const insert: ProfileInsert = {
      user_id: user.data.user?.id,
      game_info,
      user_info,
      plate_info,
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
    .eq("user_id", userId)
    .maybeSingle();

  if (!data || error) {
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

export const listCaptureRequest = async (
  supabase: SupabaseClient,
  userId: string,
  filter: {
    isCompleted?: boolean;
  } = {},
  pagination: {
    limit: number;
    offset: number;
  } = {
    limit: 10,
    offset: 0,
  },
) => {
  let query = supabase
    .from("capture_requests")
    .select("*")
    .eq("user_id", userId);

  if (filter.isCompleted !== undefined) {
    query = query.filter(
      "completed_at",
      filter.isCompleted ? "not.is" : "is",
      null,
    );
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(pagination.offset, pagination.offset + pagination.limit - 1)
    .returns<CaptureRequest[]>();

  if (error) {
    throw error;
  }

  return data;
};

export const createCaptureRequest = async (
  supabase: SupabaseClient,
  userId: string,
) => {
  const insert: CaptureRequestInsert = { user_id: userId };

  const { data, error } = await supabase
    .from("capture_requests")
    .insert([insert])
    .select("*")
    .single<CaptureRequest>();

  if (error) {
    throw error;
  }

  return data;
};

export const updateCaptureRequest = async (
  supabase: SupabaseClient,
  captureRequestId: number,
  captureRequest: CaptureRequestUpdate,
) => {
  const { data, error } = await supabase
    .from("capture_requests")
    .update(captureRequest)
    .eq("id", captureRequestId)
    .single<CaptureRequest>();

  if (error) {
    throw error;
  }

  return data;
};
