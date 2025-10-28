import { useEffect, useState, useRef } from "react";
// import { useMultistepForm } from "../useMultistepForm";
import Details from "./form/Details";
import Participants from "./form/Participants";
import { MantineProvider, Stepper } from "@mantine/core";
import { TbClipboardText, TbUsersGroup, TbCheckupList } from "react-icons/tb";
import { useGetIdentity, useLogout } from "@refinedev/core";
import supabaseClient from "../config/supabaseClient";

export const StudentDashboard = () => {
  // Fetch User
  const [loggedInUser, setLoggedInUser] = useState("");
  const { data: userData, isLoading } = useGetIdentity();

  useEffect(() => {
    if (!isLoading && userData) {
      setLoggedInUser(userData?.user.user_metadata?.full_name ?? "Unnamed user...");
    }
  }, [userData, isLoading]);

  console.log("Rendered with:", loggedInUser);

  const { mutate: logout, isPending } = useLogout();

  // Stepper
  const [active, setActive] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const detailsFormRef = useRef<any>(null); 
  const participantsFormRef = useRef<any>(null); 
  const [detailsData, setDetailsData] = useState(null);
  const [participantsData, setParticipantsData] = useState(null);
  
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const userId = userData?.user.id;
    if (!userId) {
      alert("Error: You are not logged in.");
      setIsSubmitting(false);
      return;
    }
    
    if (!detailsData || !participantsData) {
        alert("Error: Form data is missing. Please restart the form.");
        setIsSubmitting(false);
        return;
    }

    let newReservationId: number | null = null;
    let newRoomReservationId: number | null = null;

    try {
      const s = await supabaseClient.auth.getSession();
      console.log(">>> supabase session object:", s);
      console.log(">>> current user id from session:", s?.data?.session?.user?.id);
      console.log(">>> access token length:", s?.data?.session?.access_token?.length || 0);


      const { data: reservationRecord, error: reservationError } = await supabaseClient
        .from("reservation")
        .insert({
          user_id: userId,
          purpose: (detailsData as any).purpose,
          status: "PENDING",
          type: "ROOM",
        })
        .select("id") 
        .single(); 

      if (reservationError) throw reservationError;
      newReservationId = reservationRecord.id;

      const { data: roomRecord, error: roomError } = await supabaseClient
        .from("room_reservation")
        .insert({
          reservation_id: newReservationId,
          room_id: (detailsData as any).room_id,
          advisor: (detailsData as any).advisor,
          equipments: (participantsData as any).equipment,
          participants: (participantsData as any).participants,
        })
        .select("id")
        .single();
      
      if (roomError) throw roomError;
      newRoomReservationId = roomRecord.id;

      const { error: scheduleError } = await supabaseClient
        .from("schedule")
        .insert({
          reservation_id: newReservationId,
          date: (detailsData as any).date,
          start_time: (detailsData as any).startTime,
          end_time: (detailsData as any).endTime,
        });

      if (scheduleError) throw scheduleError;

      alert("Reservation Submitted Successfully!");
      setActive(0); // Reset form
      setDetailsData(null);
      setParticipantsData(null);
      
    } catch (error: any) {
      console.error("Supabase submission failed:", error);
      alert("Error: " + error.message);
      
      if (newReservationId) {
        await supabaseClient.from("reservation").delete().eq('id', newReservationId);
      }
      if (newRoomReservationId) {
        await supabaseClient.from("room_reservation").delete().eq('id', newRoomReservationId);
      }

    } finally {
      setIsSubmitting(false); 
    }
  };
  const handleNextStep = () => { 
    let isValid = true; 

    if (active === 0) {
      isValid = detailsFormRef.current && detailsFormRef.current.validateAndProceed();
      if (isValid) {
        setDetailsData(detailsFormRef.current.getFormData());
      }
    } else if (active === 1) {
      isValid = participantsFormRef.current && participantsFormRef.current.validateAndProceed();
      if (isValid) {
        setParticipantsData(participantsFormRef.current.getFormData());
      }
    } else if (active === 2) {
      handleSubmit();
      return; 
    }
  
    if (isValid) {
      setActive((current) => (current < 3 ? current + 1 : current));
    }
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
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
                  <h1>Review</h1>
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
    </>
  );
};
