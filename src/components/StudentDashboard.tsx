import { useEffect, useState, useRef } from "react";
// import { useMultistepForm } from "../useMultistepForm";
import Details from "./form/Details";
import Participants from "./form/Participants";
import { MantineProvider, Stepper } from "@mantine/core";
import { TbClipboardText, TbUsersGroup, TbCheckupList } from "react-icons/tb";
import { useGetIdentity, useLogout } from "@refinedev/core";

export const StudentDashboard = () => {
  // Fetch User
  const [loggedInUser, setLoggedInUser] = useState("");
  const { data, isLoading } = useGetIdentity();

  useEffect(() => {
    if (!isLoading && data) {
      setLoggedInUser(data?.user.user_metadata?.full_name ?? "Unnamed user...");
    }
  }, [data, isLoading]);

  console.log("Rendered with:", loggedInUser);

  const { mutate: logout, isPending } = useLogout();

  // Stepper
  const [active, setActive] = useState(0);
  const detailsFormRef = useRef<any>(null); 
  const participantsFormRef = useRef<any>(null); 
  const handleNextStep = () => { // Handles the next button, calls validation in child page 
    let isValid = true; 
    if (active === 0) {
      isValid = detailsFormRef.current && detailsFormRef.current.validateAndProceed();
    } else if (active === 1) {
      isValid = participantsFormRef.current && participantsFormRef.current.validateAndProceed();
    } 
  
    if (isValid) {
      setActive((current) => (current < 3 ? current + 1 : current));
    }
  };
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
            {loggedInUser}
            <button
              disabled={isPending}
              className="relative text-red-400 cursor-pointer before:content-[''] before:absolute before:bottom-[-2px] before:bg-red-400 before:h-[2px] before:w-0 hover:before:w-full before:transition-all duration-500"
              onClick={() => logout()}
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
                  <Details ref={detailsFormRef}/>
                </Stepper.Step>
                <Stepper.Step
                  label="Participants"
                  icon={<TbUsersGroup size={24} />}
                >
                  <Participants ref={participantsFormRef}/>
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
                  onClick={handleNextStep}
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
