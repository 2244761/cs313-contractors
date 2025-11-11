import { useEffect } from "react";
import supabase from "../config/supabaseClient";
import { useLogout } from "@refinedev/core";

export const Suspended = () => {
  const { mutate: logout } = useLogout();

  useEffect(() => {
    const timer = setTimeout(async () => {
      await supabase.auth.signOut();
      // Clear Refine session
      logout();
    }, 5000);

    return () => clearTimeout(timer);
  }, [logout]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 p-8">
      <h1 className="text-3xl font-bold text-red-600">Account Suspended</h1>
      <p className="text-lg text-gray-700">
        Your account has been suspended. You will be logged out shortly.
      </p>
    </div>
  );
};
