"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

export default function DoctorDashboard() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
    const userRole = localStorage.getItem("userRole");
    if (userRole === "PATIENT") {
      router.push("/patient/dashboard");
    }

    axiosInstance
      .get(`/appointments/doctor?status=${status}&date=${date}&page=${page}`)
      .then((res) => {
        console.log(res.data.message);
        setAppointments(res.data.data);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          router.push("/login");
        }
      });
  }, []);

  return (
    <div className="flex flex-col h-screen max-h-screen min-h-screen justify-start items-center p-3 gap-3 box-border">
      <header className="w-full p-4 rounded-xl text-gray-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Doctor's Dashboard</h1>
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
          <label className="font-semibold text-gray-700">
            Filter by Status:
          </label>
          <div className="flex flex-row justify-between gap-1">
            <button
              className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
              onClick={() => setStatus("")}
            >
              All
            </button>
            <button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 cursor-pointer"
              onClick={() => setStatus("Pending")}
            >
              Pending
            </button>
            <button
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 cursor-pointer"
              onClick={() => setStatus("Cancelled")}
            >
              Cancelled
            </button>
            <button
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 cursor-pointer"
              onClick={() => setStatus("Completed")}
            >
              Completed
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">
              Filter by date:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
            onClick={() => {
              setStatus("");
              setDate("");
            }}
          >
            Clear Filter
          </button>
        </div>
        <div className="flex-3 border border-gray-300 rounded-2xl p-5 flex flex-col gap-3">
          <h1 className="text-2xl font-bold">{status} Appointments</h1>
          <div className="flex-1 overflow-y-auto gap-1">
            {appointments.map((item: any) => (
              <div
                key={item.id}
                className="flex flex-row justify-between items-center border border-gray-300 p-2 px-4 bg-blue-200 rounded-lg shadow-sm cursor-pointer hover:bg-blue-300"
              >
                <p className="text-lg font-bold">{item.name}</p>
                <p className="text-md">{item.date}</p>
                <button
                  disabled={item.status !== "Pending"}
                  className={`px-4 py-2 rounded cursor-pointer ${
                    item.status === "Pending"
                      ? "bg-red-500 text-white hover:bg-red-400"
                      : "bg-gray-300 text-gray-700 cursor-not-allowed opacity-60"
                  }`}
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-row gap-5 justify-between">
            <button
              className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => setPage((page) => Math.max(page - 1, 1))}
            >
              Previous
            </button>
            <button
              className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => setPage((page) => page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
