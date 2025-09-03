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
  const [modal, setModal] = useState(false);
  const [modalAppointmentId, setModalAppointmentId] = useState("");
  const [modalNewStatus, setModalNewStatus] = useState("");
  const [flag, setFlag] = useState(1);

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
        //setAppointments(mockAppointments);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          router.push("/login");
        }
      });
  }, [status, page, flag]);

  const handleSetStatus = (appointmentId: string, newStatus: string) => {
    axiosInstance
      .patch("/appointments/update-status", {
        status: newStatus,
        appointment_id: appointmentId,
      })
      .then((res) => {
        console.log(res.data.message);
        setModal(false);
        setModalAppointmentId("");
        setFlag(flag + 1);
      });
  };

  return (
    <div className="flex flex-col h-screen max-h-screen min-h-screen justify-start items-center p-3 gap-3 box-border">
      <header className="w-full p-4 rounded-xl text-gray-700 flex justify-between items-center">
        <h1 className="text-lg sm:text-2xl font-bold">Doctor's Dashboard</h1>
        <button
          className="bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600 cursor-pointer text-sm sm:text-md"
          onClick={() => router.push("/login")}
        >
          Log Out
        </button>
      </header>
      <div className="w-full h-full flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex flex-col bg-gray-100 rounded-2xl border border-gray-300 p-5 gap-5">
          <h1 className="text-md sm:text-lg font-bold text-gray-700">Filter</h1>
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
          <h1 className="text-lg sm:text-2xl font-bold">
            {status} Appointments
          </h1>
          <div className="flex-1 flex flex-col overflow-y-auto gap-2">
            {appointments.map((item: any) => (
              <div
                key={item.id}
                className="flex flex-row justify-between items-center border-b border-gray-300 p-3"
              >
                <p className="text-lg font-bold">{item.patient.name}</p>
                <p className="text-md">{item.date}</p>
                <p className="text-md">{item.status}</p>
                <div className="flex gap-2">
                  <button
                    disabled={item.status !== "PENDING"}
                    className={`px-4 py-2 rounded ${
                      item.status === "PENDING"
                        ? "bg-red-500 text-white hover:bg-red-400 cursor-pointer"
                        : "bg-red-200 text-white cursor-not-allowed"
                    }`}
                    onClick={() => {
                      setModal(true);
                      setModalAppointmentId(item.id);
                      setModalNewStatus("CANCELLED");
                    }}
                  >
                    Mark as Cancelled
                  </button>
                  <button
                    disabled={item.status !== "PENDING"}
                    className={`px-4 py-2 rounded ${
                      item.status === "PENDING"
                        ? "bg-green-500 text-white hover:bg-green-400 cursor-pointer"
                        : "bg-green-200 text-white cursor-not-allowed"
                    }`}
                    onClick={() => {
                      setModal(true);
                      setModalAppointmentId(item.id);
                      setModalNewStatus("COMPLETED");
                    }}
                  >
                    Mark as Completed
                  </button>
                </div>
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
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-7 shadow-xl w-full max-w-md border border-gray-300 flex flex-col gap-5">
            <h2 className="text-xl font-bold">Confirm {modalNewStatus}?</h2>
            <p>
              Are you sure you want to change the status of this appointment?
            </p>
            <div className="flex flex-row justify-between gap-2">
              <button
                className={`w-full ${
                  modalNewStatus === "CANCELLED" ? "bg-red-500" : "bg-green-500"
                } text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer`}
                onClick={() => {
                  handleSetStatus(modalAppointmentId, modalNewStatus);
                  setModal(false);
                }}
              >
                Confirm
              </button>
              <button
                className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                onClick={() => setModal(false)}
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

// const mockAppointments = [
//   {
//     id: "a1",
//     name: "John Doe",
//     date: "2025-09-05",
//     status: "PENDING",
//   },
//   {
//     id: "a2",
//     name: "Jane Smith",
//     date: "2025-09-06",
//     status: "COMPLETED",
//   },
//   {
//     id: "a3",
//     name: "Alice Johnson",
//     date: "2025-09-07",
//     status: "CANCELLED",
//   },
//   {
//     id: "a4",
//     name: "Bob Brown",
//     date: "2025-09-08",
//     status: "PENDING",
//   },
// ];
