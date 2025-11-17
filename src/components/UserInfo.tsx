import { useEffect, useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import supabase from "../config/supabaseClient";

import { IoPersonCircleOutline } from "react-icons/io5";

export const UserInfo = () => {
  const [type, setType] = useState("");
  const [avatar, setAvatar] = useState("");
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
          .select("type, avatar_url")
          .eq("id", userId)
          .single();
        if (error) console.error("An error occurred:", error.message);
        setType(userData?.type);
        setAvatar(userData?.avatar_url);
      }
    }

    fetchUser();
  }, [data, isLoading]);
  return (
    <>
      <div className="bg-[var(--accent)] text-[var(--primary-white)] p-3 md:flex items-center gap-4 rounded drop-shadow-xl hidden">
        <div>
          {avatar ? (
            <img
              src={avatar}
              alt="Profile"
              className="w-[2.5rem] h-auto rounded-full border border-black"
            />
          ) : (
            <IoPersonCircleOutline size={"2.5rem"} />
          )}
        </div>
        <div className="flex flex-col items-end leading-none gap-1">
          <div className="font-bold">{loggedInUser.toUpperCase()}</div>
          <div className="font">
            {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
          </div>
        </div>
      </div>
    </>
  );
};
