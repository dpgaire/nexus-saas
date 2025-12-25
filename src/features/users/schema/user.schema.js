import * as yup from "yup";

// User validation schema
export const userSchema = yup.object({
  fullName: yup.string().min(3, "Full name must be at least 3 characters"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  role: yup
    .string()
    .oneOf(["superAdmin", "Admin", "User"], "Invalid role")
    .required("Role is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// User update validation schema (password optional)
export const userUpdateSchema = yup.object({
  fullName: yup
    .string()
    .min(2, "Full name must be at least 2 characters")
    .optional(),
  email: yup.string().email("Invalid email format").optional(),
  role: yup
    .string()
    .oneOf(["superAdmin", "Admin", "User"], "Invalid role")
    .optional(),
});
