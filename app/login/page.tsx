"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState<{
    email?: string;
    password?: string;
    role?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newError: { email?: string; password?: string; role?: string } = {};

    if (!email) {
      newError.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newError.email = "Invalid email address";
    }

    if (!password) {
      newError.password = "Password is required";
    } else if (password.length < 8) {
      newError.password = "Password must be at least 8 characters";
    }

    if (!role) {
      newError.role = "Please select a role";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) return;

    // Perform login logic here
    console.log({ email, password, role });

    if (role === "DOCTOR") {
      router.push("/doctor/dashboard");
    } else if (role === "PATIENT") {
      router.push("/patient/dashboard");
    }
  };

  return (
    <div className="max-h-screen flex flex-row">
      <div className="basis-1/2 min-h-screen  p-5">
        <img
          className="w-full h-full object-cover rounded-4xl"
          src="/consultancy2.png"
          alt="Login Image"
        />
      </div>
      <div className="basis-1/2 min-h-screen flex flex-col justify-center items-center p-50 gap-8">
        <h1 className="text-3xl font-bold">Login to your Account</h1>
        <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className="bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-700"
          >
            Login
          </button>
        </form>
        <div className="flex flex-row gap-2 items-center">
          <p className="text-lg">Don't have an account?</p>
          <button
            className="text-blue-500 hover:cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
