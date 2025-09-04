"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { FaUserDoctor } from "react-icons/fa6";
import Header from "@/app/components/header";
import Pagination from "@/app/components/pagination";
import { FaFilter } from "react-icons/fa";

export default function DoctorDashboard() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [modal, setModal] = useState(false);
  const [modalAppointmentId, setModalAppointmentId] = useState("");
  const [modalNewStatus, setModalNewStatus] = useState("");
  const [flag, setFlag] = useState(1);
  const [notification, setNotification] = useState("");
  const [errorNotification, setErrorNotification] = useState("");
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("");

  // Appointment type definition for API data
  type Appointment = {
    id: string;
    patient: { name: string };
    date: string;
    status: string;
  };

  // Fetch appointments for the doctor with filters
  const fetchAppointments = () => {
    axiosInstance
      .get(`/appointments/doctor?status=${status}&date=${date}&page=${page}`)
      .then((res) => {
        console.log(res.data.message);
        setAppointments(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          router.push("/login");
        }
      });
  };

  // Redirect if not authenticated or wrong role
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
    const userRole = localStorage.getItem("userRole");
    if (userRole === "PATIENT") {
      router.push("/patient/dashboard");
    }
  };

  // Update appointment status (Completed/Cancelled)
  const handleSetStatus = (appointmentId: string, newStatus: string) => {
    axiosInstance
      .patch("/appointments/update-status", {
        status: newStatus,
        appointment_id: appointmentId,
      })
      .then((res) => {
        console.log(res.data.message);
        setNotification("Appointment status updated successfully");
        setModal(false);
        setModalAppointmentId("");
        setFlag(flag + 1); // Refetch appointments
      })
      .catch((error) => {
        if (error.response.status === 403) {
          router.push("/login");
        } else {
          setErrorNotification("Failed to update appointment status");
        }
      });
  };

  // Fetch appointments when filters or status change
  useEffect(() => {
    fetchAppointments();
  }, [status, page, date, flag]);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
    setDoctorName(localStorage.userName);
  }, []);

  // Auto-hide notification after 5s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Auto-hide error notification after 5s
  useEffect(() => {
    if (errorNotification) {
      const timer = setTimeout(() => setErrorNotification(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorNotification]);

  // Show loading while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-4xl font-bold text-gray-700">Loading...</p>
      </div>
    );
  }

  // Main dashboard UI
  return (
    <div className="flex flex-col h-screen max-h-screen min-h-screen justify-start items-center p-3 gap-3 box-border">
      {/* Header */}
      <Header userName={doctorName} userType="DOCTOR" />
      {/* Body */}
      <div className="w-full h-full flex flex-col sm:flex-row gap-3">
        {/* Filter sidebar */}
        <div className="flex-1 flex flex-col bg-gray-100 rounded-2xl border border-gray-300 p-5 gap-5">
          <div className="flex flex-row gap-2 items-center">
            <h1 className="text-lg font-bold text-gray-700 cursor-default">
              Filter
            </h1>
            <FaFilter className="text-sm sm:text-md" />
          </div>
          <label className="font-semibold text-gray-700">
            Filter by Status:
          </label>
          <div className="flex flex-row justify-between gap-1">
            <button
              className="w-full bg-gray-700 text-white text-sm sm:text-md px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
              onClick={() => setStatus("")}
            >
              All
            </button>
            <button
              className="w-full bg-blue-500 text-white text-sm sm:text-md px-4 py-2 rounded hover:bg-blue-400 cursor-pointer"
              onClick={() => setStatus("PENDING")}
            >
              Pending
            </button>
            <button
              className="w-full bg-red-500 text-white text-sm sm:text-md px-4 py-2 rounded hover:bg-red-400 cursor-pointer"
              onClick={() => setStatus("CANCELLED")}
            >
              Cancelled
            </button>
            <button
              className="w-full bg-green-500 text-white text-sm sm:text-md px-4 py-2 rounded hover:bg-green-400 cursor-pointer"
              onClick={() => setStatus("COMPLETED")}
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
        {/* Appointments list */}
        <div className="flex-3 border border-gray-300 rounded-2xl p-5 flex flex-col gap-3">
          <h1 className="text-lg sm:text-2xl font-bold">
            {status} Appointments
          </h1>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full table-fixed">
              <tbody>
                {appointments.map((item: Appointment) => (
                  <tr key={item.id} className="border-b border-gray-300">
                    <td className="w-1/4 sm:p-3 align-middle text-left">
                      <p className="text-xs sm:text-lg font-bold">
                        {item.patient.name}
                      </p>
                    </td>
                    <td className="w-1/4 sm:p-3 align-middle text-center">
                      <p className="text-xs sm:text-md">{item.date}</p>
                    </td>
                    <td className="w-1/4 sm:p-3 align-middle text-center">
                      <p className="text-xs sm:text-md">{item.status}</p>
                    </td>
                    <td className="w-1/4 sm:p-3 align-middle text-right">
                      <div className="flex gap-2 justify-end flex-col sm:flex-row">
                        {/* Only allow status change if appointment is pending */}
                        <button
                          disabled={item.status !== "PENDING"}
                          className={`sm:px-4 sm:py-2 rounded text-xs sm:text-md ${
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
                          className={`sm:px-4 sm:py-2 rounded text-xs sm:text-md ${
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <Pagination setPage={setPage} currentPage={page} />
        </div>
      </div>
      {/* Status update modal */}
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
      {/* Notifications */}
      {notification && (
        <div className="fixed top-4 bg-blue-500 text-white px-4 py-2 rounded shadow z-50 animate-pulse">
          {notification}
        </div>
      )}
      {errorNotification && (
        <div className="fixed top-4 bg-red-500 text-white px-4 py-2 rounded shadow z-50 animate-pulse">
          {errorNotification}
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
