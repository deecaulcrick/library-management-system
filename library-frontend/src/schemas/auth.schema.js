import { z } from 'zod';

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
});

// Signup schema
export const signupSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Please confirm your password" }),
  role: z
    .enum(["admin", "staff", "student"], { 
      errorMap: () => ({ message: "Please select a valid role" }) 
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Book schema
export const bookSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Book title is required" })
    .min(2, { message: "Title must be at least 2 characters long" }),
  author: z
    .string()
    .min(1, { message: "Author is required" })
    .min(2, { message: "Author must be at least 2 characters long" }),
  isbn: z
    .string()
    .min(1, { message: "ISBN is required" })
    .regex(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/, { 
      message: "Invalid ISBN format" 
    }),
  publishedDate: z
    .string()
    .min(1, { message: "Published date is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  quantity: z
    .number({ message: "Quantity must be a number" })
    .int({ message: "Quantity must be an integer" })
    .min(0, { message: "Quantity cannot be negative" }),
  category: z
    .string()
    .min(1, { message: "Category is required" }),
});

// Generic required field schema creator
export const createRequiredFieldSchema = (fieldName) => 
  z.string().min(1, { message: `${fieldName} is required` });
