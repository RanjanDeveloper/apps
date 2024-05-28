import { EventsEnum, UserRoleEnum } from "@/db/schemas";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email("This is not a valid email"),
  password: z.string().min(1, { message: "Password is required" }).min(8, { message: "Password is too short" }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }).email("This is not a valid email"),
  password: z.string().min(1, { message: "Password is required" }).min(8, { message: "Password is too short" }),
  // terms: z.coerce.boolean().refine(bool => bool == true, {
  //   message: "You must agree to our terms and conditions",
  // }),
});

export const ResetSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email("This is not a valid email"),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(1, { message: "Password is required" }).min(8, { message: "Password is too short" }),
});
export const AddUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }).email("This is not a valid email"),
  password: z.string().min(1, { message: "Password is required" }).min(8, { message: "Password is too short" }),
  role: z.enum([UserRoleEnum.ADMIN, UserRoleEnum.USER]),
  isTwoFactorEnabled: z.boolean(),
});
export const AddPayerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  city: z.optional(z.string().min(1, { message: "City is required" })),
  amount:z.coerce.number().nonnegative({ message: "Amount must be at least 0" }).default(0),
  description:z.optional(z.string().min(1, { message: "description is required" }))
});
export const EditPayerSchema = z.object({
  name:z.optional( z.string().min(1, { message: "Name is required" })),
  city: z.optional(z.string().min(1, { message: "City is required" })),
  amount:z.coerce.number().nonnegative({ message: "Amount must be at least 0" }).default(0),
  description:z.optional(z.string().min(1, { message: "description is required" }))
 
});
export const EditUserSchema = z.object({
  name: z.optional(z.string()),
  email: z.optional(z.string().email("This is not a valid email")),
  password: z.optional(z.string().min(8, { message: "Password is too short" })),
  isTwoFactorEnabled: z.optional(z.boolean()),
});


export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRoleEnum.ADMIN, UserRoleEnum.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(8)),
    newPassword: z.optional(z.string().min(8)),
  })
  .refine(
    data => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    data => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );

export const AddEventSchema = z.object({
  title: z.string().min(1, { message: "Name is required" }),
  eventType:z.enum([EventsEnum.MARRIAGE,EventsEnum.ENGAGEMENT,EventsEnum.FUNERAL,EventsEnum.OTHER],{
    required_error: "Type is required",
  }),
  date:z.date({
    required_error: "Date is required",
    invalid_type_error: "That's not a date!",
  }),
  place:z.string().min(1, { message: "Place is required" })
});
export const EditEventSchema = z.object({
  title: z.string().min(1, { message: "Name is required" }),
  eventType:z.enum([EventsEnum.MARRIAGE,EventsEnum.ENGAGEMENT,EventsEnum.FUNERAL,EventsEnum.OTHER],{
    required_error: "Type is required",
  }),
  date:z.date({
    required_error: "Date is required",
    invalid_type_error: "That's not a date!",
  }),
  place:z.string().min(1, { message: "Place is required" })
});

//Flames

export const Flameschema = z.object({
  name1: z.string().min(1, 'Name is required').regex(/^[a-zA-Z\s]+$/, 'Name should contain only letters and spaces'),
  name2: z.string().min(1, 'Name is required').regex(/^[a-zA-Z\s]+$/, 'Name should contain only letters and spaces'),
});

