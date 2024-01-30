import {
  createRouteHandlerClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ContextType } from "@/app/lib/supabase-client";

export const createSupabaseServerComponentClent = () => {
  return createServerComponentClient({ cookies });
};

export const createSupabaseRouterClient = () => {
  return createRouteHandlerClient({ cookies });
};

export const createSupabaseServerClient = (contextType: ContextType) => {
  switch (contextType) {
    case "SERVER_COMPONENT":
      return createSupabaseServerComponentClent();
    case "ROUTER":
      return createSupabaseRouterClient();
  }
  throw new Error("Invalid contextType");
};
