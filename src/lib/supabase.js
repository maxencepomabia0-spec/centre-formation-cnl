import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aiwayiqtxbqwprfenyuu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpd2F5aXF0eGJxd3ByZmVueXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4NzI2NjQsImV4cCI6MjEwMTQ0ODY2NH0.HuCxvi9Q6aQgXLbLpMK-T8V3QN6u75RfSsEjMUz1R1E";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);