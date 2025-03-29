import LoginForm from "@/components/auth/LoginForm";
import Animate from "@/icons/Animate";
import Logo from "@/icons/Logo";
import LogoText from "@/icons/LogoText";
import React, { Suspense } from "react";

const login = () => {
  return (
    <section className="min-h-screen p-2 md:p-6 flex flex-col md:flex-row items-center justify-between">
      <div className="w-full md:w-1/2 lg:w-[60%] flex justify-center items-center flex-col gap-5 md:gap-10 py-8 md:py-0">
        <div className="w-3/4 md:w-auto hidden lg:block">
          <Animate />
        </div>
        <h3 className="w-full md:w-4/5 lg:w-[60%] font-semibold text-lg md:text-xl tracking-tighter text-center leading-tight">
          Get access to over 5,000 books to aid your Computer Science journey.
        </h3>
      </div>

      <div className="w-full md:w-1/2 lg:w-[40%] bg-white rounded-3xl md:rounded-4xl p-6 md:p-10 lg:p-16 flex items-start justify-center mt-6 md:mt-0">
        <Suspense fallback={<div className="w-full p-4">Loading login form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </section>
  );
};

export default login;
