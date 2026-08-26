import { supabase } from "@/integrations/supabase/client";
import { apiRequest } from "@/services/apiClient";
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

export async function fetchProfile(): Promise<Profile | null> {
  try {
    return await apiRequest<Profile>("/api/profiles/me");
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") return null;
    throw error;
  }
}

export async function fetchRoles(userId: string): Promise<UserRole[]> {
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.role as UserRole);
}

export async function updateProfile(patch: Partial<Profile>): Promise<Profile> {
  return apiRequest<Profile>("/api/profiles/me", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}
