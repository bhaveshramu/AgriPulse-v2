import { supabase } from "@/integrations/supabase/client";
import type { LanguageCode, Profile, UserRole } from "@/types";

/**
 * Authentication abstraction.
 *
 * Part 1 uses email + password development authentication.
 * Later phases (Aadhaar OTP, DigiLocker, custom JWT issued by the FastAPI
 * backend) can implement this same interface without touching UI code.
 */
export interface RegistrationInput {
  fullName: string;
  mobileNumber: string;
  email: string;
  state: string;
  district: string;
  preferredLanguage: LanguageCode;
  password: string;
}

export interface AuthProvider {
  signIn(email: string, password: string): Promise<void>;
  signUp(input: RegistrationInput): Promise<{ needsEmailConfirmation: boolean }>;
  signOut(): Promise<void>;
}

export const developmentAuthProvider: AuthProvider = {
  async signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  },

  async signUp(input) {
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: input.fullName,
          mobile_number: input.mobileNumber,
          state: input.state,
          district: input.district,
          preferred_language: input.preferredLanguage,
        },
      },
    });
    if (error) throw new Error(error.message);
    return { needsEmailConfirmation: data.session === null };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },
};

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, mobile_number, email, state, district, village, preferred_language, farming_experience_years",
    )
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchRoles(userId: string): Promise<UserRole[]> {
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.role as UserRole);
}

export async function updateProfile(userId: string, patch: Partial<Profile>) {
  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) throw new Error(error.message);
}
