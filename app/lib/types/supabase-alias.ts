import { Database } from "@/app/lib/supabase";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type InsertProfile = Database["public"]["Tables"]["profiles"]["Insert"];
