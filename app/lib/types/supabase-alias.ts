import { Database } from "@/app/lib/supabase";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type CaptureRequest =
  Database["public"]["Tables"]["capture_requests"]["Row"];

export type CaptureRequestInsert =
  Database["public"]["Tables"]["capture_requests"]["Insert"];

export type CaptureRequestUpdate =
  Database["public"]["Tables"]["capture_requests"]["Update"];
