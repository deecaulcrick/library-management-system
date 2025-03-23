import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import Animate from "@/icons/Animate";
import Logo from "@/icons/Logo";
import LogoText from "@/icons/LogoText";
import React from "react";

const signup = () => {
  return (
    <section className="h-screen p-6 flex items-center justify-between">
      <div className="w-[60%] h-full flex justify-center items-center flex-col gap-10 ">
        <div className=" ">
          <Animate />
        </div>
        <h3 className=" w-[50%] font-semibold text-xl tracking-tighter text-center leading-none">
          Get access to over 5,000 books to aid your Computer Science journey.
        </h3>
      </div>
      <div className="w-[40%] h-full bg-white rounded-4xl p-16 flex items-start justify-center">
        <SignupForm />
      </div>
    </section>
  );
};

export default signup;
