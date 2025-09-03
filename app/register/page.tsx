"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  // Error state for validation
  const [error, setError] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
    specialization?: string;
  }>({});

  // Handle registration form submission and validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newError: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      role?: string;
      specialization?: string;
    } = {};

    // Name validation
    if (!name) {
      newError.name = "Name is required";
    }

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

    // Confirm password validation
    if (!confirmPassword) {
      newError.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
      newError.confirmPassword = "Passwords do not match";
    }

    // Role validation
    if (!role) {
      newError.role = "Please select a role";
    }

    // Specialization required for doctors
    if (role === "DOCTOR" && !specialization) {
      newError.specialization = "Specialization is required for doctors";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) return;

    // Prepare API endpoint and payload
    const endpoint =
      role === "DOCTOR" ? "/auth/register/doctor" : "/auth/register/patient";

    const payload =
      role === "DOCTOR"
        ? { name, email, password, specialization }
        : { name, email, password };

    // Send registration request
    axiosInstance.post(endpoint, payload).then((res) => {
      router.push("/login");
    });
  };

  // Fetch all available specializations
  const getSpecializations = () => {
    axiosInstance.get("/specializations").then((res) => {
      setSpecializations(res.data.data || []);
      console.log(res.data.message);
    });
  };

  useEffect(() => {
    getSpecializations();
  }, []);

  // Live password validation
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
    if (value.length < 8) {
      setError({ password: "Password must be at least 8 characters" });
    } else {
      setError({ password: "" });
    }
  };

  // Live confirm password validation
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setConfirmPassword(value);
    if (value !== password) {
      setError({ confirmPassword: "Passwords do not match" });
    } else {
      setError({ confirmPassword: "" });
    }
  };

  // Main registration UI
  return (
    <div className="max-h-screen flex flex-row">
      {/* Left image section (hidden on mobile) */}
      <div className="hidden sm:block sm:basis-1/2 min-h-screen  p-5">
        <img
          className="w-full h-full object-cover rounded-4xl"
          src="/sawdaMicroscope.png"
          alt="Login Image"
        />
      </div>
      {/* Registration form section */}
      <div className="w-full sm:basis-1/2 min-h-screen flex flex-col justify-center items-center p-20 sm:p-50 gap-8">
        <h1 className="text-3xl font-bold">Register</h1>
        {/* Role selection */}
        <div className="flex items-center w-full justify-between gap-2">
          <button
            className={`w-full ${
              role === "DOCTOR" ? "bg-gray-500" : "bg-gray-700"
            } text-white px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer`}
            onClick={() => setRole("DOCTOR")}
          >
            Doctor
          </button>
          <button
            className={`w-full ${
              role === "PATIENT" ? "bg-gray-500" : "bg-gray-700"
            } text-white px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer`}
            onClick={() => setRole("PATIENT")}
          >
            Patient
          </button>
        </div>
        {error.role && (
          <div className="text-red-500 text-center text-sm">{error.role}</div>
        )}
        <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
          {/* Name input */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex border border-gray-500 rounded-lg px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black-500"
          />
          {error.name && (
            <div className="text-red-500 text-center text-sm">{error.name}</div>
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
            onChange={handlePasswordChange}
            className="flex border border-gray-500 rounded-lg px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black-500"
          />
          {error.password && (
            <div className="text-red-500 text-center text-sm">
              {error.password}
            </div>
          )}
          {/* Confirm password input */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="flex border border-gray-500 rounded-lg px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black-500"
          />
          {error.confirmPassword && (
            <div className="text-red-500 text-center text-sm">
              {error.confirmPassword}
            </div>
          )}
          {/* Specialization for doctors only */}
          {role === "DOCTOR" && (
            <>
              <select
                className="flex border border-gray-500 rounded-lg px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black-500"
                name="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <option value="" disabled>
                  Select your Specialization
                </option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </>
          )}
          {/* Optional photo URL */}
          <input
            type="url"
            name="photo_url"
            placeholder="Photo URL (optional)"
            className="flex border border-gray-500 rounded-lg px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Submit button */}
          <button
            type="submit"
            className="bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-700 cursor-pointer"
          >
            Register
          </button>
        </form>
        {/* Login link */}
        <div className="flex flex-row gap-2 items-center">
          <p className="text-lg">Already have an account?</p>
          <button
            className="text-blue-500 hover:cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
