import type { AuthProvider } from "@refinedev/core";
import supabaseClient from "../config/supabaseClient";

export const authProvider: AuthProvider = {
  check: async () => {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    if (!session) return { authenticated: false, redirectTo: "/login" };

    return { authenticated: true, redirectTo: "/" };
  },
  login: async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error)
      return {
        success: false,
        error,
      };

    return { success: true, redirectTo: "/" };
  },
  logout: async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error)
      return {
        success: false,
        error,
      };

    return { success: true, redirectTo: "/login" };
  },
  getIdentity: async () => {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error) console.error("Error getting user:", error.message);

    if (data?.user) {
      return data;
    }

    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
