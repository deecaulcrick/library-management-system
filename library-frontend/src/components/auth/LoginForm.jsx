"use client";

import { useLogin, useIsAuthenticated } from "@/hooks";
import { loginSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput, FormPassword } from "@/components/form";
import LogoText from "@/icons/LogoText";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { isAuthenticated, isInitialized } = useIsAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
      const userData = JSON.parse(localStorage.getItem("library_user") || "{}");

      if (userData.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(callbackUrl || "/dashboard");
      }
    }
  }, [isInitialized, isAuthenticated, router, callbackUrl]);

  const onSubmit = async (data) => {
    login({
      ...data,
      isAdmin: isAdminLogin,
    });
  };

  // Combine both loading states
  const isButtonLoading = isLoading || isSubmitting;

  return (
    <div className="w-full bg-white rounded-lg">
      <LogoText fill="black" />
      <div className="mt-20">
        <h2 className="text-6xl font-bold mb-6 tracking-tight">Sign in.</h2>
        <p>
          Welcome back! Please enter your credentials to access your account.
        </p>
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
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isButtonLoading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isButtonLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
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
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register now
            </Link>
          </p>
          {isAdminLogin && (
            <p className="text-sm text-gray-500 mt-2">
              This is a protected area for library administrators only
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
