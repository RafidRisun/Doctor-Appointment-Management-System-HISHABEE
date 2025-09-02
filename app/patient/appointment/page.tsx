"use client";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { set } from "zod";

export default function PatientDashboard() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [modal, setModal] = useState(false);
  const [page, setPage] = useState(1);
  const [appointments, setAppointments] = useState([]);
  const [appointmentId, setAppointmentId] = useState("");
  const [flag, setFlag] = useState(1);

  useEffect(() => {
    axiosInstance
      .get(`/appointments/patient?status=${status}&page=${page}`)
      .then((res) => {
        console.log(res.data.message);
        setAppointments(res.data.data);
      });
  }, [status, page, flag]);

  const handleCancel = () => {
    axiosInstance
      .patch("/appointments/update-status", {
        status: "CANCELLED",
        appointment_id: appointmentId,
      })
      .then((res) => {
        console.log(res.data.message);
        setModal(false);
        setAppointmentId("");
        setFlag(flag + 1);
      });
  };

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
              className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
              onClick={() => setStatus("")}
            >
              All
            </button>
            <button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 cursor-pointer"
              onClick={() => setStatus("PENDING")}
            >
              Pending
            </button>
            <button
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 cursor-pointer"
              onClick={() => setStatus("CANCELLED")}
            >
              Cancelled
            </button>
            <button
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 cursor-pointer"
              onClick={() => setStatus("COMPLETED")}
            >
              Completed
            </button>
          </div>
          <div className="flex flex-col w-full h-full">
            <h1 className="text-2xl font-bold">{status} Appointments</h1>
            <div className="flex-1 overflow-y-auto">
              {appointments.map((item: any) => (
                <div
                  key={item.id}
                  className="flex flex-row justify-between items-center border-b border-gray-300 p-3"
                >
                  <p className="text-lg font-bold">{item.doctor.name}</p>
                  <p className="text-md">
                    {item.status === "PENDING"
                      ? item.createdAt
                      : item.updatedAt}
                  </p>
                  <button
                    onClick={() => {
                      setAppointmentId(item.id);
                      setModal(true);
                    }}
                    disabled={item.status !== "PENDING"}
                    className={`px-4 py-2 rounded cursor-pointer ${
                      item.status === "PENDING"
                        ? "bg-red-500 text-white hover:bg-red-400"
                        : "bg-gray-300 text-gray-700 cursor-not-allowed opacity-60"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
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
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-7 shadow-xl w-full max-w-md border border-gray-300 flex flex-col gap-5">
            <h2 className="text-xl font-bold">Cancel Appointment</h2>

            <div className="flex flex-row justify-between gap-2">
              <button
                className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                onClick={() => {
                  handleCancel();
                  setModal(false);
                }}
              >
                Yes
              </button>
              <button
                className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                onClick={() => {
                  // Handle booking appointment
                  setModal(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
