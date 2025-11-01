import { useEffect, useState, useRef } from "react";
import ChatBox from "./chat/index";

// import { useMultistepForm } from "../useMultistepForm";
import Review from "./form/Review";
import Details from "./form/Details";
import Participants from "./form/Participants";
import { MantineProvider, Stepper } from "@mantine/core";
import { TbClipboardText, TbUsersGroup, TbCheckupList } from "react-icons/tb";
import { useGetIdentity, useLogout } from "@refinedev/core";
import supabaseClient from "../config/supabaseClient";

export const StudentDashboard = () => {
    // --- User Fetching ---
    const [loggedInUser, setLoggedInUser] = useState("");
    const { data: userData, isLoading } = useGetIdentity();
    const { mutate: logout, isPending } = useLogout();

    useEffect(() => {
        if (!isLoading && userData) {
            setLoggedInUser(userData?.user?.user_metadata?.full_name ?? "Unnamed user...");
        }
    }, [userData, isLoading]);

  console.log("Rendered with:", loggedInUser);

  // Stepper
    // --- Stepper State ---
    const [active, setActive] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const detailsFormRef = useRef<any>(null);
    const participantsFormRef = useRef<any>(null);
    const [detailsData, setDetailsData] = useState<any>(null);
    const [participantsData, setParticipantsData] = useState<any>(null);

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const userId = userData?.user?.id;
            if (!userId) throw new Error("You are not logged in.");

            if (!detailsData || !participantsData)
                throw new Error("Form data is missing. Please restart the form.");

            // Call the SQL function directly

            console.log(detailsData)
            console.log(participantsData)

            const { data, error } = await supabaseClient.rpc("create_room_reservation", {
                p_user_id: userId,
                p_purpose: detailsData.purpose || "Reservation Test",
                p_room_id: parseInt(detailsData.room_id),
                p_dates: Array.isArray(detailsData.date)
                    ? detailsData.date
                    : [detailsData.date],
                p_start_time: detailsData.startTime,
                p_end_time: detailsData.endTime,
                p_equipments: participantsData.equipment || null,
                p_advisor: detailsData.advisor || null,
                p_participants: participantsData.participants || null,
                p_remarks: detailsData.remarks || "Reservation Test",
            });

            if (error) throw error;

            console.log("Reservation created:", data);
            alert("Reservation submitted successfully!");

            // Reset state after successful submit
            setActive(0);
            setDetailsData(null);
            setParticipantsData(null);
        } catch (error: any) {
            console.error("Error creating reservation:", error);
            alert("Error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleNextStep = () => {
        let isValid = true;

        if (active === 0) {
            isValid =
                detailsFormRef.current?.validateAndProceed?.() ?? false;
            if (isValid) setDetailsData(detailsFormRef.current.getFormData());
        } else if (active === 1) {
            isValid =
                participantsFormRef.current?.validateAndProceed?.() ?? false;
            if (isValid)
                setParticipantsData(participantsFormRef.current.getFormData());
        } else if (active === 2) {
            handleSubmit();
            return;
        }

        if (isValid) setActive((current) => (current < 3 ? current + 1 : current));
    };

    const prevStep = () => setActive((current) => Math.max(0, current - 1));
  return (
    <>
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
                {active === 0 && <Details ref={detailsFormRef}/>}
                </Stepper.Step>
                <Stepper.Step
                  label="Participants"
                  icon={<TbUsersGroup size={24} />}
                >
                  <Participants ref={participantsFormRef}/>
                </Stepper.Step>
                <Stepper.Step label="Review" icon={<TbCheckupList size={24} />}>
                  {detailsData && participantsData ? (
                    <Review
                      detailsData={detailsData}
                      participantsData={participantsData}
                      onEditStep={(stepIndex) => setActive(stepIndex)}
                    />
                  ) : (
                    <p className="text-center text-gray-600">Loading review data...</p>
                  )}
                </Stepper.Step>


              </Stepper>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className={`py-2 px-12 text-[var(--primary)] border border-[var(--primary)] rounded-sm cursor-pointer duration-200 hover:bg-[var(--primary)] hover:text-white ${
                  active === 0 ? "invisible" : "visible"
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                className="py-2 px-12 bg-[var(--primary)] text-[var(--primary-white)] rounded-sm cursor-pointer hover:bg-[var(--primary-hover)] duration-200 disabled:opacity-50">
                  {isSubmitting ? "Submitting..." : (active === 2 ? "Submit" : "Next")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </MantineProvider>

      {/* <input type="date" name="" id="" min={minDate} max={maxDate}/> */}
      <ChatBox />
    </>
  );
};
