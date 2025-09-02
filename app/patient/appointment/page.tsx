"use client";
import { useRouter } from "next/navigation";

export default function PatientDashboard() {
  const router = useRouter();

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
          <h1 className="text-lg font-bold text-gray-700">Filter</h1>
          <input
            className="border border-gray-500 bg-white rounded p-2 w-full"
            placeholder="Search for Doctors"
          />
          <div>
            <p className="text-gray-700">Choose a Specialization:</p>
            <select
              className="border border-gray-500 bg-white rounded p-2 w-full"
              name="specialization"
            >
              <option value="">All</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dentist">Dentist</option>
              <option value="Neurologist">Neurologist</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
