import { z } from "zod";

const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

export const createEnquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(150, "Email must be under 150 characters"),

  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid phone number"),

  userType: z.enum(["STUDENT", "CUSTOMER", "OTHER"]),

  interest: z
    .string()
    .trim()
    .min(2, "Interest must be at least 2 characters")
    .max(150, "Interest must be under 150 characters"),

  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
});

export const updateEnquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters")
    .optional(),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(150, "Email must be under 150 characters")
    .optional(),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid phone number")
    .optional(),

  userType: z
    .enum(["STUDENT", "CUSTOMER", "OTHER"])
    .optional(),

  interest: z
    .string()
    .trim()
    .min(2, "Interest must be at least 2 characters")
    .max(150, "Interest must be under 150 characters")
    .optional(),

  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters")
    .max(2000, "Message cannot exceed 2000 characters")
    .optional(),

  status: z
    .enum(["NEW", "CONTACTED", "IN_PROGRESS", "CLOSED"])
    .optional(),
});

export const queryEnquirySchema = z.object({
  search: z.string().optional(),

  userType: z.enum(["ALL", "STUDENT", "CUSTOMER", "OTHER"]).optional(),

  status: z
    .enum(["ALL", "NEW", "CONTACTED", "IN_PROGRESS", "CLOSED"])
    .optional(),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
export type UpdateEnquiryInput = z.infer<typeof updateEnquirySchema>;
export type QueryEnquiryInput = z.infer<typeof queryEnquirySchema>;
