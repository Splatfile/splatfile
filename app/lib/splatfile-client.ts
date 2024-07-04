import { CanvasInfoObject, UserInfoObject } from "@/app/lib/schemas/profile";
import {
  GameInfoObject,
  WeaponGearInfo,
} from "@/app/lib/schemas/profile/game-info";
import { Database } from "@/app/lib/supabase";
import {
  ProfileInsert,
  ProfileLocale,
  ProfileUpdate,
} from "@/app/lib/types/supabase-alias";
import lang from "@/app/plate/lang.json";
import { TagState } from "@/app/plate/lib/store/use-tag-store";
import {
  createClientComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { notFound } from "next/navigation";
import { z } from "zod";

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

const initGameInfo: z.infer<typeof GameInfoObject> = {
  level: 0,
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

const initUserInfo: z.infer<typeof UserInfoObject> = {
  twitterInfo: {
    name: "",
    id: "",
  },
  switchInfo: {
    name: "",
    inGameName: "",
    friendCode: "",
  },
};

export const ROUTER = "ROUTER" as const;
export const SERVER_COMPONENT = "SERVER_COMPONENT" as const;
export const CLIENT_COMPONENT = "CLIENT_COMPONENT" as const;
export type ContextType =
  | typeof SERVER_COMPONENT
  | typeof CLIENT_COMPONENT
  | typeof ROUTER;

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

type DummySupabaseClient = SupabaseClient<Database>;

const createDummyClient = (): DummySupabaseClient => {
  return {} as DummySupabaseClient;
};

const createSupabaseClient = (context: ContextType) => {
  switch (context) {
    case CLIENT_COMPONENT:
      return createClientComponentClient<Database>({
        supabaseUrl,
        supabaseKey,
      });
    case ROUTER:
    case SERVER_COMPONENT:
      return createDummyClient();
  }
  throw new Error("Invalid contextType");
};

export class SplatfileClient {
  protected _supabase: SupabaseClient<Database>;

  constructor(contextType: ContextType) {
    this._supabase = createSupabaseClient(contextType);
  }

  get supabase() {
    return this._supabase;
  }

  getUserWithRetry = async () => {
    let user = await this._supabase.auth.getUser();
    if (!user.data.user?.id) {
      for (let i = 0; i < 5; i++) {
        await sleep(3000);
        user = await this._supabase.auth.getUser();
      }
    }
    return user;
  };

  createOrGetMyProfile = async (): Promise<ProfileLocale> => {
    const user = await this.getUserWithRetry();
    if (!user.data.user?.id) {
      notFound();
    }
    const { data, error } = await this._supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.data.user?.id)
      .maybeSingle();

    if (!data) {
      const game_info = { ...initGameInfo };
      const user_info = { ...initUserInfo };
      const plate_info = { ...initTagState };
      const canvas_info: z.infer<typeof CanvasInfoObject> = {};
      const weapon_gear_infos: WeaponGearInfo[] = [];

      const userInfo = user.data.user;
      const name = userInfo.user_metadata?.name;

      user_info.twitterInfo = {
        name: name || "",
        id: userInfo.user_metadata?.user_name || "",
      };
      plate_info.name = name || "Player";

      const insert: ProfileInsert = {
        user_id: user.data.user?.id,
        canvas_info,
        game_info,
        user_info,
        plate_info,
        weapon_gear_infos,
      };

      const { data, error } = await this._supabase
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

  getProfile = async (userId: string) => {
    const data = await this.getProfileWithoutNotFound(userId);

    if (!data) {
      notFound();
    }

    return data;
  };

  getProfileWithoutNotFound = async (userId: string) => {
    const { data, error } = await this._supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!data || error) {
      console.error("Profile not found", userId, data, error);
      return null;
    }

    return data;
  };

  updateProfile = async (profile: ProfileUpdate, userId: string) => {
    const user = await this._supabase.auth.getUser();

    if (user.data.user?.id !== userId) {
      console.error("Invalid user id", profile.user_id, user.data.user?.id);
      throw new Error(
        "Invalid user id " + profile.user_id + " " + user.data.user?.id,
      );
    }

    const parsed = CanvasInfoObject.safeParse(profile.canvas_info);
    if (!parsed.success) {
      throw parsed.error;
    }

    const { data: exist, error: existError } = await this._supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.data.user?.id)
      .single();

    if (existError) {
      throw existError;
    }

    console.log(
      "exist",
      exist.updated_at,
      "profile",
      profile.updated_at,
      exist.updated_at > (profile.updated_at ?? ""),
    );

    const existUpdatedAt = new Date(exist.updated_at).getTime();
    const profileUpdatedAt = new Date(profile.updated_at ?? "").getTime();
    const gap = existUpdatedAt - profileUpdatedAt;

    if (gap < -60000) {
      throw new Error("Profile is outdated");
    }

    const { data, error } = await this._supabase
      .from("profiles")
      .update(profile)
      .eq("user_id", user.data.user?.id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  uploadFile = async (file: Buffer | Blob, filename: string) => {
    const user = await this._supabase.auth.getUser();

    if (user.data.user?.id === undefined) {
      throw new Error("User not logged in");
    }

    if (file instanceof Buffer) {
      file = new Blob([file]);
    }

    const formData = new FormData();
    formData.append("file", file, filename);
    formData.append("userid", user.data.user.id);

    const resp = await fetch("/api/upload/", {
      method: "POST",
      body: formData,
    });

    if (!resp.ok) {
      throw new Error("Failed to upload file");
    }

    const { key } = await resp.json();
    return key as string;
  };
}
