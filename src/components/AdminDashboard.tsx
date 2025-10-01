import React, { useEffect } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router";

export const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        // Clear local and session storage
        [window.localStorage, window.sessionStorage].forEach((storage) => {
          Object.entries(storage).forEach(([key]) => {
            storage.removeItem(key);
          });
        });
        navigate("/");
      }
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) console.error("Error:", error.message);
  };
  return (
    <>
      <div>AdminDashboard</div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        onClick={handleLogOut}
      >
        Click me
      </button>
    </>
  );
};
