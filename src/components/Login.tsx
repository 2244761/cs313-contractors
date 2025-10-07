import { useLogin } from "@refinedev/core";
import Header from "../assets/images/Header.png";
import googleLogo from "../assets/images/google-logo.png";

export const Login = () => {
  const { mutate: login, isPending } = useLogin();

  return (
    <div className="w-full h-dvh bg-[#D1E2EB] flex flex-col justify-center items-center px-4">
      <div className="bg-[#EFEFEF] p-10 rounded-[8px] flex flex-col gap-6 sm:gap-8 w-full max-w-md">
        <img
          src={Header}
          alt="Saint Louis University"
          className=" w-100 h-auto object-contain"
        />
        {/* Google Sign In */}
        <div className="flex flex-col gap-4">
          <button
            disabled={isPending}
            onClick={() => login({})}
            className="flex items-center gap-4 justify-center border-[var(--primary)] border cursor-pointer rounded-[8px] p-3 transition duration-200 hover:bg-[var(--primary)] text-[var(--primary)] hover:text-white"
            // className="flex items-center gap-4 justify-center border-[var(--primary)] border cursor-pointer rounded-[8px] p-3 transition duration-200 hover:bg-[rgba(7,48,102,0.1)] text-[var(--primary)]"
          >
            <img src={googleLogo} alt="Google Logo" className="w-5 h-auto" />
            Sign in with Google
          </button>
          <p className="text-xs sm:text-sm flex gap-1 items-center justify-center text-[var(--dark-secondary)] w-full">
            Only emails ending with @slu.edu.ph are allowed
          </p>
        </div>
      </div>
    </div>
  );
};
