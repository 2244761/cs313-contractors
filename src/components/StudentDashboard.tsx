import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router";
// import { useMultistepForm } from "../useMultistepForm";
import Details from "./form/Details";
import Participants from "./form/Participants";
import { MantineProvider, Stepper } from "@mantine/core";
import { TbClipboardText, TbUsersGroup, TbCheckupList } from "react-icons/tb";

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

  // Stepper
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  return (
    <>
      {/* Targets the Separator of the Stepper Class */}
      <MantineProvider
        theme={{
          components: {
            Stepper: {
              styles: {
                separator: {
                  backgroundColor: "var(--ui-border)",
                },
              },
            },
            // Select: {
            //   styles: {
            //     input: {
            //       padding: "1.25rem 1rem",
            //     },
            //   },
            // },
            // TimePicker: {
            //   styles: {
            //     input: {
            //       padding: "0.6rem 1rem",
            //       height: "auto",
            //     },
            //   },
            // },
            // DatePickerInput: {
            //   styles: {
            //     input: {
            //       padding: "1.25rem initial",
            //     },
            //   },
            // },
          },
        }}
      >
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
            <div className="bg-[#EFEFEF] p-10 rounded-[8px] flex flex-col gap-6 sm:gap-8 w-full max-w-xl">
              <Stepper
                active={active}
                onStepClick={setActive}
                allowNextStepsSelect={false}
                color="var(--primary)"
                styles={{
                  stepIcon: {
                    className: "bg-blue-200 border-blue-200 text-white",
                  },
                  separator: { className: "bg-blue-200" },
                }}
              >
                <Stepper.Step
                  label="Details"
                  icon={<TbClipboardText size={24} />}
                >
                  <Details />
                </Stepper.Step>
                <Stepper.Step
                  label="Participants"
                  icon={<TbUsersGroup size={24} />}
                >
                  <Participants />
                </Stepper.Step>
                <Stepper.Step label="Review" icon={<TbCheckupList size={24} />}>
                  <h1>Review</h1>
                </Stepper.Step>
              </Stepper>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="py-2 px-12 text-[var(--primary)] border border-[var(--primary)] rounded-sm cursor-pointer duration-200 hover:bg-[var(--primary)] hover:text-white"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="py-2 px-12 bg-[var(--primary)] text-[var(--primary-white)] rounded-sm cursor-pointer hover:bg-[var(--primary-hover)] duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </MantineProvider>

      {/* <input type="date" name="" id="" min={minDate} max={maxDate}/> */}
    </>
  );
};
