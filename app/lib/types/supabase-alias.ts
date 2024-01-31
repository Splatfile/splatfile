import { Database } from "@/app/lib/supabase";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
