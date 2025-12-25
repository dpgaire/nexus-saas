import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerSchema } from "../utils/validationSchemas";
import { useRegisterMutation } from "@/app/services/api";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { GoogleIcon } from "@/assets/icons";



const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data).unwrap();
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      const message =
        error?.data?.message || "Failed to register. Please try again.";
      toast.error(message);
    }
  };

  // TODO: Implement Google OAuth registration logic here
  const handleGoogleRegister = async () => {
    try {
      // Option 1: Redirect to backend Google OAuth (recommended)
      // window.location.href = "/api/auth/google"; // same endpoint as login, backend handles register/login

      // Option 2: If using @react-oauth/google
      // googleLogin(); // will handle signup if user is new

      // Placeholder
      console.log("Google registration initiated");

      // Example success flow (replace with real logic):
      // const result = await googleAuth();
      // toast.success("Account created with Google!");
      // navigate("/dashboard");

    } catch (error) {
      toast.error("Google registration failed. Please try again.");
      console.error("Google register error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="w-full max-w-md shadow-xl transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Join us — only valid accounts allowed
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Registration Button */}
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 flex items-center justify-center gap-3 
                         border-gray-300 dark:border-gray-700 
                         hover:bg-gray-50 dark:hover:bg-gray-800 
                         transition-all duration-200 cursor-pointer"
                onClick={handleGoogleRegister}
                disabled={isLoading}
              >
                <GoogleIcon />
                <span className="font-medium">Sign up with Google</span>
              </Button>

              {/* Separator */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-2">
                  OR
                </span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
              </div>
            </div>

            {/* Email/Password Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-300">
                  Full Name
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Durga Gairhe"
                    className="pl-10 pr-4 h-11 transition-all duration-200 
                             border-gray-300 focus:border-blue-500 
                             dark:border-gray-700 dark:focus:border-blue-500
                             focus:ring-2 focus:ring-blue-500/20"
                    {...register("fullName")}
                    disabled={isSubmitting || isLoading}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-red-600 dark:text-red-400 animate-fade-in">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    className="pl-10 pr-4 h-11 transition-all duration-200 
                             border-gray-300 focus:border-blue-500 
                             dark:border-gray-700 dark:focus:border-blue-500
                             focus:ring-2 focus:ring-blue-500/20"
                    {...register("email")}
                    disabled={isSubmitting || isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 animate-fade-in">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-12 h-11 transition-all duration-200 
                             border-gray-300 focus:border-blue-500 
                             dark:border-gray-700 dark:focus:border-blue-500
                             focus:ring-2 focus:ring-blue-500/20"
                    {...register("password")}
                    disabled={isSubmitting || isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 
                             dark:hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400 animate-fade-in">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium 
                         disabled:opacity-70 disabled:cursor-not-allowed
                         transition-all duration-200 transform hover:scale-[1.02] active:scale-100"
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 
                         hover:underline transition-all duration-200"
                >
                  Log in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;