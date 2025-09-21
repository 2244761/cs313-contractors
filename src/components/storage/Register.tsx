// import Header from "../assets/images/Header.png";
// import googleLogo from "../assets/images/google-logo.png";
// import { FaEye, FaEyeSlash } from "react-icons/fa6";
// import { useState } from "react";
// import { NavLink } from "react-router-dom";

// export const Register = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <div className="w-full h-dvh bg-[#D1E2EB] flex flex-col justify-center items-center px-4">
//       <div className="bg-[#EFEFEF] p-10 rounded-[8px] flex flex-col gap-6 sm:gap-8 w-full max-w-md">
//         <img
//           src={Header}
//           alt="Saint Louis University"
//           className=" w-100 h-auto object-contain"
//         />
//         <form className="flex flex-col gap-6">
//           {/* Google Sign In */}
//           <button className="flex items-center gap-4 justify-center border-[var(--primary)] border cursor-pointer rounded-[8px] p-3 transition duration-200 hover:bg-[rgba(7,48,102,0.1)]">
//             <img src={googleLogo} alt="Google Logo" className="w-5 h-auto" />
//             Sign In with Google
//           </button>
//           {/* Separator */}
//           <div className="flex flex-row items-center gap-2">
//             <hr className="border flex-grow border-[var(--ui-border)]" />
//             <p className="text-[var(--dark-secondary)] font-[Montserrat] text-xs sm:text-sm">
//               OR
//             </p>
//             <hr className="border flex-grow border-[var(--ui-border)]" />
//           </div>
//           <div className="flex flex-col gap-2">
//             {/* Email */}
//             <div className="flex flex-col gap-2">
//               <label htmlFor="email" className="text-sm sm:text-base">
//                 Email
//               </label>
//               <input
//                 type="text"
//                 id="email"
//                 name="email"
//                 className="border border-[var(--ui-border)] p-3 p- rounded-[8px] focus:border-[var(--primary)] outline-none"
//               />
//             </div>
//             {/* Password */}
//             <div className="flex flex-col gap-2">
//               <label htmlFor="password" className="text-sm sm:text-base">
//                 Password
//               </label>
//               <div className="relative w-full">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   name="password"
//                   className="border border-[var(--ui-border)] p-3 p- rounded-[8px] focus:border-[var(--primary)] outline-none w-full"
//                 />
//                 <span
//                   onClick={() => {
//                     setShowPassword((prev) => !prev);
//                   }}
//                   className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//               </div>
//             </div>
//             {/* Confirm Password */}
//             <div className="flex flex-col gap-2">
//               <label htmlFor="password" className="text-sm sm:text-base">
//                 Confirm Password
//               </label>
//               <div className="relative w-full">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   name="password"
//                   className="border border-[var(--ui-border)] p-3 p- rounded-[8px] focus:border-[var(--primary)] outline-none w-full"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Sign Up Button */}
//           <button className="bg-[var(--primary)] text-[var(--primary-white)] p-3 rounded-[8px] font-medium cursor-pointer transition duration-200 hover:bg-[var(--primary-hover)]">
//             Sign Up
//           </button>

//           <p className="text-xs sm:text-sm flex gap-1 items-center justify-center text-[var(--dark-secondary)] w-full">
//             Already have an account? {/* Sign Up CTA */}
//             <NavLink to="/">
//               <span className="text-[var(--primary)] font-medium transition duration-200 hover:text-[var(--primary-hover)] w-fit">
//                 Sign in
//               </span>
//             </NavLink>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };
