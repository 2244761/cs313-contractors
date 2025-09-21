// import Header from "../assets/images/Header.png";
// import googleLogo from "../assets/images/google-logo.png";
// import { NavLink } from "react-router";
// import { FaEye, FaEyeSlash } from "react-icons/fa6";
// import { useState } from "react";
// import supabase from "../../config/supabaseClient";

// export const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//     });

//     if (error) {
//       console.error("Login Error: ", error.message);
//     } else {
//       console.log("OAuth Data:", data);
//       // This should usually contain a "url"
//       if (data?.url) {
//         console.log("Redirecting to:", data.url);
//       } else {
//         console.warn(
//           "No redirect URL returned — check your Supabase & Google settings!"
//         );
//       }
//     }

//     // if (error) console.error("Login Error: ", error.message);
//   };

//   return (
//     <div className="w-full h-dvh bg-[#D1E2EB] flex flex-col justify-center items-center px-4">
//       <div className="bg-[#EFEFEF] p-10 rounded-[8px] flex flex-col gap-6 sm:gap-8 w-full max-w-md">
//         <img
//           src={Header}
//           alt="Saint Louis University"
//           className=" w-100 h-auto object-contain"
//         />
//         <form className="flex flex-col gap-6">
//           {/* Email */}
//           <div className="flex flex-col gap-2">
//             <label htmlFor="email" className="text-sm sm:text-base">
//               Email
//             </label>
//             <input
//               type="text"
//               id="email"
//               name="email"
//               className="border border-[var(--ui-border)] p-3 p- rounded-[8px] focus:border-[var(--primary)] outline-none"
//             />
//           </div>
//           {/* Password */}
//           <div className="flex flex-col gap-2">
//             <label htmlFor="password" className="text-sm sm:text-base">
//               Password
//             </label>
//             <div className="relative w-full">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 name="password"
//                 className="border border-[var(--ui-border)] p-3 p- rounded-[8px] focus:border-[var(--primary)] outline-none w-full"
//               />
//               <span
//                 onClick={() => {
//                   setShowPassword((prev) => !prev);
//                 }}
//                 className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>

//             {/* Forgot Password */}
//             <a
//               href="#"
//               className="text-[var(--primary)] text-[12px] transition duration-200 hover:text-[var(--primary-hover)] w-fit"
//             >
//               Forgot password?
//             </a>
//           </div>
//           {/* Sign In Button */}
//           <button className="bg-[var(--primary)] text-[var(--primary-white)] p-3 rounded-[8px] font-medium cursor-pointer transition duration-200 hover:bg-[var(--primary-hover)]">
//             Sign In
//           </button>
//           {/* Separator */}
//           <div className="flex flex-row items-center gap-2">
//             <hr className="border flex-grow border-[var(--ui-border)]" />
//             <p className="text-[var(--dark-secondary)] font-[Montserrat] text-xs sm:text-sm">
//               OR
//             </p>
//             <hr className="border flex-grow border-[var(--ui-border)]" />
//           </div>
//           {/* Google Sign In */}
//           <button
//             onClick={handleLogin}
//             className="flex items-center gap-4 justify-center border-[var(--primary)] border cursor-pointer rounded-[8px] p-3 transition duration-200 hover:bg-[rgba(7,48,102,0.1)]"
//           >
//             <img src={googleLogo} alt="Google Logo" className="w-5 h-auto" />
//             Sign In with Google
//           </button>
//           <p className="text-xs sm:text-sm flex gap-1 items-center justify-center text-[var(--dark-secondary)] w-full">
//             Don't have an account? {/* Sign Up CTA */}
//             <NavLink to="/register">
//               <span className="text-[var(--primary)] font-medium transition duration-200 hover:text-[var(--primary-hover)] w-fit">
//                 Sign up
//               </span>
//             </NavLink>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };
