import { supabase } from "@/integrations/supabase/client";
import { API_BASE_URL } from "@/services/serviceUtils";

interface ApiErrorBody {
  message?: string;
}

/** Shared authenticated transport for the FastAPI API. */
export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  const token = data.session?.access_token;
  if (!token) throw new Error("Please sign in to continue.");

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error("The AgriPulse API is unavailable. Please try again.");
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new Error(body?.message ?? "The request could not be completed.");
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
