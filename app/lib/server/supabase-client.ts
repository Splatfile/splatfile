import {
  createRouteHandlerClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ContextType } from "@/app/lib/supabase-client";
import { createClient } from "@supabase/supabase-js";

export const createSupabaseServerClient = (contextType: ContextType) => {
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

export const createSupabaseServiceClient = (contextType: ContextType) => {
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
