"use client";

import { useLogin, useIsAuthenticated } from "@/hooks";
import { loginSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput, FormPassword } from "@/components/form";
import LogoText from "@/icons/LogoText";
import Link from "next/link";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useIsAuthenticated();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isLoading, isError, error } = useLogin();

  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isInitialized, isAuthenticated, router]);

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div className="w-full bg-white rounded-lg">
      <LogoText fill="black" />
      <div className="mt-20">
        <h2 className="text-6xl font-bold mb-6 tracking-tight">Sign in.</h2>
        <p>Welcome back! Please enter your credentials to access your account.</p>
      </div>

      {isError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error?.response?.data?.message || "Invalid credentials"}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Your email address"
          register={register}
          errors={errors}
        />

        <FormPassword
          id="password"
          name="password"
          label="Password"
          placeholder="Your password"
          register={register}
          errors={errors}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
