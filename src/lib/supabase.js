import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "supabase url";
const supabaseAnonKey = "cle";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);