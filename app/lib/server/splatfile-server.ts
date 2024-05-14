import {
  createRouteHandlerClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { ContextType, SplatfileClient } from "@/app/lib/splatfile-client";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  ProfileUpdate,
} from "@/app/lib/types/supabase-alias";
import { createClient } from "@supabase/supabase-js";
import { v1 as uuidVer1 } from "uuid";

const createSupabaseServerClient = (contextType: ContextType) => {
  switch (contextType) {
    case "SERVER_COMPONENT":
      return createServerComponentClient({ cookies });
    case "ROUTER":
      return createRouteHandlerClient({ cookies });
  }
  throw new Error("Invalid contextType: " + contextType);
};
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const createSupabaseServiceClient = (contextType: ContextType) => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      `Supabase Url or Supabase Service Key is not defined, url: ${supabaseUrl}, key: ${supabaseServiceKey}`,
    );
  }
  switch (contextType) {
    case "SERVER_COMPONENT":
    case "ROUTER":
      return createClient(supabaseUrl, supabaseServiceKey);
  }
  throw new Error("Invalid contextType: " + contextType);
};

export class SplatfileServer extends SplatfileClient {
  _r2Client: S3Client | undefined;
  get r2Client() {
    let r2Client = this._r2Client;
    if (!r2Client) {
      this._r2Client = createR2Client();
      r2Client = this._r2Client;
      if (!r2Client) {
        throw new Error("R2 client is not initialized");
      }
    }
    return r2Client;
  }

  constructor(contextType: ContextType) {
    super(contextType);
    this._supabase = createSupabaseServerClient(contextType);
  }

  uploadFile = async (file: Buffer, filename: string) => {
    const CLOUDFLARE_R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET;
    const CLOUDFLARE_R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL;
    if (!CLOUDFLARE_R2_BUCKET || !CLOUDFLARE_R2_PUBLIC_URL) {
      throw new Error(
        `CLOUDFLARE_R2_BUCKET, CLOUDFLARE_R2_PUBLIC_URL must be defined`,
      );
    }

    const key = `${uuidVer1()}-${encodeURIComponent(filename)}`;

    const command = new PutObjectCommand({
      Bucket: CLOUDFLARE_R2_BUCKET,
      Key: key,
      Body: file,
    });

    await this.r2Client.send(command);

    return `${CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
  };
}

type R2Client = S3Client;

const createR2Client = () => {
  const CLOUDFLARE_R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const CLOUDFLARE_R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const CLOUDFLARE_R2_SECRET_ACCESS_KEY =
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (
    !CLOUDFLARE_R2_ACCOUNT_ID ||
    !CLOUDFLARE_R2_ACCESS_KEY_ID ||
    !CLOUDFLARE_R2_SECRET_ACCESS_KEY
  ) {
    throw new Error(
      `CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY must be defined`,
    );
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  }) as R2Client;
};

export class SplatfileAdmin extends SplatfileServer {
  constructor(contextType: ContextType) {
    super(contextType);
    this._supabase = createSupabaseServiceClient(contextType);
  }

  getRecentUpdatedUsers = async () => {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return data;
  };

  searchProfiles = async (query: string) => {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .or(
        `user_info->switchInfo->>name.ilike.%${query}%,user_info->switchInfo->>inGameName.ilike.%${query}%,user_info->twitterInfo->>id.ilike.%${query}%,user_info->twitterInfo->>name.ilike.%${query}%,plate_info->>name.ilike.%${query}%,user_info->switchInfo->>friendCode.ilike.${query}`,
      )
      .limit(20);

    if (error) {
      console.error(error);
      return;
    }

    return data;
  };

  updateProfileByAdmin = async (profile: ProfileUpdate, userId: string) => {
    const { data, error } = await this._supabase
      .from("profiles")
      .update(profile)
      .eq("user_id", userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  };
}
