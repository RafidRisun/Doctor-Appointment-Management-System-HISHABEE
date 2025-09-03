"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  // Error state for validation and server errors
  const [error, setError] = useState<{
    email?: string;
    password?: string;
    role?: string;
  }>({});

  // Handle login form submission and validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newError: { email?: string; password?: string; role?: string } = {};

    // Email validation
    if (!email) {
      newError.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newError.email = "Invalid email address";
    }

    // Password validation
    if (!password) {
      newError.password = "Password is required";
    } else if (password.length < 8) {
      newError.password = "Password must be at least 8 characters";
    }

    // Role validation
    if (!role) {
      newError.role = "Please select a role";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) return;

    // Send login request
    axiosInstance
      .post("/auth/login", { email, password, role })
      .then((res) => {
        // Store auth info in localStorage
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("userRole", res.data.data.user.role);
        localStorage.setItem("userName", res.data.data.user.name);
        // Redirect based on role
        if (res.data.data.user.role === "DOCTOR") {
          router.push("/doctor/dashboard");
        } else if (res.data.data.user.role === "PATIENT") {
          router.push("/patient/dashboard");
        }
      })
      .catch((err) => {
        setError({ password: "Invalid credentials or server error" });
      });
  };

  // Main login UI
  return (
    <div className="max-h-screen flex flex-row">
      {/* Left image section (hidden on mobile) */}
      <div className="hidden sm:block sm:basis-1/2 min-h-screen  p-5">
        <img
          className="w-full h-full object-cover rounded-4xl"
          src="/consultancy2.png"
          alt="Login Image"
        />
      </div>
      {/* Login form section */}
      <div className="w-full sm:basis-1/2 min-h-screen flex flex-col justify-center items-center p-20 sm:p-50 gap-8">
        <h1 className="text-3xl font-bold">Login to your Account</h1>
        <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
          {/* Role selection */}
          <div className="flex items-center w-full justify-between">
            <p className="text-lg">Are you a Doctor or a Patient?</p>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="DOCTOR"
                  className="accent-gray-900"
                  onChange={(e) => setRole(e.target.value)}
                />
                Doctor
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="PATIENT"
                  className="accent-gray-900"
                  onChange={(e) => setRole(e.target.value)}
                />
                Patient
              </label>
            </div>
          </div>
          {error.role && (
            <div className="text-red-500 text-center text-sm">{error.role}</div>
          )}
          {/* Email input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex border border-gray-500 rounded-lg px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black-500"
          />
          {error.email && (
            <div className="text-red-500 text-center text-sm">
              {error.email}
            </div>
          )}
          {/* Password input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex border border-gray-500 rounded-lg px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black-500"
          />
          {error.password && (
            <div className="text-red-500 text-center text-sm">
              {error.password}
            </div>
          )}
          {/* Submit button */}
          <button
            type="submit"
            className="bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-700 cursor-pointer"
          >
            Login
          </button>
        </form>
        {/* Register link */}
        <div className="flex flex-row gap-2 items-center">
          <p className="text-lg">Don&apos;t have an account?</p>
          <button
            className="text-blue-500 hover:cursor-pointer cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
