import {
  createClientComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createSupabaseClientComponentClient = () => {
  return createClientComponentClient({
    supabaseUrl,
    supabaseKey,
  });
};

export const getUserProfile = async (supabase: SupabaseClient) => {
  // const { user } = await supabase.from("");
  // return user;
};
