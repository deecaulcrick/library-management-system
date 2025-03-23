"use client";

import { useLogin } from "@/hooks/auth/useLogin";
import LogoText from "@/icons/LogoText";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isLoading, isError, error, isSuccess } = useLogin();

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div className="w-full  bg-white rounded-lg">
      <LogoText fill="black" />
      <div className="mt-20">
        <h2 className="text-6xl font-bold mb-6 tracking-tight">Register.</h2>
        <p>Lorem ipsum odor amet, consectetuer adipiscing elit.</p>
      </div>
      {isSuccess && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          Registration successful!
        </div>
      )}

      {isError && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error?.response?.data?.message ||
            error.message ||
            "Registration failed"}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="mt-10">
          {/* <label htmlFor="name" className="block text-sm font-medium mb-1">
            Email
          </label> */}
          <input
            id="name"
            type="text"
            placeholder="Your name"
            className={`w-full px-3 py-3 border rounded-lg bg-[#E6E6E6]/60 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            {...register("email", {
              required: "Name is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="">
          {/* <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label> */}
          <input
            id="email"
            type="email"
            placeholder="Email address"
            className={`w-full px-3 py-3 border rounded-lg bg-[#E6E6E6]/60 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          {/* <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label> */}
          <input
            id="password"
            type="password"
            placeholder="Password"
            className={`w-full px-3 py-3 border rounded-lg bg-[#E6E6E6]/60 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[60px] py-2 px-4 bg-black text-white rounded-2xl font-medium hover:bg-[#FF5B2F] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-4">
        Have an account?{" "}
        <span className="text-[#FF5B2F] underline">
          <Link href="/login">Log in</Link>
        </span>
      </p>
    </div>
  );
};

export default SignupForm;
