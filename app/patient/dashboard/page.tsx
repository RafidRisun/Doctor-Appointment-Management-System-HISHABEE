"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PatientDashboard() {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [date, setDate] = useState("");
  const [doctorName, setDoctorName] = useState("");

  return (
    <div className="flex flex-col h-screen max-h-screen min-h-screen justify-start items-center p-3 gap-3 box-border">
      <header className="w-full p-4 rounded-xl text-gray-700 flex justify-between items-center">
        <div className="flex gap-20 items-end">
          <h1 className="text-2xl font-bold">Patient Dashboard</h1>
          <button
            className="text-lg font-bold hover:text-blue-500 cursor-pointer"
            onClick={() => router.push("/patient/appointment")}
          >
            My Appointments
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
        <div className="flex-3 border border-gray-300 rounded-2xl p-5 flex flex-col gap-3">
          <h1 className="text-lg font-bold text-gray-700">
            Available Doctors & Specialists
          </h1>
          <div className="flex-1 flex flex-wrap gap-5 overflow-y-auto">
            <div className="flex flex-col w-60 h-80 bg-gray-100 rounded-xl border border-gray-300 p-2 shadow-md gap-2">
              <img
                src="/consultancy2.png"
                className="w-full h-8/12 object-cover rounded-lg"
              />
              <div className="p-2 flex flex-col items-start gap-1">
                <h1 className="text-lg font-bold text-gray-700">Doctor Name</h1>
                <p className="text-gray-600">Specialization</p>
              </div>
              <button
                className=" bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                onClick={() => setModal(true)}
              >
                Book Appointment
              </button>
            </div>
          </div>
          <div className="flex flex-row gap-5 justify-between">
            <button className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">
              Previous
            </button>
            <button className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">
              Next
            </button>
          </div>
        </div>
      </div>
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-7 shadow-xl w-full max-w-md border border-gray-300 flex flex-col gap-5">
            <h2 className="text-xl font-bold">
              Book Appointment with {doctorName}?
            </h2>
            <div className="flex flex-col gap-2">
              <p>Please select a date for your appointment:</p>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-row justify-between gap-2">
              <button
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                onClick={() => {
                  // Handle booking appointment
                  setModal(false);
                }}
              >
                Confirm Appointment
              </button>
              <button
                className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                onClick={() => {
                  // Handle booking appointment
                  setModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
