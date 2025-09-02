"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PatientDashboard() {
  const router = useRouter();
  const [status, setStatus] = useState("All");

  return (
    <div className="flex flex-col h-screen max-h-screen min-h-screen justify-start items-center p-3 gap-3 box-border">
      <header className="w-full p-4 rounded-xl text-gray-700 flex justify-between items-center">
        <div className="flex gap-20 items-end">
          <h1 className="text-2xl font-bold">My Appointments</h1>
          <button
            className="text-lg font-bold hover:text-blue-500 cursor-pointer"
            onClick={() => router.push("/patient/dashboard")}
          >
            Dashboard
          </button>
        </div>
        <button
          className="bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Log Out
        </button>
      </header>
      <div className="w-full h-full flex flex-row gap-3">
        <div className="flex-1 flex flex-col bg-gray-100 rounded-2xl border border-gray-300 p-5 gap-5">
          <div className="flex flex-row justify-between gap-3">
            <button
              className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => setStatus("All")}
            >
              All
            </button>
            <button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
              onClick={() => setStatus("Pending")}
            >
              Pending
            </button>
            <button
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
              onClick={() => setStatus("Cancelled")}
            >
              Cancelled
            </button>
            <button
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
              onClick={() => setStatus("Completed")}
            >
              Completed
            </button>
          </div>
          <div className="flex flex-col w-full h-full">
            <h1 className="text-2xl font-bold">{status} Appointments</h1>
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-row justify-between items-center border-b border-gray-300 p-3">
                <p className="text-lg font-bold">Doctor Name</p>
                <p className="text-md">09/02/2025</p>
                <button
                  className={`px-4 py-2 rounded cursor-pointer ${
                    //item.status
                    status === "Pending"
                      ? "bg-red-500 text-white hover:bg-red-400"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
