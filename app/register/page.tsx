"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { set } from "zod";

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [error, setError] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
    specialization?: string;
  }>({});

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

    if (!name) {
      newError.name = "Name is required";
    }

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

    if (!confirmPassword) {
      newError.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
      newError.confirmPassword = "Passwords do not match";
    }

    if (!role) {
      newError.role = "Please select a role";
    }

    if (role === "DOCTOR" && !specialization) {
      newError.specialization = "Specialization is required for doctors";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) return;

    // Perform login logic here
    console.log({ email, password, role });
    router.push("/login");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
    if (value.length < 8) {
      setError({ password: "Password must be at least 8 characters" });
    } else {
      setError({ password: "" });
    }
  };

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

  return (
    <div className="max-h-screen flex flex-row">
      <div className="basis-1/2 min-h-screen  p-5">
        <img
          className="w-full h-full object-cover rounded-4xl"
          src="/sawdaMicroscope.png"
          alt="Login Image"
        />
      </div>
      <div className="basis-1/2 flex flex-col justify-center items-center p-50 gap-8">
        <h1 className="text-3xl font-bold">Register</h1>
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
            onChange={handlePasswordChange}
            className="flex border border-gray-500 rounded-lg px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black-500"
          />
          {error.password && (
            <div className="text-red-500 text-center text-sm">
              {error.password}
            </div>
          )}
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
          {role === "DOCTOR" && (
            <>
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="flex border border-gray-500 rounded-lg px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black-500"
              />
              {error.specialization && (
                <div className="text-red-500 text-center text-sm">
                  {error.specialization}
                </div>
              )}
            </>
          )}
          <input
            type="url"
            name="photo_url"
            placeholder="Photo URL (optional)"
            className="flex border border-gray-500 rounded-lg px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-700"
          >
            Register
          </button>
        </form>
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
