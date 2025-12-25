import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../app/services/api";
import { setCredentials } from "../app/slices/authSlice";
import { loginSchema } from "../utils/validationSchemas";
import { ArrowLeft } from "lucide-react";
import { GoogleIcon } from "@/assets/icons";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [login, { isLoading }] = useLoginMutation();

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue, // Added to programmatically set form values
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    setLoginError(null);
    try {
      const { accessToken, refreshToken, ...userData } = await login(data).unwrap();
      dispatch(setCredentials({ user: userData, token: accessToken, refreshToken }));
      navigate(from, { replace: true });
    } catch (error) {
      const message = error.data?.message || "An unexpected error occurred.";
      setLoginError(message);
      console.error("Login error:", error);
    }
  };

  // Guest login handler
  const handleGuestLogin = () => {
    setValue("email", "demo@gmail.com");
    setValue("password", "demo@123");
    
    // Trigger form submission programmatically
    handleSubmit(onSubmit)();
  };

  // TODO: Implement Google OAuth login logic here
  const handleGoogleLogin = async () => {
    // ... existing Google login logic
    console.log("Google login initiated");
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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Log in to access your dashboard
            </CardDescription>
            {loginError && (
              <CardDescription className="text-lg font-semibold text-red-600 dark:text-red-400 animate-fade-in text-center">
                {loginError}!
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Login Button */}
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 flex items-center justify-center gap-3 
                         border-gray-300 dark:border-gray-700 
                         hover:bg-gray-50 dark:hover:bg-gray-800 
                         transition-all duration-200 cursor-pointer"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <GoogleIcon />
                <span className="font-medium">Sign in with Google</span>
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

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

              {/* Regular Sign In Button */}
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
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Guest Login Button */}
              <Button
                type="button"
                variant="secondary"
                className="w-full h-11 text-base font-medium flex items-center justify-center gap-2
                       transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
                onClick={handleGuestLogin}
                disabled={isLoading || isSubmitting}
              >
                <User className="h-4 w-4" />
                Login as Guest
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 
                         hover:underline transition-all duration-200"
                >
                  Register
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;