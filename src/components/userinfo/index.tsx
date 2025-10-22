import { useEffect, useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import supabase from "../../config/supabaseClient";

import { IoPersonCircleOutline } from "react-icons/io5";

export const UserInfo = () => {
  const [type, setType] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");
  const { data, isLoading } = useGetIdentity();

  useEffect(() => {
    if (!isLoading && data) {
      setLoggedInUser(data?.user.user_metadata?.full_name ?? "Unnamed user...");
    }

    if (isLoading) return;

    if (!data.user?.id) {
      console.log("No user found, redirecting...");
      return;
    }

    async function fetchUser() {
      if (data) {
        const userId = data.user?.id ?? "";
        const { data: userData, error } = await supabase
          .from("user")
          .select("type")
          .eq("id", userId)
          .single();
        if (error) console.error("An error occurred:", error.message);
        setType(userData?.type);
      }
    }

    fetchUser();
  }, [data, isLoading]);
  return (
    <>
      <div className="bg-[var(--accent)] text-[var(--primary-white)] p-2 px-2 flex items-center gap-4 rounded drop-shadow-xl">
        <IoPersonCircleOutline size={"2.5rem"} />
        <div className="flex flex-col items-end leading-none gap-1">
          <div className="font-black">{loggedInUser.toUpperCase()}</div>
          <div className="font">
            {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
          </div>
        </div>
      </div>
    </>
  );
};
