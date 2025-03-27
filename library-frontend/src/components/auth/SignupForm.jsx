"use client";

import { useRegister, useIsAuthenticated } from "@/hooks";
import { signupSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput, FormPassword, FormSelect } from "@/components/form";
import LogoText from "@/icons/LogoText";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useIsAuthenticated();
  const [isAdminRegistration, setIsAdminRegistration] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student", // Default role
    },
  });

  // Watch password for confirmation validation (not needed with Zod schema but kept for reference)
  const password = watch("password");

  const { mutate: registerUser, isLoading, isError, error } = useRegister();

  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isInitialized, isAuthenticated, router]);

  const onSubmit = (data) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = data;
    registerUser(userData);
  };

  // Get role options based on registration type
  const getRoleOptions = () => {
    if (isAdminRegistration) {
      return [{ value: "admin", label: "Admin" }];
    } else {
      return [
        { value: "student", label: "Student" },
        { value: "staff", label: "Staff" }
      ];
    }
  };

  return (
    <div className="w-full bg-white rounded-lg">
      <LogoText fill="black" />
      <div className="mt-20">
        <h2 className="text-6xl font-bold mb-6 tracking-tight">Register.</h2>
        <p>Create an account to access the library management system.</p>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setIsAdminRegistration(false)}
            className={`px-4 py-2 text-sm font-medium ${
              !isAdminRegistration
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            } border border-gray-200 rounded-l-lg`}
          >
            Student/Staff
          </button>
          <button
            type="button"
            onClick={() => setIsAdminRegistration(true)}
            className={`px-4 py-2 text-sm font-medium ${
              isAdminRegistration
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            } border border-gray-200 rounded-r-lg`}
          >
            Admin
          </button>
        </div>
      </div>

      {isError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error?.response?.data?.message || "Registration failed"}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <FormInput
          id="name"
          name="name"
          label="Name"
          placeholder="Your full name"
          register={register}
          errors={errors}
        />

        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Email address"
          register={register}
          errors={errors}
        />

        <FormPassword
          id="password"
          name="password"
          label="Password"
          placeholder="Password"
          register={register}
          errors={errors}
        />

        <FormPassword
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm password"
          register={register}
          errors={errors}
        />

        <FormSelect
          id="role"
          name="role"
          label="Role"
          options={getRoleOptions()}
          register={register}
          errors={errors}
        />

        {isAdminRegistration && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> Admin accounts have full access to the system, including user management, book catalog administration, and reporting features.
            </p>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : `Register as ${isAdminRegistration ? 'Admin' : 'User'}`}
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
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
