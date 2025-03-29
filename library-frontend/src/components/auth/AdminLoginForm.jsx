"use client";

import { loginSchema } from "@/schemas/auth.schema";
import { FormInput, FormPassword } from "@/components/form";
import { useLogin, useIsAuthenticated } from "@/hooks/auth/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "@/icons/Logo";
import LogoText from "@/icons/LogoText";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";

const AdminLoginForm = () => {
  const router = useRouter();
  const { mutate: login, isLoading, isError, error } = useLogin();
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

  useEffect(() => {
    // Redirect authenticated users to admin dashboard
    if (isInitialized && isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isInitialized, isAuthenticated, router]);

  const onSubmit = async (data) => {
    // Add admin context to login data
    login({
      ...data,
      isAdmin: true,
    });
  };

  // Combine both loading states
  const isButtonLoading = isLoading || isSubmitting;

  return (
    <div className="w-full bg-white rounded-lg">
      <div className="flex items-center justify-center mb-6">
        <Logo className="h-12 w-12 mr-2" />
        <LogoText fill="black" className="h-24 w-auto" />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-center">
          <ShieldAlert className="h-8 w-8 text-indigo-600 mr-2" />
          <h2 className="text-3xl font-bold tracking-tight text-center">
            Admin Portal
          </h2>
        </div>
        <p className="mt-4 text-center text-gray-600">
          Secure administrator access. Please enter your credentials.
        </p>
      </div>

      {isError && (
        <div className="mt-6 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          <p className="font-medium">Authentication failed</p>
          <p className="text-sm">
            {error?.response?.data?.message ||
              "Invalid administrator credentials"}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <FormInput
          name="email"
          type="email"
          label="Admin Email"
          placeholder="Your administrator email"
          register={register}
          errors={errors}
        />

        <FormPassword
          name="password"
          label="Password"
          placeholder="Your administrator password"
          register={register}
          errors={errors}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot admin password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isButtonLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isButtonLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Authenticating...
              </>
            ) : (
              "Log in to Admin"
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          This is a protected area for library administrators only
        </p>
      </div>
    </div>
  );
};

export default AdminLoginForm;
