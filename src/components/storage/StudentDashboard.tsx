import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router";
import { useMultistepForm } from "../useMultistepForm";
import Details from "./form/Details";
import Extras from "./form/Extras";

export const StudentDashboard = () => {
  // Fetch User
  const [user, setUser] = useState("");

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user ? user.user_metadata?.full_name : "Loading user...");
  };
  getUser();

  const navigate = useNavigate();

  // Sign out - Trigger once user logs out
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

  // Handle sign out
  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) console.error("Error:", error.message);
  };

  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    setMinDate(formatDate(today));
    setMaxDate(formatDate(nextMonth));
  });

  // Form Steps
  const { isFirstStep, back, next, step, isLastStep } = useMultistepForm([
    <Details />,
    <div>Two</div>,
    <Extras />,
    <div>Four</div>,
  ]);
  return (
    <>
      <div className="bg-[#D1E2EB]">
        <nav className="p-6 flex justify-between absolute w-full">
          {user}
          <button
            className="relative text-red-400 cursor-pointer before:content-[''] before:absolute before:bottom-[-2px] before:bg-red-400 before:h-[2px] before:w-0 hover:before:w-full before:transition-all duration-500"
            onClick={handleLogOut}
          >
            Sign out
          </button>
        </nav>

        <div className="flex justify-center items-center w-full h-dvh">
          <div className="bg-[#EFEFEF] p-10 rounded-[8px] flex flex-col gap-6 sm:gap-8 w-full max-w-md">
            <div>
              {step}
              {!isFirstStep && (
                <button
                  onClick={back}
                  className="p-2 bg-blue-400 cursor-pointer"
                  type="button"
                >
                  Back
                </button>
              )}
              <button
                onClick={next}
                className="p-2 bg-blue-400 cursor-pointer"
                type="button"
              >
                {isLastStep ? "Submit" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <input type="date" name="" id="" min={minDate} max={maxDate}/> */}
    </>
  );
};
