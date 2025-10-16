import { useGetIdentity } from "@refinedev/core";
import supabase from "./config/supabaseClient";
import { Navigate } from "react-router";
import { useEffect, useState } from "react";

const RoleRedirect = () => {
  const { data, isLoading } = useGetIdentity();
  const [role, setRole] = useState("");

  useEffect(() => {
    if (isLoading) return;

    if (!data.user?.id) {
      console.log("No user found, redirecting...");
      return;
    }

    async function fetchUser() {
      if (data) {
        const userId = data.user?.id ?? "";
        const { data: userData, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", userId)
          .single();
        if (error) console.error("An error occurred:", error.message);
        setRole(userData?.role);
      }
    }

    fetchUser();
  }, [data, isLoading]);

  // if (isLoading) return <div>Loading...</div>;
  if (!data) return <Navigate to="/login" replace />;
  if (!role) return <div>Loading...</div>;

  // if (role === "student") {
  //   return <Navigate to="/student-dashboard" replace />;
  // } else if (role === "admin") {
  //   return <Navigate to="/admin-dashboard" replace />;
  // }

  // TEMPORARY
  if (role === "student") {
    return <Navigate to="/student-dashboard" replace />;
  } else if (role === "staff") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default RoleRedirect;
